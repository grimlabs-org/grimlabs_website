"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  icon: string;
  tech: string[];
  github?: string;
  external?: string;
  status?: 'in-progress' | 'completed' | 'archived' | 'planning';
  featured?: boolean;
  tags?: string[];
  thumbnail?: { asset: { url: string }; alt?: string };
}

interface ProjectsPageClientProps {
  projects: Project[];
  showFilters?: boolean;
}

type SortKey = 'default' | 'featured' | 'active';

/* ── Shared sub-components ─────────────────────────────────────── */

function CornerTicks() {
  return (
    <>
      {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-4 h-4 z-20 pointer-events-none`}>
          <div className={`absolute ${pos} w-full h-px`} style={{ background: 'var(--accent)' }} />
          <div className={`absolute ${pos} h-full w-px`} style={{ background: 'var(--accent)' }} />
        </div>
      ))}
    </>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const isActive = status === 'in-progress' || status === 'planning';
  return (
    <div className="flex items-center gap-2">
      {isActive ? (
        <span className="status-led" aria-label="active" />
      ) : status === 'completed' ? (
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--border-primary)', opacity: 0.6 }} />
      ) : null}
      <span
        className="text-[9px] tracking-[2px] uppercase"
        style={{ color: isActive ? 'var(--accent)' : 'var(--white-dim)' }}
      >
        {status.replace('-', '\u00a0')}
      </span>
    </div>
  );
}

function GithubLink({ href, full = false }: { href: string; full?: boolean }) {
  return (
    <button
      type="button"
      onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(href, '_blank', 'noopener,noreferrer'); }}
      className="flex items-center gap-1.5 transition-all duration-300 hover:text-(--accent)"
      style={{ color: 'var(--white-dim)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <i className="fa-brands fa-github text-[15px]" />
      {full && (
        <span className="text-[10px] tracking-[2px] uppercase">GitHub</span>
      )}
      <span className="text-[13px]">↗</span>
    </button>
  );
}

/* ── Spotlight card ─────────────────────────────────────────────── */

function SpotlightCard({ project }: { project: Project }) {
  const hasImage = !!project.thumbnail?.asset?.url;

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group relative overflow-hidden flex flex-col md:flex-row block cursor-crosshair backdrop-blur-sm"
      style={{ border: '1px solid var(--border-primary)', transition: 'border-color 0.3s ease, background 0.3s ease' }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.background = 'rgba(185, 28, 28, 0.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-primary)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <CornerTicks />

      {/* Left: image or icon panel */}
      <div className="relative w-full md:w-[45%] shrink-0 h-55 md:h-auto md:min-h-70">
        {hasImage ? (
          <Image
            src={project.thumbnail!.asset.url}
            alt={project.thumbnail!.alt || project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ borderRight: '1px solid var(--border-primary)' }}
          >
            <div
              className="absolute inset-4"
              style={{ border: '1px dashed var(--border-primary)', opacity: 0.4 }}
            />
            {project.icon ? (
              <i
                className={`${project.icon} text-[52px]`}
                style={{ color: 'var(--accent)', opacity: 0.3 }}
              />
            ) : (
              <svg viewBox="0 0 200 80" fill="none" className="w-48 opacity-20">
                <rect x="60" y="10" width="80" height="50" stroke="var(--muted-foreground)" strokeWidth="1" fill="none" />
                <rect x="65" y="15" width="70" height="40" stroke="var(--border-primary)" strokeWidth="0.5" fill="none" />
                <line x1="100" y1="60" x2="100" y2="75" stroke="var(--accent)" strokeWidth="1" />
              </svg>
            )}
          </div>
        )}
        {/* Vertical divider line (desktop) */}
        {hasImage && (
          <div
            className="hidden md:block absolute top-0 right-0 w-px h-full"
            style={{ background: 'var(--border-primary)' }}
          />
        )}
      </div>

      {/* Right: content */}
      <div className="flex flex-col justify-between px-6 py-6 md:px-8 md:py-8 flex-1 min-w-0">
        {/* Top: title + github */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3
              className="text-foreground transition-colors duration-300 group-hover:text-(--accent)"
              style={{
                fontSize: 'clamp(22px, 2vw, 34px)',
                fontWeight: 300,
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </h3>
            {project.github && <GithubLink href={project.github} full />}
          </div>

          {project.description && (
            <p
              className="text-[16px] leading-[1.8]"
              style={{ color: 'var(--white-dim)' }}
            >
              {project.description}
            </p>
          )}
        </div>

        {/* Bottom: status */}
        {project.status && (
          <div className="mt-6">
            <StatusBadge status={project.status} />
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Row icon box ───────────────────────────────────────────────── */

function ProjectIconBox({
  icon,
  thumbnail,
  projectId,
}: {
  icon?: string;
  thumbnail?: { asset: { url: string }; alt?: string };
  projectId: string;
}) {
  const gridId = `pgrid-${projectId}`;
  return (
    <div className="relative w-[90px] h-[90px] shrink-0 overflow-hidden">
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ border: '1px solid var(--border-primary)' }}
      />
      <div
        className="absolute inset-[5px] z-10 pointer-events-none"
        style={{ border: '1px dashed var(--border-primary)', opacity: 0.5 }}
      />
      {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-3 h-3 z-20`}>
          <div className={`absolute ${pos} w-full h-px`} style={{ background: 'var(--accent)' }} />
          <div className={`absolute ${pos} h-full w-px`} style={{ background: 'var(--accent)' }} />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        {thumbnail?.asset?.url ? (
          <Image
            src={thumbnail.asset.url}
            alt={thumbnail.alt || ''}
            fill
            className="object-cover opacity-80"
            sizes="90px"
          />
        ) : icon ? (
          <i className={`${icon} text-[24px]`} style={{ color: 'var(--accent)', opacity: 0.6 }} />
        ) : (
          <svg viewBox="0 0 90 90" fill="none" className="w-full h-full p-4 opacity-35">
            <defs>
              <pattern id={gridId} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="var(--border-primary)" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="90" height="90" fill={`url(#${gridId})`} />
            <rect x="25" y="25" width="40" height="28" stroke="var(--muted-foreground)" strokeWidth="0.8" fill="none" />
            <line x1="45" y1="53" x2="45" y2="68" stroke="var(--accent)" strokeWidth="0.8" />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ── Project row ────────────────────────────────────────────────── */

function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="group flex items-center gap-4 py-4 cursor-crosshair backdrop-blur-sm"
      style={{
        borderBottom: '1px solid var(--border-primary)',
        paddingLeft: '24px',
        paddingRight: '24px',
        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(185, 28, 28, 0.05)';
        e.currentTarget.style.paddingLeft = '32px';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.paddingLeft = '24px';
      }}
    >
      {/* Icon box */}
      <ProjectIconBox
        icon={project.icon}
        thumbnail={project.thumbnail}
        projectId={project._id}
      />

      {/* Title + description */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3
          className="text-[var(--foreground)] text-[16px] leading-[1.3] transition-colors duration-300 group-hover:text-[var(--accent)]"
        >
          {project.title}
        </h3>
        {project.description && (
          <>
            {/* Desktop: 2 lines */}
            <p
              className="hidden md:block text-[14px] leading-[1.5] line-clamp-2"
              style={{ color: 'var(--white-dim)' }}
            >
              {project.description}
            </p>
            {/* Mobile: 1 line */}
            <p
              className="md:hidden text-[12px] leading-[1.4] line-clamp-1"
              style={{ color: 'var(--white-dim)' }}
            >
              {project.description}
            </p>
          </>
        )}
      </div>

      {/* Status (desktop) + GitHub */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden md:flex">
          <StatusBadge status={project.status} />
        </div>
        {project.github && <GithubLink href={project.github} />}
      </div>
    </Link>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export default function ProjectsPageClient({ projects, showFilters }: ProjectsPageClientProps) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('default');

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap(p => p.tags ?? []))).sort(),
    [projects]
  );

  function toggleTag(tag: string) {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  const visibleProjects = useMemo(() => {
    let result = activeTags.length > 0
      ? projects.filter(p => activeTags.some(t => p.tags?.includes(t)))
      : [...projects];

    if (sortKey === 'featured') {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortKey === 'active') {
      const rank = (s?: string) =>
        s === 'in-progress' ? 0 : s === 'planning' ? 1 : s === 'completed' ? 2 : 3;
      result = [...result].sort((a, b) => rank(a.status) - rank(b.status));
    }

    return result;
  }, [projects, activeTags, sortKey]);

  const spotlight = visibleProjects[0];
  const rows = visibleProjects.slice(1);

  return (
    <div>
      {/* Filter + sort bar */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {allTags.length > 0 && (
            <>
              <button
                onClick={() => setActiveTags([])}
                className="text-[12px] tracking-[2px] uppercase px-3 py-1.5 transition-all duration-300"
                style={{
                  border: `1px solid ${activeTags.length === 0 ? 'var(--accent)' : 'var(--border-primary)'}`,
                  color: activeTags.length === 0 ? 'var(--accent)' : 'var(--white-dim)',
                }}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="text-[12px] tracking-[2px] uppercase px-3 py-1.5 transition-all duration-300"
                  style={{
                    border: `1px solid ${activeTags.includes(tag) ? 'var(--accent)' : 'var(--border-primary)'}`,
                    color: activeTags.includes(tag) ? 'var(--accent)' : 'var(--white-dim)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </>
          )}
          <div className="ml-auto flex gap-2">
            {(['default', 'featured', 'active'] as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className="text-[12px] tracking-[2px] uppercase px-3 py-1.5 transition-all duration-300 cursor-crosshair"
                style={{
                  border: `1px solid ${sortKey === key ? 'var(--accent)' : 'var(--border-primary)'}`,
                  color: sortKey === key ? 'var(--accent)' : 'var(--white-dim)',
                }}
                onMouseEnter={e => {
                  if (sortKey !== key) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                  }
                }}
                onMouseLeave={e => {
                  if (sortKey !== key) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--white-dim)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)';
                  }
                }}
              >
                {key === 'default' ? 'Order' : key === 'featured' ? 'Featured' : 'Active'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {visibleProjects.length === 0 ? (
        <div
          className="py-16 text-center backdrop-blur-xs"
          style={{ border: '1px solid var(--border-primary)' }}
        >
          <span className="text-[12px] tracking-[3px] uppercase" style={{ color: 'var(--white-dim)' }}>
            No projects match this filter.
          </span>
        </div>
      ) : (
        <div>
          {/* Spotlight */}
          {spotlight && <SpotlightCard project={spotlight} />}

          {/* Row list */}
          {rows.length > 0 && (
            <div style={{ border: '1px solid var(--border-primary)', borderTop: 'none' }}>
              {rows.map((project) => (
                <ProjectRow key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
