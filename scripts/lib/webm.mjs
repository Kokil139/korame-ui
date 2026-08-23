/**
 * A minimal WebM (Matroska) muxer for VP8 keyframes.
 *
 * Why this exists: this machine has no ffmpeg, no ImageMagick and no encoder
 * library, and adding one would break the "no unjustified dependencies" rule
 * for what is a build-time asset step. But `sharp` already ships a WebP
 * encoder, and a lossy WebP file *is* a single VP8 keyframe wrapped in a RIFF
 * container — so a sequence of WebP frames can be unwrapped and re-muxed into
 * a valid `.webm` with nothing but the dependency we already have.
 *
 * The trade-off is that every frame is a keyframe: there is no inter-frame
 * prediction, so files are larger than a real VP9 encode would produce. That
 * is affordable here only because the artwork is dark, flat and gradient-based
 * and compresses to a few KB a frame — measure before raising the resolution
 * or frame rate. It also has one genuine upside: every frame is independently
 * decodable, so looping and seeking never stall on a missing reference frame.
 *
 * Spec: https://www.matroska.org/technical/elements.html
 */

/* ------------------------------------------------------------ EBML atoms */

/**
 * EBML variable-length integer, used for every element's size field.
 * The leading marker bit says how many bytes the integer occupies.
 */
function vint(n) {
    for (let len = 1; len <= 8; len++) {
        // The all-ones value at each width is reserved to mean "unknown size".
        const max = 2 ** (7 * len) - 1;
        if (n < max) {
            const buf = Buffer.alloc(len);
            let v = n + 2 ** (7 * len); // set the marker bit
            for (let i = len - 1; i >= 0; i--) {
                buf[i] = v % 256;
                v = Math.floor(v / 256);
            }
            return buf;
        }
    }
    throw new Error(`vint too large: ${n}`);
}

/** Big-endian unsigned integer in the fewest bytes that hold it. */
function uint(n) {
    const bytes = [];
    let v = n;
    do {
        bytes.unshift(v % 256);
        v = Math.floor(v / 256);
    } while (v > 0);
    return Buffer.from(bytes);
}

/** 64-bit big-endian float, the form Matroska uses for Duration. */
function float64(n) {
    const buf = Buffer.alloc(8);
    buf.writeDoubleBE(n);
    return buf;
}

/** id + size + payload. `id` is the element ID as raw bytes. */
function el(id, payload) {
    return Buffer.concat([Buffer.from(id), vint(payload.length), payload]);
}

const cat = (...parts) => Buffer.concat(parts);

/* --------------------------------------------------------------- element IDs */

const ID = {
    EBML: [0x1a, 0x45, 0xdf, 0xa3],
    EBMLVersion: [0x42, 0x86],
    EBMLReadVersion: [0x42, 0xf7],
    EBMLMaxIDLength: [0x42, 0xf2],
    EBMLMaxSizeLength: [0x42, 0xf3],
    DocType: [0x42, 0x82],
    DocTypeVersion: [0x42, 0x87],
    DocTypeReadVersion: [0x42, 0x85],

    Segment: [0x18, 0x53, 0x80, 0x67],

    Info: [0x15, 0x49, 0xa9, 0x66],
    TimecodeScale: [0x2a, 0xd7, 0xb1],
    Duration: [0x44, 0x89],
    MuxingApp: [0x4d, 0x80],
    WritingApp: [0x57, 0x41],

    Tracks: [0x16, 0x54, 0xae, 0x6b],
    TrackEntry: [0xae],
    TrackNumber: [0xd7],
    TrackUID: [0x73, 0xc5],
    TrackType: [0x83],
    FlagLacing: [0x9c],
    DefaultDuration: [0x23, 0xe3, 0x83],
    CodecID: [0x86],
    Video: [0xe0],
    PixelWidth: [0xb0],
    PixelHeight: [0xba],

    Cluster: [0x1f, 0x43, 0xb6, 0x75],
    Timecode: [0xe7],
    SimpleBlock: [0xa3],
};

/* ------------------------------------------------------ WebP -> VP8 payload */

/**
 * Pulls the raw VP8 keyframe bitstream out of a lossy WebP file.
 *
 * A simple-format lossy WebP is `RIFF....WEBP` followed by one `VP8 ` chunk
 * whose payload is exactly the VP8 keyframe we want. Anything else — `VP8L`
 * (lossless) or `VP8X` (extended, i.e. alpha/animation/metadata) — is not a
 * plain VP8 frame, so we refuse rather than emit a file that will not decode.
 */
export function vp8FromWebP(buf) {
    if (buf.subarray(0, 4).toString('latin1') !== 'RIFF' || buf.subarray(8, 12).toString('latin1') !== 'WEBP') {
        throw new Error('not a WebP file');
    }

    let off = 12;
    while (off + 8 <= buf.length) {
        const id = buf.subarray(off, off + 4).toString('latin1');
        const size = buf.readUInt32LE(off + 4);
        const body = buf.subarray(off + 8, off + 8 + size);

        if (id === 'VP8 ') return body;
        if (id === 'VP8L') {
            throw new Error('lossless WebP has no VP8 frame — encode with lossless:false');
        }
        if (id === 'VP8X') {
            throw new Error('extended WebP (alpha/animation) — encode opaque, non-animated');
        }

        off += 8 + size + (size & 1); // chunks are padded to even lengths
    }
    throw new Error('no VP8 chunk found in WebP');
}

/* ------------------------------------------------------------------ muxer */

/**
 * Builds a complete WebM file from VP8 keyframes.
 *
 * Every frame goes into a single Cluster. SimpleBlock timecodes are a signed
 * 16-bit offset from the cluster's own timecode, so one cluster is only valid
 * while the clip is under ~32.7s — which is enforced below rather than left to
 * produce a subtly corrupt file.
 *
 * @param {Buffer[]} frames VP8 keyframe bitstreams, in order
 * @param {{width:number,height:number,fps:number}} opts
 * @returns {Buffer} the .webm file
 */
export function muxWebM(frames, { width, height, fps }) {
    if (!frames.length) throw new Error('no frames to mux');

    const msPerFrame = 1000 / fps;
    const durationMs = frames.length * msPerFrame;
    if (durationMs > 32767) {
        throw new Error(`clip too long for a single cluster (${durationMs}ms) — split into clusters`);
    }

    const header = el(
        ID.EBML,
        cat(
            el(ID.EBMLVersion, uint(1)),
            el(ID.EBMLReadVersion, uint(1)),
            el(ID.EBMLMaxIDLength, uint(4)),
            el(ID.EBMLMaxSizeLength, uint(8)),
            el(ID.DocType, Buffer.from('webm')),
            el(ID.DocTypeVersion, uint(2)),
            el(ID.DocTypeReadVersion, uint(2)),
        ),
    );

    const info = el(
        ID.Info,
        cat(
            el(ID.TimecodeScale, uint(1_000_000)), // timecodes are milliseconds
            el(ID.Duration, float64(durationMs)),
            el(ID.MuxingApp, Buffer.from('korame-artwork')),
            el(ID.WritingApp, Buffer.from('korame-artwork')),
        ),
    );

    const tracks = el(
        ID.Tracks,
        el(
            ID.TrackEntry,
            cat(
                el(ID.TrackNumber, uint(1)),
                el(ID.TrackUID, uint(1)),
                el(ID.TrackType, uint(1)), // 1 = video
                el(ID.FlagLacing, uint(0)),
                el(ID.DefaultDuration, uint(Math.round(1e9 / fps))), // nanoseconds
                el(ID.CodecID, Buffer.from('V_VP8')),
                el(ID.Video, cat(el(ID.PixelWidth, uint(width)), el(ID.PixelHeight, uint(height)))),
            ),
        ),
    );

    const blocks = frames.map((frame, i) => {
        const head = Buffer.alloc(4);
        head[0] = 0x81; // track 1 as a 1-byte vint
        head.writeInt16BE(Math.round(i * msPerFrame), 1);
        head[3] = 0x80; // keyframe
        return el(ID.SimpleBlock, cat(head, frame));
    });

    const cluster = el(ID.Cluster, cat(el(ID.Timecode, uint(0)), ...blocks));

    return cat(header, el(ID.Segment, cat(info, tracks, cluster)));
}
