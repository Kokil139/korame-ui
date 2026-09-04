/**
 * Blog content.
 *
 * Deliberately a small number of genuinely useful articles rather than a
 * large number of thin ones. Each post exists because we answer the question
 * in it regularly, and each one is written to be worth reading by someone who
 * will never hire us.
 *
 * Body blocks:
 *   { type: 'p',     text }
 *   { type: 'h2',    text }
 *   { type: 'h3',    text }
 *   { type: 'ul',    items: [] }
 *   { type: 'ol',    items: [] }
 *   { type: 'code',  lang, code }
 *   { type: 'note',  text }
 */

export const POSTS = [
    {
        slug: 'web-development-vs-web-app-development',
        title: 'Web Development vs Web App Development: How to Tell Which You Need',
        metaTitle: 'Web Development vs Web App Development | Korame',
        description:
            'The difference is state, not size. A practical test for deciding whether you are commissioning a website or an application  and why guessing wrong costs a rebuild.',
        date: '2026-01-14',
        updated: '2026-01-14',
        readingTime: 7,
        topic: 'Architecture',
        excerpt:
            'Most projects that get rebuilt within two years were scoped as the wrong one of these. The dividing line is simpler than the proposals suggest.',
        services: ['web-development', 'web-app-development'],
        related: ['how-to-choose-a-web-development-company', 'custom-software-vs-off-the-shelf'],
        body: [
            { type: 'p', text: 'Almost every quote you receive will use both phrases, often in the same paragraph, and the price difference between them can be a factor of five. That is not vendors being slippery. They describe genuinely different engineering problems, and the reason projects get rebuilt eighteen months after launch is usually that they were scoped as one and turned out to be the other.' },
            { type: 'p', text: 'Here is the test we actually use.' },

            { type: 'h2', text: 'The dividing line is state, not size' },
            { type: 'p', text: 'A website presents. Everyone who visits a given URL sees the same thing, and nothing a visitor does needs to survive them closing the tab. A fifty-page site with video, animation and a complex information architecture is still a website.' },
            { type: 'p', text: 'An application holds state on the visitor\'s behalf. There are accounts, saved records, permissions, or a workflow that spans more than one session. A five-screen tool where two people can edit the same record is an application, and it is a harder engineering problem than the fifty-page site.' },
            { type: 'p', text: 'Ask one question: if two people use this at the same time, can they interfere with each other? If the answer is no, you are commissioning a website. If the answer is yes  or if it is "I don\'t know"  you are commissioning an application.' },

            { type: 'h2', text: 'Why the architectures are genuinely different' },
            { type: 'p', text: 'This is not a pricing convention. The two shapes optimise for different things, and the optimisations are close to opposites.' },
            { type: 'h3', text: 'A website optimises for delivery' },
            { type: 'ul', items: [
                'The best possible architecture is pre-rendered HTML on a CDN edge, because there is no per-visitor computation to do.',
                'Success is measured in Largest Contentful Paint, crawlability and conversion.',
                'It scales without effort: a static file serves ten visitors or ten million the same way.',
                'It can be genuinely cheap to run  often within a free hosting tier.',
            ] },
            { type: 'h3', text: 'An application optimises for correctness' },
            { type: 'ul', items: [
                'Nothing can be cached globally, because every response depends on who is asking.',
                'Success is measured in whether the rules hold under concurrent use.',
                'Scaling is a real engineering exercise, and the database is usually the first limit.',
                'Running cost tracks usage, and the operational burden  monitoring, backups, incident response  never goes away.',
            ] },
            { type: 'p', text: 'Every hard question in an application is about the second list. What happens when two people save the same record within a second of each other? What happens when a session expires halfway through a multi-step form? Who is allowed to see this specific row, and where is that enforced? None of those questions exist for a marketing site, and all of them have to be answered before you write the first screen.' },

            { type: 'h2', text: 'The specific mistake that causes rebuilds' },
            { type: 'p', text: 'The expensive failure is almost always the same one: a website is built, then a login is added to it.' },
            { type: 'p', text: 'It starts reasonably. The site is live, and someone asks for a customer area  just a page where clients can see their own documents. A page is added, an auth plugin goes in, and it works. Then the customer area needs roles. Then it needs an admin view. Then a second business unit needs its own data separated from the first.' },
            { type: 'p', text: 'By that point you have an application with no permission model, authorisation enforced by hiding buttons in the interface, and no audit trail  built on infrastructure chosen because it served static pages quickly. The rewrite is not a failure of the developers who built the original. The original was correctly built for what it was asked to be.' },
            { type: 'note', text: 'If there is any realistic chance of accounts appearing within two years, say so at the start. Designing a data model that can accommodate them later is nearly free. Retrofitting one is not.' },

            { type: 'h2', text: 'Where the boundary genuinely blurs' },
            { type: 'p', text: 'Three cases sit on the line and are worth naming, because they get argued about in every scoping call.' },
            { type: 'p', text: '<strong>E-commerce.</strong> A storefront is mostly a website  the catalogue is public, cacheable and identical for everyone. Checkout and accounts are an application. The reason established platforms are usually the right answer is that they have already solved the application half properly, including the compliance parts you do not want to own.' },
            { type: 'p', text: '<strong>Contact forms.</strong> A form that sends an email is still a website. Nothing persists in a way anyone reads back. The moment submissions become records someone manages in an interface, it is an application.' },
            { type: 'p', text: '<strong>Content management.</strong> A CMS is an application, but it is somebody else\'s application. Using a headless CMS to edit a static site keeps your project on the website side of the line entirely, which is the whole appeal.' },

            { type: 'h2', text: 'What to do with this' },
            { type: 'ol', items: [
                'Write down every piece of information the system must remember, and who is allowed to see each one. If that list is empty, it is a website.',
                'Ask whether two people using it simultaneously can interfere. If yes, it is an application.',
                'Ask what happens two years out. Scope for that answer, not just for launch.',
                'If it is a website, insist on pre-rendered HTML and a real performance budget  those are the things that determine whether it earns anything.',
                'If it is an application, insist that the permission model is designed before the screens are. It is the one decision that touches every query in the system.',
            ] },
            { type: 'p', text: 'The two are not a hierarchy. A superbly engineered marketing site is more valuable to most businesses than a mediocre application. The failure is only ever in building one while believing you are buying the other.' },
        ],
    },

    {
        slug: 'custom-software-vs-off-the-shelf',
        title: 'Custom Software vs Off-the-Shelf: An Honest Framework',
        metaTitle: 'Custom Software vs Off-the-Shelf Software | Korame',
        description:
            'When bespoke software is worth building and when it is an expensive mistake  including the ongoing costs most build-versus-buy comparisons leave out.',
        date: '2026-02-03',
        updated: '2026-02-03',
        readingTime: 8,
        topic: 'Strategy',
        excerpt:
            'Most build-versus-buy comparisons put a one-off project cost next to a monthly subscription. That comparison is wrong in a way that always favours building.',
        services: ['custom-software-development', 'software-development'],
        related: ['web-development-vs-web-app-development', 'how-to-choose-a-web-development-company'],
        body: [
            { type: 'p', text: 'We build custom software, so treat what follows accordingly  and then notice that the framework below tells a good number of people not to buy it. A project that should not exist is the most expensive kind of project, and it is worse for us than a declined enquiry, because it ends badly with our name on it.' },

            { type: 'h2', text: 'The comparison almost everyone gets wrong' },
            { type: 'p', text: 'The usual analysis puts a build quote next to a subscription price: "£60,000 to build, or £400 a month for the product  the build pays for itself in twelve years." Or, framed by a vendor with an interest: "£400 a month is £24,000 over five years, so building is obviously better."' },
            { type: 'p', text: 'Both are wrong, because a build cost is not a total cost. Custom software has an ongoing bill that starts the day it launches:' },
            { type: 'ul', items: [
                'Hosting and infrastructure  usually modest, but never zero.',
                'Dependency and security updates. Software that is not maintained becomes a vulnerability, not a fixed asset.',
                'Bug fixes and support, including the hour someone spends explaining an edge case.',
                'Changes as the business moves  which is the whole reason you built something specific in the first place.',
                'Key-person risk, unless the system is documented well enough for someone new to pick it up.',
            ] },
            { type: 'p', text: 'A realistic figure for maintaining a custom business application is somewhere between 15% and 25% of the original build cost per year. Any comparison that omits that line is not a comparison.' },
            { type: 'note', text: 'Compare five-year total cost of ownership on both sides. Build cost plus five years of maintenance and hosting, against subscription plus configuration plus integration work plus the staff hours currently spent bridging gaps.' },

            { type: 'h2', text: 'When off-the-shelf is the right purchase' },
            { type: 'p', text: 'Buy when any of these are true, and buy without embarrassment:' },
            { type: 'ul', items: [
                'The process is genuinely standard. Payroll, accounting, email and core CRM are solved problems, and your version will not be better.',
                'A mature product covers 80% or more of the requirement without heavy configuration.',
                'The capability is a cost of doing business, not a differentiator. Nobody chooses you because of your expense-approval workflow.',
                'You do not have an ongoing budget for maintenance. Unmaintained custom software degrades into a liability within a few years.',
                'The product carries compliance certifications you would otherwise have to obtain yourself. That is often worth more than the software.',
            ] },
            { type: 'p', text: 'A vendor with a thousand customers has hit failure modes you would take years to discover, and has already paid for the fixes.' },

            { type: 'h2', text: 'When custom is genuinely worth it' },
            { type: 'p', text: 'Build when one of these is clearly true:' },
            { type: 'ul', items: [
                'The workflow is the advantage. If what you do differently is why customers choose you, forcing it into a generic product erodes the thing that works.',
                'You are already paying for several tools plus the manual labour of moving data between them. That labour is the real cost and it rarely appears in anyone\'s comparison.',
                'Per-seat licensing has outgrown its value as you have grown, and the curve is going the wrong way.',
                'Your data is the asset and you need it in a shape no vendor exposes  most commonly for reporting nobody\'s standard export supports.',
                'The integration and configuration work required to make a bought product fit is approaching the cost of building the specific part outright.',
            ] },

            { type: 'h2', text: 'The answer is usually "both"' },
            { type: 'p', text: 'The framing as a binary is the deepest flaw in the whole debate. The right architecture for most businesses is to buy the commodity pieces, build the part that is genuinely yours, and integrate them properly.' },
            { type: 'p', text: 'A manufacturer might buy accounting, buy CRM, and build the quoting engine that encodes thirty years of knowledge about how to price a job  because that engine is the business, and the other two are plumbing. The build is a fraction of the size of "a system to run the company", which means it can be delivered in months rather than years, and it fails in a contained way if it fails at all.' },
            { type: 'p', text: 'When someone proposes replacing everything with one bespoke platform, ask which parts of it are actually specific to you. The answer is usually a much smaller system than the one being proposed.' },

            { type: 'h2', text: 'Questions to put to anyone quoting you' },
            { type: 'ol', items: [
                'What will this cost to run and maintain per year after launch? A build quote without this number is incomplete.',
                'Which existing products did you evaluate, and specifically why do they not fit? "They\'re not flexible enough" is not an answer.',
                'What is the smallest version that delivers real value, and when is it in production? Anything with no working software for a year is a risk, not a plan.',
                'Who owns the code, the infrastructure and the data? The only acceptable answer is that you do, from the first commit.',
                'What happens if we want to move this in-house in two years? A good partner has a straightforward answer.',
            ] },
            { type: 'p', text: 'If a vendor cannot describe the circumstances under which you should not hire them, you are talking to a salesperson.' },
        ],
    },

    {
        slug: 'azure-static-web-apps-404-on-refresh',
        title: 'Why Azure Static Web Apps Returns 404 on Refresh (and the Fix That Does Not Break SEO)',
        metaTitle: 'Azure Static Web Apps 404 on Refresh  The Correct Fix | Korame',
        description:
            'The navigation fallback that fixes deep-link 404s on Azure Static Web Apps  and the mistake that makes every missing file return 200 and damage indexing.',
        date: '2026-03-11',
        updated: '2026-03-11',
        readingTime: 6,
        topic: 'Azure',
        excerpt:
            'The one-line fix is easy to find. The version of it that does not make every missing file return 200 OK is not.',
        services: ['cloud-solutions'],
        related: ['how-to-choose-a-web-development-company', 'web-development-vs-web-app-development'],
        body: [
            { type: 'p', text: 'You deploy a React, Vue or Angular app to Azure Static Web Apps. The homepage works. Clicking through the navigation works. Then you refresh on <code>/about</code>, or paste a deep link into a new tab, and you get a 404.' },
            { type: 'p', text: 'This is not a bug, and the usual fix found in five minutes of searching creates a subtler problem that will cost you in Search Console.' },

            { type: 'h2', text: 'Why it happens' },
            { type: 'p', text: 'A single-page application has one real file  <code>index.html</code>. Routes like <code>/about</code> exist only in your JavaScript router, which runs after that file loads. When you navigate inside the app, the router intercepts the click and no request reaches the server.' },
            { type: 'p', text: 'A refresh is different. The browser asks Azure directly for <code>/about</code>. Azure looks for a file at that path, finds nothing, and does the correct thing: it returns 404. The router never gets a chance to run, because the document that contains it was never served.' },

            { type: 'h2', text: 'The fix' },
            { type: 'p', text: 'Add a <code>staticwebapp.config.json</code> at the root of your build output  the directory named in <code>output_location</code> in your workflow, or a file in <code>public/</code> that your bundler copies there.' },
            { type: 'code', lang: 'json', code: `{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "*.{css,js,json,txt,xml,webmanifest}", "*.{png,jpg,jpeg,svg,webp,avif,ico}", "*.{woff,woff2,ttf,otf}", "*.{mp4,webm}"]
  }
}` },
            { type: 'p', text: 'Any request that does not match a real file is now served <code>index.html</code>, the router boots, and it resolves the path itself.' },

            { type: 'h2', text: 'The part that matters, and that most guides skip' },
            { type: 'p', text: 'Almost every answer online gives you the rewrite without a meaningful <code>exclude</code> list  or with <code>"exclude": ["/images/*"]</code> and nothing else. That configuration says: serve <code>index.html</code> for literally anything not on disk.' },
            { type: 'p', text: 'Consider what that does to a request for a stylesheet you renamed and forgot to update. Instead of 404, the browser receives a complete HTML document with <code>Content-Type: text/html</code> and status <strong>200 OK</strong>. The stylesheet silently does not apply, and nothing in your logs registers a problem.' },
            { type: 'p', text: 'The search consequence is worse. Crawlers requesting anything that no longer exists get HTML and a 200. Google calls this a soft 404, and the effects are cumulative:' },
            { type: 'ul', items: [
                'Deleted pages never drop out of the index, because nothing ever tells the crawler they are gone.',
                'Crawl budget is spent re-fetching URLs that resolve to the same shell.',
                'Mistyped or hallucinated URLs from anywhere on the web become indexable pages.',
                'Search Console fills with "Duplicate without user-selected canonical" for URLs you never created.',
            ] },
            { type: 'p', text: 'The exclusion list above keeps asset requests honest. Anything with a recognisable file extension returns a real 404; only extensionless navigation requests get the fallback.' },

            { type: 'h2', text: 'Serving a real 404 page' },
            { type: 'p', text: 'With a fallback in place, an unknown route reaches your router, which renders your not-found component  with a 200 status, because the rewrite already happened. For a genuinely missing route you want the status to match the page.' },
            { type: 'p', text: 'Static Web Apps lets you attach a response override:' },
            { type: 'code', lang: 'json', code: `{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "*.{css,js,json,txt,xml,webmanifest}", "*.{png,jpg,jpeg,svg,webp,avif,ico}", "*.{woff,woff2,ttf,otf}"]
  },
  "responseOverrides": {
    "404": { "rewrite": "/404.html" }
  }
}` },
            { type: 'p', text: 'The stronger answer is to stop relying on the fallback for pages you know about. If you pre-render each route to its own <code>index.html</code> at build time, every real URL is a real file: Azure serves it directly with a 200, and crawlers get complete HTML without executing JavaScript. The navigation fallback then only ever catches genuine mistakes  which is what it should be for.' },

            { type: 'h2', text: 'Two adjacent problems worth fixing at the same time' },
            { type: 'h3', text: 'Caching' },
            { type: 'p', text: 'Bundlers fingerprint asset filenames, so those files can be cached permanently, while HTML must not be. Set both explicitly:' },
            { type: 'code', lang: 'json', code: `{
  "routes": [
    { "route": "/assets/*", "headers": { "cache-control": "public, max-age=31536000, immutable" } },
    { "route": "/*.html",   "headers": { "cache-control": "public, max-age=0, must-revalidate" } }
  ]
}` },
            { type: 'h3', text: 'One canonical hostname' },
            { type: 'p', text: 'After adding a custom domain, the generated <code>*.azurestaticapps.net</code> hostname stays live and serves the identical site. That is duplicate content on a domain you do not control. Add a canonical link tag on every page, and confirm your <code>www</code> and apex variants resolve to one host rather than both answering.' },

            { type: 'h2', text: 'A short checklist' },
            { type: 'ol', items: [
                'Deep links and refreshes work on every route.',
                'A request for a file that does not exist returns 404, not 200 with HTML.',
                'A genuinely unknown route returns a 404 status, not just a 404-looking page.',
                'Fingerprinted assets are immutable; HTML revalidates.',
                'Exactly one hostname is canonical, and the rest redirect to it.',
            ] },
        ],
    },

    {
        slug: 'how-to-choose-a-web-development-company',
        title: 'How to Choose a Web Development Company: Questions That Actually Separate Them',
        metaTitle: 'How to Choose a Web Development Company | Korame',
        description:
            'Portfolios all look the same and every agency says the same things. Nine questions whose answers genuinely differ, and what a good answer sounds like.',
        date: '2026-04-08',
        updated: '2026-04-08',
        readingTime: 8,
        topic: 'Working together',
        excerpt:
            'Every agency claims quality, communication and results. Here are the questions where the answers actually diverge  including the ones we would rather you asked us.',
        services: ['web-development', 'full-stack-development'],
        related: ['custom-software-vs-off-the-shelf', 'web-development-vs-web-app-development'],
        body: [
            { type: 'p', text: 'Three proposals arrive. All three portfolios look good. All three promise quality, communication and results, and the prices differ by a factor of four with no visible explanation.' },
            { type: 'p', text: 'The problem is that the things that distinguish a good build from a bad one are almost all invisible in a portfolio. A screenshot cannot tell you what the site weighs, whether it is accessible, whether the code can be handed to someone else, or whether anything will still be maintainable in two years. So ask about those directly.' },

            { type: 'h2', text: '1. "Can I see a site you built and run it through PageSpeed Insights with you?"' },
            { type: 'p', text: 'Do it live on the call, on a real client site, on mobile. This is the single most revealing question available to you, because it is objective and unpreparable.' },
            { type: 'p', text: 'You are not looking for a perfect score  real sites carry marketing tags and third-party embeds a developer does not control. You are listening to the explanation. A good answer sounds like: "That LCP is the hero image; we set it to load eagerly and the client later replaced it through the CMS without dimensions." A bad answer dismisses the tool.' },

            { type: 'h2', text: '2. "What happens if we stop working together in six months?"' },
            { type: 'p', text: 'You want: the repository is yours and always has been, the hosting is in your account, the domain is registered to you, and there is documentation good enough for someone else to continue.' },
            { type: 'p', text: 'The warning signs are a proprietary platform you would have to keep licensing, hosting only they can access, a domain registered in their name, or a build process that lives on one person\'s laptop. Some of this is deliberate lock-in. Some is just sloppiness. Both leave you stuck.' },

            { type: 'h2', text: '3. "Who specifically will write the code?"' },
            { type: 'p', text: 'Ask whether the people in the meeting are the people building it. Agencies that sell with seniors and deliver with juniors are common and not automatically wrong  but you should know, and a junior team needs review, which costs time somebody has to have budgeted.' },

            { type: 'h2', text: '4. "How do you approach accessibility?"' },
            { type: 'p', text: 'A good answer is specific and slightly unglamorous: semantic HTML, keyboard operability, visible focus states, contrast checked against a standard, real form labels, and testing with a screen reader on the important flows. It may include "here is where we would push back on a design".' },
            { type: 'p', text: 'A weak answer is "we follow best practices", or a promise of full WCAG AAA compliance  which almost nothing achieves and which suggests the standard has not been read.' },

            { type: 'h2', text: '5. "What is your performance budget, and where is it enforced?"' },
            { type: 'p', text: 'The word you want is enforced. A target that lives in a proposal is a wish. A target checked in the deployment pipeline is a constraint, and it is the only version that survives contact with the third month of a project.' },

            { type: 'h2', text: '6. "How will I edit content?"' },
            { type: 'p', text: 'There is no universally right answer, but there is a right process: they should ask what you actually intend to change and how often before recommending anything. A CMS you never use is cost and attack surface; no CMS when you publish weekly is a bottleneck that turns into a retainer.' },

            { type: 'h2', text: '7. "What does this cost to run per year?"' },
            { type: 'p', text: 'Hosting, domain, certificates, any services or licences, and maintenance. A partner who has thought about the whole lifecycle answers immediately. One who quotes only the build has told you something about how they think about the relationship afterwards.' },

            { type: 'h2', text: '8. "Tell me about a project that went badly."' },
            { type: 'p', text: 'Everyone has one. The answer you want takes some responsibility  a mis-scope, a bad technology choice, a late discovery  and describes what changed as a result. An answer where the client was entirely at fault tells you how the post-mortem on your project will read.' },

            { type: 'h2', text: '9. "What would you tell us not to do?"' },
            { type: 'p', text: 'A partner with judgement will have opinions: the CMS is unnecessary, the animation will hurt more than help, the timeline is optimistic, this should be an off-the-shelf product rather than a build. Someone who agrees with everything in a first meeting will keep agreeing right up until the invoice.' },

            { type: 'h2', text: 'On price' },
            { type: 'p', text: 'Wide price ranges for apparently identical scope usually mean the scopes are not identical. Before comparing numbers, check each proposal for: whether design is included or assumed, how many revision rounds, who writes the copy, whether responsive means tested on real devices, what accessibility work is included, whether there is a testing phase, what the support window is, and who owns the result.' },
            { type: 'p', text: 'Cheap proposals are often cheap because half of that list is absent, and each missing item comes back later as a change request. The most expensive proposal is not automatically the most thorough either  but a proposal that itemises what it excludes has usually been thought about.' },

            { type: 'h2', text: 'The underlying signal' },
            { type: 'p', text: 'You are looking for someone who asks you more questions than you ask them. A partner who wants to know what the site is for, who reaches it, what happens after they convert, and what has failed before is thinking about your outcome. One who wants a page count and a deadline is thinking about a deliverable.' },
        ],
    },
];

export const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

export const getPost = (slug) => POST_BY_SLUG[slug];

export const postPath = (slug) => `/blog/${slug}`;

/** Newest first  the order the index renders in. */
export const POSTS_BY_DATE = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
