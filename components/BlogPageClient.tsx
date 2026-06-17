'use client';

import Link from "next/link";
import { useState, useMemo } from "react";

type Blog = {
  _id: string;
  date: string | Date;
  category: string;
  readTime: string;
  title: string;
  link: string;
  description: string;
  tags?: string[];
};

function formatRowDate(date: string | Date): string {
  const d = new Date(date);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  return `${month} ${day}`;
}

function getYear(date: string | Date): number {
  return new Date(date).getFullYear();
}

export default function BlogPageClient({ blogs }: { blogs: Blog[] }) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  // Derive unique categories and tags from all posts
  const allCategories = useMemo(() =>
    [...new Set(blogs.map(b => b.category).filter(Boolean))].sort(),
    [blogs]
  );
  const allTags = useMemo(() =>
    [...new Set(blogs.flatMap(b => b.tags ?? []))].sort(),
    [blogs]
  );

  // Toggle helpers
  function toggleCategory(cat: string) {
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }
  function toggleTag(tag: string) {
    setActiveTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }
  function resetFilters() {
    setActiveCategories(new Set());
    setActiveTags(new Set());
    setSearch('');
  }

  // Filter posts
  const filtered = useMemo(() => {
    return blogs.filter(b => {
      if (activeCategories.size > 0 && !activeCategories.has(b.category)) return false;
      if (activeTags.size > 0 && ![...activeTags].every(t => b.tags?.includes(t))) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!b.title.toLowerCase().includes(q) && !b.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [blogs, activeCategories, activeTags, search]);

  // Group by year
  const years = useMemo(() => {
    const grouped: Record<number, Blog[]> = {};
    for (const post of filtered) {
      const y = getYear(post.date);
      grouped[y] = [...(grouped[y] ?? []), post];
    }
    return Object.keys(grouped).map(Number).sort((a, b) => b - a);
  }, [filtered]);

  const groupedByYear = useMemo(() => {
    const map: Record<number, Blog[]> = {};
    for (const post of filtered) {
      const y = getYear(post.date);
      map[y] = [...(map[y] ?? []), post];
    }
    return map;
  }, [filtered]);

  const hasFilters = activeCategories.size > 0 || activeTags.size > 0 || search.trim().length > 0;

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="mb-12 space-y-4">

        {/* Search */}
        <div style={{ borderBottom: '1px solid var(--trace-line)', paddingBottom: '2px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-[16px] tracking-[2px] uppercase" style={{ color: 'var(--muted-foreground)' }}>⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="bg-transparent outline-none text-[14px] tracking-[1px] w-48 placeholder:opacity-40"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono, monospace)' }}
          />
        </div>

        {/* Category pills */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[12px] tracking-[2px] uppercase mr-1" style={{ color: 'var(--muted-foreground)' }}>Category</span>
            {allCategories.map(cat => {
              const isActive = activeCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="text-[12px] tracking-[2px] uppercase px-3 py-1 transition-all duration-300 cursor-crosshair"
                  style={{
                    border: '1px solid var(--border-primary)',
                    color: isActive ? '#fff' : 'var(--muted-foreground)',
                    background: isActive ? 'var(--accent)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[9px] tracking-[2px] uppercase mr-1" style={{ color: 'var(--muted-foreground)' }}>Tags</span>
            {allTags.map(tag => {
              const isActive = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="text-[12px] tracking-[2px] uppercase px-3 py-1 transition-all duration-300 cursor-crosshair"
                  style={{
                    border: '1px solid var(--border-primary)',
                    color: isActive ? '#fff' : 'var(--muted-foreground)',
                    background: isActive ? 'var(--accent)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)';
                    }
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Timeline ── */}
      {years.length === 0 ? (
        <div className="py-24 text-center backdrop-blur-xs">
          <p className="text-[13px] tracking-[1px]" style={{ color: 'var(--muted-foreground)' }}>
            No articles match your filters.
          </p>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="mt-4 text-[11px] tracking-[2px] uppercase transition-colors duration-300 hover:text-(--accent) cursor-crosshair"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-16">
          {years.map(year => (
            <div key={year}>
              {/* Year heading */}
              <div className="flex items-baseline gap-6 mb-2">
                <h3
                  style={{
                    fontSize: 'clamp(40px, 5vw, 72px)',
                    fontWeight: 300,
                    lineHeight: 1,
                    letterSpacing: '-2px',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  {year}
                </h3>
                <span className="text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--muted-foreground)' }}>
                  {groupedByYear[year].length} {groupedByYear[year].length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              {/* Separator */}
              <div style={{ height: '1px', background: 'var(--trace-line)', marginBottom: '0' }} />

              {/* Post rows */}
              <div>
                {groupedByYear[year].map(post => (
                  <Link
                    key={post._id}
                    href={post.link}
                    className="group flex items-stretch cursor-crosshair transition-all duration-300 backdrop-blur-sm"
                    style={{ borderBottom: '1px solid var(--border-primary)' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(185, 28, 28, 0.06)';
                      (el.querySelector('.accent-bar') as HTMLElement | null)?.style.setProperty('background', 'var(--accent)');
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'transparent';
                      (el.querySelector('.accent-bar') as HTMLElement | null)?.style.setProperty('background', 'var(--border-primary)');
                    }}
                  >
                    {/* Left accent bar */}
                    <div
                      className="accent-bar w-0.5 shrink-0 transition-colors duration-300"
                      style={{ background: 'var(--border-primary)' }}
                    />

                    {/* Content */}
                    <div className="flex-1 flex items-start justify-between gap-4 py-4 px-4 min-w-0">
                      {/* Stacked: meta + title */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <div
                          className="flex items-center gap-3 text-[12px] tracking-[2px] uppercase"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <span className="tabular-nums">{formatRowDate(post.date)}</span>
                          {post.readTime && (
                            <>
                              <span style={{ color: 'var(--border-primary)' }}>·</span>
                              <span>{post.readTime}</span>
                            </>
                          )}
                          {post.category && (
                            <>
                              <span style={{ color: 'var(--border-primary)' }}>·</span>
                              <span style={{ color: 'var(--accent)' }}>{post.category}</span>
                            </>
                          )}
                        </div>
                        <span
                          className="text-[16px] leading-[1.4] transition-colors duration-300 group-hover:text-(--accent)"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {post.title}
                        </span>
                      </div>

                      {/* Arrow */}
                      <span
                        className="text-[14px] shrink-0 pt-5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent)"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
