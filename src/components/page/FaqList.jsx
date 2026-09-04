import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Accordion FAQ, reused by every page that has questions.
 *
 * One deliberate difference from the usual implementation: **collapsed
 * panels stay in the DOM.** The obvious build unmounts them through
 * AnimatePresence, which is cheaper  but Google requires the answer text of
 * an FAQPage to be present in the HTML it receives, and with pre-rendering
 * that HTML is a snapshot of the initial render. Unmounting would ship one
 * answer and claim seven in the structured data, which is a rich-result
 * violation rather than a missed opportunity.
 *
 * So the panel is height-animated instead, and marked `inert` while closed so
 * it is skipped by the keyboard and the accessibility tree even though the
 * text is still in the document.
 */
export default function FaqList({ faqs, defaultOpen = 0 }) {
    const [open, setOpen] = useState(defaultOpen);
    const reduced = useReducedMotion();
    const baseId = useId().replace(/:/g, '');

    return (
        <dl className="divide-y divide-border border-y border-border">
            {faqs.map((item, i) => {
                const isOpen = open === i;
                const panelId = `${baseId}-panel-${i}`;
                const buttonId = `${baseId}-button-${i}`;

                return (
                    <div key={item.q}>
                        <dt>
                            <button
                                id={buttonId}
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpen(isOpen ? -1 : i)}
                                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-brand-400"
                            >
                                <span className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-400 sm:text-xl">
                                    {item.q}
                                </span>

                                {/* One icon rotated 45° to become a close
                                    affordance  cheaper than swapping nodes
                                    and it animates continuously. */}
                                <motion.span
                                    animate={{ rotate: isOpen ? 45 : 0 }}
                                    transition={
                                        reduced
                                            ? { duration: 0 }
                                            : { type: 'spring', bounce: 0.3, visualDuration: 0.3 }
                                    }
                                    className={cn(
                                        'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-border transition-colors',
                                        isOpen
                                            ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                                            : 'text-muted-foreground group-hover:border-brand-500/40',
                                    )}
                                >
                                    <Plus className="size-4" aria-hidden="true" />
                                </motion.span>
                            </button>
                        </dt>

                        <motion.dd
                            id={panelId}
                            aria-labelledby={buttonId}
                            /* `inert` keeps the collapsed copy out of the tab
                               order and the accessibility tree while leaving it
                               in the HTML for crawlers. */
                            inert={isOpen ? undefined : ''}
                            initial={false}
                            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                            transition={
                                reduced
                                    ? { duration: 0 }
                                    : {
                                          type: 'spring',
                                          bounce: 0,
                                          visualDuration: 0.32,
                                          opacity: { duration: 0.2 },
                                      }
                            }
                            className="overflow-hidden"
                        >
                            <p className="max-w-3xl pb-7 pr-14 text-pretty leading-relaxed text-muted-foreground">
                                {item.a}
                            </p>
                        </motion.dd>
                    </div>
                );
            })}
        </dl>
    );
}
