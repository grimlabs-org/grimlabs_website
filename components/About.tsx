'use client';

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT + DOMAINS + SKILLS — Renaissance Polymath Aesthetic
   CSS vars: --accent, --muted-foreground, --border-primary, --foreground,
             --background, --card-bg, --accent-dim, --anatomy-stroke
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Schematic Portrait SVG ─── */
function SchematicPortrait() {
    return (
        <div className="relative w-full max-w-70 aspect-square">
            {/* Outer frame */}
            <div
                className="absolute inset-0"
                style={{ border: '1px solid var(--border-primary)' }}
            />
            <div
                className="absolute inset-3"
                style={{ border: '1px dashed var(--border-primary)', opacity: 0.5 }}
            />

            {/* Corner measurement ticks */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4`}>
                    <div
                        className={`absolute ${pos} w-full h-px`}
                        style={{ background: 'var(--accent)' }}
                    />
                    <div
                        className={`absolute ${pos} h-full w-px`}
                        style={{ background: 'var(--accent)' }}
                    />
                </div>
            ))}

            {/* SVG Schematic Figure */}
            <svg
                className="w-full h-full p-10 opacity-70"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Grid */}
                <defs>
                    <pattern id="aboutGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--border-primary)" strokeWidth="0.3" />
                    </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#aboutGrid)" />

                {/* Central IC chip */}
                <rect x="70" y="50" width="60" height="40" stroke="var(--muted-foreground)" strokeWidth="1" fill="none" />
                <rect x="75" y="55" width="50" height="30" stroke="var(--border-primary)" strokeWidth="0.5" fill="none" />

                {/* IC pins — left */}
                {[58, 65, 72, 79].map((y) => (
                    <line key={`l${y}`} x1="70" y1={y} x2="55" y2={y} stroke="var(--muted-foreground)" strokeWidth="0.5" />
                ))}
                {/* IC pins — right */}
                {[58, 65, 72, 79].map((y) => (
                    <line key={`r${y}`} x1="130" y1={y} x2="145" y2={y} stroke="var(--muted-foreground)" strokeWidth="0.5" />
                ))}

                {/* Spine / data bus */}
                <line x1="100" y1="90" x2="100" y2="140" stroke="var(--accent)" strokeWidth="1" />
                <line x1="95" y1="90" x2="95" y2="130" stroke="var(--border-primary)" strokeWidth="0.5" />
                <line x1="105" y1="90" x2="105" y2="130" stroke="var(--border-primary)" strokeWidth="0.5" />

                {/* Arms / peripheral buses */}
                <line x1="55" y1="100" x2="85" y2="100" stroke="var(--muted-foreground)" strokeWidth="0.5" />
                <line x1="115" y1="100" x2="145" y2="100" stroke="var(--muted-foreground)" strokeWidth="0.5" />

                {/* I/O nodes */}
                <circle cx="50" cy="100" r="4" stroke="var(--muted-foreground)" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="100" r="1.5" fill="var(--accent)" opacity="0.4" />
                <circle cx="150" cy="100" r="4" stroke="var(--muted-foreground)" strokeWidth="0.5" fill="none" />
                <circle cx="150" cy="100" r="1.5" fill="var(--accent)" opacity="0.4" />

                {/* Legs / ground planes */}
                <line x1="90" y1="140" x2="80" y2="165" stroke="var(--muted-foreground)" strokeWidth="0.5" />
                <line x1="110" y1="140" x2="120" y2="165" stroke="var(--muted-foreground)" strokeWidth="0.5" />

                {/* Ground symbols */}
                <path d="M 75 168 L 85 168 M 77 171 L 83 171 M 79 174 L 81 174" stroke="var(--muted-foreground)" strokeWidth="0.5" fill="none" />
                <path d="M 115 168 L 125 168 M 117 171 L 123 171 M 119 174 L 121 174" stroke="var(--muted-foreground)" strokeWidth="0.5" fill="none" />

                {/* Annotation */}
                <text x="100" y="195" textAnchor="middle" fill="var(--border-primary)" fontSize="6" fontFamily="monospace">
                    UNIT: HUMAN
                </text>
            </svg>

            {/* Figure label */}
            <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[4px] uppercase whitespace-nowrap"
                style={{ color: 'var(--muted-foreground)' }}
            >
                Fig. 01
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
export default function About() {

    // const aboutParagraphs = [
    //     "Grim Labs is a public, independent research and engineering lab dedicated to building, testing, and refining ideas over the long term.",
    //     "We explore innovative solutions across technology and science, documenting our work openly to engage collaborators and share insights with the broader community.",
    //     "Our goal is to make research and experimentation accessible, meaningful, and impactful for everyone involved.",
    // ]

    // const stats = [
    //     { label: 'DOMAINS', value: '04' },
    //     { label: 'YEARS', value: '1+' },
    //     { label: 'PROJECTS', value: '1+' },
    // ];

    // const domains = [
    //     {
    //         number: '01',
    //         name: 'Cybersecurity',
    //         desc: 'Vulnerability research, penetration testing, binary analysis across network, web, and embedded attack surfaces.',
    //     },
    //     {
    //         number: '02',
    //         name: 'Embedded Systems',
    //         desc: 'Firmware development, PCB design, hardware hacking, circuit analysis, and microcontroller programming.',
    //     },
    //     {
    //         number: '03',
    //         name: 'AI & Computation',
    //         desc: 'Machine learning, computational theory, mathematical foundations, and applied algorithm design.',
    //     },
    //     {
    //         number: '04',
    //         name: 'Full-Stack & Web3',
    //         desc: 'Scalable architectures, smart contract development, DeFi protocols, and modern web platforms.',
    //     },
    // ];

    // const skills = [
    //     {
    //         title: 'Security',
    //         items: [
    //             'Web application pentesting',
    //             'Network security assessment',
    //             'Vulnerability research',
    //             'Binary exploitation',
    //             'Reverse engineering',
    //             'OSINT',
    //         ],
    //     },
    //     {
    //         title: 'Development',
    //         items: [
    //             'Full-stack web (React / Next.js)',
    //             'API design & implementation',
    //             'Cloud infrastructure',
    //             'TypeScript / Python / Go',
    //             'Docker / Linux admin',
    //             'Git workflows',
    //         ],
    //     },
    //     {
    //         title: 'AI / ML',
    //         items: [
    //             'Model development & training',
    //             'ML system deployment',
    //             'Data pipeline engineering',
    //             'Computational theory',
    //             'Applied mathematics',
    //             'Algorithm design',
    //         ],
    //     },
    //     {
    //         title: 'Hardware',
    //         items: [
    //             'Firmware development',
    //             'PCB design (KiCad)',
    //             'Circuit analysis',
    //             'JTAG / SWD debugging',
    //             'Embedded Linux',
    //             'RF basics',
    //         ],
    //     },
    // ];

    const aboutParagraphs = [
        "GRIM LABS is an independent research and engineering laboratory focused on understanding, building, and analyzing complex systems.",

        "Our work spans software systems, hardware systems, security research, and applied sciences. Through experimentation, engineering, and first-principles investigation, we explore how systems are designed, how they behave, and how they fail.",

        "By documenting projects, research, discoveries, and lessons learned openly, we aim to build a long-term body of knowledge that bridges theory, engineering, and real-world systems."
    ];

    const stats = [
        { label: 'DOMAINS', value: '04' },
        { label: 'ACTIVE PROJECTS', value: '01+' },
        { label: 'RESEARCH AREAS', value: '8+' },
    ];

    const domains = [
        {
            number: '01',
            name: 'Software Systems',
            desc: 'Application engineering, software architecture, automation, developer tooling, intelligent systems, and computational infrastructure.',
        },
        {
            number: '02',
            name: 'Hardware Systems',
            desc: 'Embedded systems, electronics, PCB design, firmware development, electrical engineering, and physical computing.',
        },
        {
            number: '03',
            name: 'Security Research',
            desc: 'Vulnerability discovery, application security, adversarial analysis, system failures, reverse engineering, and security automation.',
        },
        {
            number: '04',
            name: 'Applied Sciences',
            desc: 'Mathematics, physics, computational modeling, systems theory, and the scientific foundations of engineering.',
        },
    ];

    const skills = [
        {
            title: 'Software Systems',
            items: [
                'Web applications',
                'Backend systems',
                'Developer tooling',
                'Automation platforms',
                'System architecture',
                'Computational infrastructure',
            ],
        },
        {
            title: 'Hardware Systems',
            items: [
                'PCB design',
                'Embedded systems',
                'Firmware development',
                'Electrical design',
                'Industrial control systems',
                'Physical computing',
            ],
        },
        {
            title: 'Security Research',
            items: [
                'Application security',
                'Vulnerability research',
                'Attack surface analysis',
                'Security automation',
                'Reverse engineering',
                'System failure analysis',
            ],
        },
        {
            title: 'Applied Sciences',
            items: [
                'Mathematics',
                'Physics',
                'Computational modeling',
                'Systems theory',
                'Scientific computing',
                'Engineering analysis',
            ],
        },
    ];

    return (
        <>
            {/* ═══════════ ABOUT ═══════════ */}
            <section id="about" className="relative py-36 px-6 md:px-10">
                <div className="container mx-auto max-w-6xl">
                    {/* Section header */}
                    <div className="section-marker mb-4">001 — About</div>
                    <h2
                        className="mb-16"
                        style={{
                            fontSize: 'clamp(32px, 4vw, 56px)',
                            fontWeight: 300,
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Profile
                    </h2>

                    {/* Content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
                        {/* Left — Schematic Portrait */}
                        <div className="lg:col-span-4 flex justify-center lg:justify-start pt-4 backdrop-blur-xs">
                            <SchematicPortrait />
                        </div>

                        {/* Center — Bio */}
                        <div className="lg:col-span-5">
                            <div className="space-y-5">
                                {aboutParagraphs.map((text, index) => (
                                    <p
                                        key={index}
                                        style={{
                                            fontSize: '16px',
                                            lineHeight: 1.9,
                                            fontWeight: 400,
                                            color: index === 0
                                                ? 'var(--foreground)'
                                                : 'var(--muted-foreground)',
                                        }}
                                    >
                                        {text}
                                    </p>
                                ))}
                            </div>

                            <div className="red-line mt-10" />
                        </div>

                        {/* Right — Stats */}
                        <div className="lg:col-span-3">
                            <div
                                className="lg:border-l lg:pl-12 space-y-10"
                                style={{ borderColor: 'var(--border-primary)' }}
                            >
                                {stats.map((stat, i) => (
                                    <div key={i}>
                                        <div
                                            className="text-[10px] tracking-[4px] uppercase mb-2"
                                            style={{ color: 'var(--accent)' }}
                                        >
                                            {stat.label}
                                        </div>
                                        <div
                                            className=""
                                            style={{
                                                fontSize: '40px',
                                                fontWeight: 300,
                                                lineHeight: 1,
                                                color: 'var(--foreground)',
                                            }}
                                        >
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ RESEARCH DOMAINS ═══════════ */}
            <section
                id="domains"
                className="relative py-36 px-6 md:px-10"
            >
                <div className="container mx-auto max-w-6xl">
                    {/* Section header */}
                    <div className="section-marker mb-4">002 — Domains</div>
                    <h2
                        className=" mb-16"
                        style={{
                            fontSize: 'clamp(32px, 4vw, 56px)',
                            fontWeight: 300,
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Research<br />Domains
                    </h2>

                    {/* Domain cards — 1px gap grid */}
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 backdrop-blur-xs"
                        style={{
                            gap: '1px',
                        }}
                    >
                        {domains.map((d) => (
                            <div
                                key={d.number}
                                className="grim-card p-8 cursor-crosshair"
                            >
                                <div className="domain-number mb-3">{d.number}</div>
                                <h3
                                    className="mb-3"
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 400,
                                        color: 'var(--foreground)',
                                        letterSpacing: '0.3px',
                                    }}
                                >
                                    {d.name}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '16px',
                                        color: 'var(--muted-foreground)',
                                        lineHeight: 1.8,
                                        fontWeight: 300,
                                    }}
                                >
                                    {d.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TECHNICAL CARTOGRAPHY (SKILLS) ═══════════ */}
            <section
                id="skills"
                className="relative py-36 px-6 md:px-10 border-t"
                style={{ borderColor: 'var(--border-primary)' }}
            >
                <div className="container mx-auto max-w-6xl">
                    {/* Section header */}
                    <div className="section-marker mb-4">003 — Knowledge</div>
                    <h2
                        className="mb-16"
                        style={{
                            fontSize: 'clamp(32px, 4vw, 56px)',
                            fontWeight: 300,
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Technical<br />Cartography
                    </h2>

                    {/* Skills grid — clean 4-column list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 backdrop-blur-xs">
                        {skills.map((skill, index) => (
                            <div key={index}>
                                <div
                                    className="text-[16px] font-bold tracking-[4px] uppercase mb-5"
                                    style={{ color: 'var(--accent)'}}
                                >
                                    {skill.title}
                                </div>
                                <ul className="list-none p-0 m-0">
                                    {skill.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="py-1.5 transition-colors duration-300 cursor-default"
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 300,
                                                color: 'var(--muted-foreground)',
                                                borderBottom: '1px solid var(--border-primary)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--foreground)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'var(--muted-foreground)';
                                            }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}