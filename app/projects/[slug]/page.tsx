import React from 'react'
import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { CodeBlock } from '@/components/CodeBlock'
import { LatexBlock } from '@/components/LatexBlock'
import { TableBlock } from '@/components/TableBlock'
import { TableOfContents } from '@/components/TableOfContents'
import { extractHeadings } from '@/utils/extractHeadings'

export const revalidate = 120

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, slug, description, icon, tech, tags, github, external, featured, status, startDate, endDate, content, order,
  images[]{ asset->{ url }, alt, caption }
}`

const allProjectsForNavQuery = `*[_type == "project"] | order(order asc, _createdAt desc) {
  title, slug, status, order
}`

function getTextFromChildren(children: any): string {
  if (children == null) return ''
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextFromChildren).join('')
  if (typeof children === 'object' && 'props' in children) return getTextFromChildren(children.props.children)
  return ''
}

function generateId(children: any) {
  return getTextFromChildren(children).toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 80)
}


const components: PortableTextComponents = {
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => {
      const id = generateId(children)
      return (
        <h1 
          id={id}
          className="text-[32px] md:text-[40px] mt-16 mb-8 scroll-mt-24 font-bold tracking-[-0.03em]"
          style={{ color: 'var(--text)' }}
        >
          {children}
        </h1>
      )
    },
    h2: ({ children }: { children?: React.ReactNode }) => {
      const id = generateId(children)
      return (
        <h2 
          id={id}
          className="text-[26px] md:text-[30px] mt-14 mb-6 scroll-mt-24 flex items-center gap-4 font-semibold"
          style={{ color: 'var(--text)' }}
        >
          <span className="w-10 h-px shrink-0" style={{ background: 'var(--red)' }} />
          {children}
        </h2>
      )
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const id = generateId(children)
      return (
        <h3 
          id={id}
          className="text-[22px] md:text-[24px] mt-10 mb-5 scroll-mt-24 font-semibold"
          style={{ color: 'var(--text)' }}
        >
          {children}
        </h3>
      )
    },
    h4: ({ children }: { children?: React.ReactNode }) => {
      const id = generateId(children)
      return (
        <h4 
          id={id}
          className="text-[14px] tracking-[3px] uppercase mt-8 mb-4 scroll-mt-24 font-semibold"
          style={{ color: 'var(--red)' }}
        >
          {children}
        </h4>
      )
    },
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p 
        className="mb-7 text-[16px] md:text-[18px] leading-loose font-normal"
        style={{ color: 'var(--text)' }}
      >
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote 
        className="my-10 pl-8 py-6 italic text-[14px] leading-[1.9] font-light"
        style={{ 
          borderLeft: '3px solid var(--red)',
          color: 'var(--white-dim)',
          background: 'var(--card-bg)'
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-8 space-y-3 ml-2 font-light" style={{ color: 'var(--text)' }}>
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-8 space-y-3 ml-2 list-decimal list-inside font-light" style={{ color: 'var(--text)' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-4 text-[14px] md:text-[16px] leading-[1.9]">
        <span className="mt-2.5 w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--red)' }} />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-[16px] md:text-[17px] leading-[1.9]">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium" style={{ color: 'var(--text)' }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code 
        className="px-2 py-1 text-[14px] rounded font-normal"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--red)',
          border: '1px solid var(--trace-line)'
        }}
      >
        {children}
      </code>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => {
      const href = value?.href || '#'
      const isInternal = href && (href.startsWith('/') || href.startsWith('#'))
      return (
        <a
          href={href}
          className="transition-colors duration-300 hover:text-(--red)"
          style={{
            color: 'var(--text)',
            textDecoration: 'underline',
            textDecorationColor: 'var(--red)',
            textUnderlineOffset: '4px'
          }}
          {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
    inlineLatex: ({ value }: { value?: { body?: string } }) => (
      <LatexBlock body={value?.body ?? ''} inline={true} />
    ),
  },
  types: {
    image: ({ value }: { value: { asset?: { url?: string }; alt?: string; caption?: string } }) => {
      if (!value?.asset?.url) return null
      return (
        <figure className="my-12">
          <div className="relative" style={{ border: '1px solid var(--trace-line)' }}>
            <Image 
              src={value.asset.url} 
              alt={value.alt || ''} 
              width={1200} 
              height={600} 
              className="w-full" 
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-px" style={{ background: 'var(--red)' }} />
            <div className="absolute top-0 left-0 h-6 w-px" style={{ background: 'var(--red)' }} />
            <div className="absolute bottom-0 right-0 w-6 h-px" style={{ background: 'var(--red)' }} />
            <div className="absolute bottom-0 right-0 h-6 w-px" style={{ background: 'var(--red)' }} />
          </div>
          {(value.alt || value.caption) && (
            <figcaption 
              className="mt-4 text-[11px] tracking-[2px] uppercase text-center font-normal" 
              style={{ color: 'var(--white-dim)' }}
            >
              {value.caption || value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }: { value: { code: string; language?: string; filename?: string } }) => (
      <div className="my-10">
        <CodeBlock code={value.code} language={value.language} filename={value.filename} />
      </div>
    ),
    latex: ({ value }: { value: { body: string; inline?: boolean } }) => (
      <LatexBlock body={value.body} inline={value.inline} />
    ),
    table: ({ value }: { value: { rows?: { _key: string; cells?: string[] }[] } }) => (
      <TableBlock value={value} />
    ),
  },
}


function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function getStatusDisplay(status: string): { label: string; color: string; active: boolean } {
  const map: Record<string, { label: string; color: string; active: boolean }> = {
    'in-progress': { label: 'In Progress', color: 'var(--red)', active: true },
    'completed': { label: 'Completed', color: 'var(--text)', active: false },
    'archived': { label: 'Archived', color: 'var(--white-dim)', active: false },
    'planning': { label: 'Planning', color: 'var(--white-dim)', active: true },
  }
  return map[status] || { label: status, color: 'var(--white-dim)', active: false }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([
    client.fetch(projectBySlugQuery, { slug }),
    client.fetch(allProjectsForNavQuery),
  ])

  if (!project) {
    return (
      <article className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[32px] mb-4" style={{ color: 'var(--text)' }}>Project not found</h1>
          <Link href="/projects" className="text-[11px] tracking-[3px] uppercase hover:text-(--red)" style={{ color: 'var(--white-dim)' }}>← Back to projects</Link>
        </div>
      </article>
    )
  }

  const statusDisplay = getStatusDisplay(project.status)
  const hasContent = project.content?.length > 0
  const hasImages = project.images?.length > 0
  const headings = hasContent ? extractHeadings(project.content) : []
  const showToc = headings.length >= 3

  // Prev / next navigation
  const currentIdx = allProjects.findIndex((p: any) => p.slug?.current === slug)
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null

  return (
    <article className="min-h-screen relative">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="relative py-16 px-10 backdrop-blur-xs" style={{ borderBottom: '1px solid var(--trace-line)', backgroundColor: 'var(--card-bg)' }}>
        <div className="max-w-[800px] mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[10px] tracking-[3px] uppercase mb-12 text-[var(--white-dim)] hover:text-[var(--red)] transition-colors duration-300"
          >
            <span>←</span><span>All projects</span>
          </Link>

          {/* Status + dates */}
          <div className="flex items-center gap-3 mb-6 text-[10px] tracking-[3px] uppercase">
            {statusDisplay.active && (
              <span className="status-led" aria-label="active" />
            )}
            <span style={{ color: statusDisplay.color }}>{statusDisplay.label}</span>
            {project.startDate && (
              <span style={{ color: 'var(--white-dim)' }}>
                — {formatDate(project.startDate)}{project.endDate ? ` → ${formatDate(project.endDate)}` : ' → Present'}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="mb-6"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              letterSpacing: '-1.5px',
              lineHeight: 1.05,
              color: 'var(--text)',
            }}
          >
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-[16px] leading-[1.9] max-w-[680px] mb-8" style={{ color: 'var(--white-dim)' }}>
            {project.description}
          </p>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {project.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[9px] tracking-[2px] uppercase px-2.5 py-1"
                  style={{ color: 'var(--white-dim)', border: '1px solid var(--trace-line)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[11px] tracking-[3px] uppercase hover:text-(--text)"
                style={{ color: 'var(--white-dim)' }}
              >
                <i className="fab fa-github text-base" />
                <span>GitHub</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            )}
            {project.external && (
              <a
                href={project.external}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[11px] tracking-[3px] uppercase hover:text-(--red)"
                style={{ color: 'var(--white-dim)' }}
              >
                <span>Live</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            )}
          </div>

          <div className="w-16 h-px mt-10" style={{ background: 'var(--red)' }} />
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-[1500px] mx-auto py-16 px-4">
        {hasContent || hasImages ? (
          <div className={showToc ? 'grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-20 max-w-full' : ''}>
            {/* TOC sidebar */}
            {showToc && (
              <aside className="hidden lg:block" >
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto" style={{
                  border: '1px solid var(--trace-line)',
                  backgroundColor: 'var(--card-bg'}}>
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}

            {/* Main content */}
            <div className="overflow-hidden w-full min-w-0">
              {/* Gallery */}
              {hasImages && (
                <section className="mb-16">
                  <h2 className="text-[10px] tracking-[4px] uppercase mb-6 flex items-center gap-4" style={{ color: 'var(--red)' }}>
                    <span className="w-8 h-px" style={{ background: 'var(--red)' }} />Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.images.map((image: any, i: number) => image?.asset?.url ? (
                      <figure key={i}>
                        <div className="relative" style={{ border: '1px solid var(--trace-line)' }}>
                          <Image
                            src={image.asset.url}
                            alt={image.alt || `${project.title} ${i + 1}`}
                            width={600}
                            height={400}
                            className="w-full"
                          />
                          <div className="absolute top-0 left-0 w-4 h-px" style={{ background: 'var(--red)' }} />
                          <div className="absolute top-0 left-0 h-4 w-px" style={{ background: 'var(--red)' }} />
                          <div className="absolute bottom-0 right-0 w-4 h-px" style={{ background: 'var(--red)' }} />
                          <div className="absolute bottom-0 right-0 h-4 w-px" style={{ background: 'var(--red)' }} />
                        </div>
                        {image.caption && (
                          <figcaption className="mt-2 text-[10px] tracking-[2px] uppercase" style={{ color: 'var(--white-dim)' }}>
                            {image.caption}
                          </figcaption>
                        )}
                      </figure>
                    ) : null)}
                  </div>
                </section>
              )}

              {/* Body content */}
              {hasContent && (
                <div className="max-w-[800px]" >
                  <PortableText value={project.content} components={components} />
                </div>
              )}

              {/* End marker */}
              <div className="mt-16 flex items-center gap-4">
                <div className="w-12 h-px" style={{ background: 'var(--red)' }} />
                <span className="text-[10px] tracking-[3px] uppercase" style={{ color: 'var(--white-dim)' }}>End</span>
                <div className="w-12 h-px" style={{ background: 'var(--red)' }} />
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20" style={{ color: 'var(--white-dim)' }}>
            <p className="text-[14px] mb-4">Detailed writeup coming soon.</p>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] underline hover:text-[var(--red)]"
              >
                View source on GitHub ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Prev / Next navigation ───────────────────────────────────── */}
      <nav
        className="border-t px-6 md:px-10 lg:px-16"
        style={{ borderColor: 'var(--trace-line)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Previous */}
            <div className="group py-12 md:pr-8 md:border-r transition-colors duration-300 hover:bg-[rgba(185,28,28,0.04)]" style={{ borderColor: 'var(--trace-line)' }}>
              {prevProject ? (
                <Link href={`/projects/${prevProject.slug?.current}`} className="block">
                  <span
                    className="text-[10px] tracking-[3px] uppercase mb-4 flex items-center gap-2"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Previous
                  </span>
                  {prevProject.status && (
                    <span
                      className="text-[9px] tracking-[2px] uppercase block mb-2"
                      style={{ color: 'var(--red)' }}
                    >
                      {prevProject.status.replace('-', '\u00a0')}
                    </span>
                  )}
                  <span
                    className="text-[var(--text)] text-[18px] md:text-[20px] leading-[1.3] group-hover:text-[var(--red)] transition-colors line-clamp-2"
                  >
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div className="opacity-50">
                  <span
                    className="text-[10px] tracking-[3px] uppercase mb-4 block"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    ← Previous
                  </span>
                  <span className="text-[16px]" style={{ color: 'var(--white-dim)' }}>
                    No earlier projects
                  </span>
                </div>
              )}
            </div>

            {/* Next */}
            <div className="group py-12 md:pl-8 border-t md:border-t-0 transition-colors duration-300 hover:bg-[rgba(185,28,28,0.04)]" style={{ borderColor: 'var(--trace-line)' }}>
              {nextProject ? (
                <Link href={`/projects/${nextProject.slug?.current}`} className="block text-right">
                  <span
                    className="text-[10px] tracking-[3px] uppercase mb-4 flex items-center justify-end gap-2"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    Next
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  {nextProject.status && (
                    <span
                      className="text-[9px] tracking-[2px] uppercase block mb-2"
                      style={{ color: 'var(--red)' }}
                    >
                      {nextProject.status.replace('-', '\u00a0')}
                    </span>
                  )}
                  <span
                    className="text-[var(--text)] text-[18px] md:text-[20px] leading-[1.3] group-hover:text-[var(--red)] transition-colors line-clamp-2"
                  >
                    {nextProject.title}
                  </span>
                </Link>
              ) : (
                <div className="opacity-50 text-right">
                  <span
                    className="text-[10px] tracking-[3px] uppercase mb-4 block"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    Next →
                  </span>
                  <span className="text-[16px]" style={{ color: 'var(--white-dim)' }}>
                    No later projects
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </article>
  )
}
