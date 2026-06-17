import { client } from "@/sanity/lib/client";
import ProjectsPageServer from "@/components/ProjectsPageServer";

export const revalidate = 120

export default async function Projects() {
    const allProjects = await client.fetch(`*[_type == "project"] {_id}`);
    const count = allProjects.length;

    return (
        <section id="projects"
            className="min-h-screen py-16 px-6 transition-colors"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderColor: 'var(--border-primary)'
            }}>
            <div className="container mx-auto max-w-300">
                <div className="section-marker mb-4">004 — Projects</div>
                <div className="flex items-end justify-between mb-4" >
                    <h2
                        style={{
                            fontSize: 'clamp(40px, 4vw, 64px)',
                            fontWeight: 300,
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Selected<br />Works
                    </h2>
                    <span
                        className="text-[14px] tracking-[3px] mb-2"
                        style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                    >
                        [ {String(count).padStart(2, '0')} ]
                    </span>
                </div>

                {/* Tagline */}
                <p className="mb-12 text-[12px] tracking-[2px] uppercase">
                    Experimental builds across security, hardware, software and scientific inquiry.
                </p>

                <ProjectsPageServer showFilters />
            </div>
        </section>
    );
}