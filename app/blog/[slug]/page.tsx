import React from 'react'
import { client } from '@/sanity/lib/client'
import { postBySlugQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { CodeBlock } from '@/components/CodeBlock'
import { LatexBlock } from '@/components/LatexBlock'
import { TableBlock } from '@/components/TableBlock'
import { extractHeadings } from '@/utils/extractHeadings'
import { TableOfContents } from '@/components/TableOfContents'

export const revalidate = 120

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Query to get adjacent posts for prev/next navigation
const adjacentPostsQuery = `{
  "current": *[_type == "post" && slug.current == $slug][0]{ date },
  "previous": *[_type == "post" && date < ^.current.date] | order(date desc)[0]{ 
    title, 
    slug,
    category
  },
  "next": *[_type == "post" && date > ^.current.date] | order(date asc)[0]{ 
    title, 
    slug,
    category
  }
}`

// Simpler adjacent query that works better
const getPrevNextQuery = `{
  "allPosts": *[_type == "post"] | order(date desc) { 
    title, 
    slug,
    category,
    date
  }
}`

function getTextFromChildren(children: any): string {
  if (children == null) return ''
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextFromChildren).join('')
  if (typeof children === 'object' && 'props' in children) return getTextFromChildren(children.props.children)
  return ''
}

function generateId(children: any) {
  const text = getTextFromChildren(children)
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
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
        <span className="mt-2.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--red)' }} />
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
          className="transition-colors duration-300 hover:text-[var(--red)]"
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

function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatShortDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })
  
  // Get all posts for prev/next navigation
  const { allPosts } = await client.fetch(getPrevNextQuery)
  
  // Find current post index and get adjacent posts
  const currentIndex = allPosts.findIndex((p: any) => p.slug.current === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  if (!post) {
    return (
      <article className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[36px] mb-6" style={{ color: 'var(--text)' }}>Post not found</h1>
          <Link 
            href="/blog" 
            className="text-[11px] tracking-[3px] uppercase hover:text-[var(--red)]" 
            style={{ color: 'var(--white-dim)' }}
          >
            ← Back to writings
          </Link>
        </div>
      </article>
    )
  }

  const body = post.body ?? []
  const headings = extractHeadings(body)
  const showTOC = headings.length >= 3

  return (
    <article className="min-h-screen relative">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <header
        className="relative pt-24 pb-16 px-6 md:px-10 lg:px-16 backdrop-blur-xs"
        style={{ borderBottom: '1px solid var(--trace-line)', backgroundColor: 'var(--card-bg)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-[10px] tracking-[3px] uppercase mb-16 text-[var(--white-dim)] hover:text-[var(--red)] transition-colors duration-300"
          >
            <span>←</span>
            <span>Back to writings</span>
          </Link>

          {/* Meta info */}
          <div 
            className="text-[10px] tracking-[3px] uppercase mb-8 flex flex-wrap items-center gap-4" 
            style={{ color: 'var(--white-dim)' }}
          >
            {post.category && (
              <>
                <span style={{ color: 'var(--red)' }}>{post.category}</span>
                <span style={{ color: 'var(--trace-line)' }}>—</span>
              </>
            )}
            <span>{post.date ? formatDate(post.date) : ''}</span>
            {post.readTime && (
              <>
                <span style={{ color: 'var(--trace-line)' }}>—</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 
            className="text-[clamp(32px,6vw,56px)] leading-[1.1] tracking-[-1px] mb-10 max-w-[900px]" 
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </h1>

          {/* Author + Tags */}
          <div className="flex flex-wrap items-center gap-8">
            {post.author && (
              <div className="text-[14px]" style={{ color: 'var(--text)' }}>
                <span 
                  className="text-[10px] tracking-[2px] uppercase mr-3" 
                  style={{ color: 'var(--white-dim)' }}
                >
                  By
                </span>
                {post.author}
              </div>
            )}
            {post.tags?.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <span 
                    key={i} 
                    className="text-[9px] tracking-[2px] uppercase px-3 py-1.5" 
                    style={{ 
                      color: 'var(--white-dim)', 
                      border: '1px solid var(--trace-line)' 
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Red accent line */}
          <div className="w-20 h-px mt-12" style={{ background: 'var(--red)' }} />
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
         ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1500px] mx-auto py-16 px-2">
        {/* Asymmetric padding: less on left for TOC, more on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-20 pl-2 lg:pl-6 pr-2 md:pr-10 lg:pr-16 max-w-full">
          
          {/* ─── Left Sidebar: TOC ─── */}
          {showTOC && (
            <aside className="hidden lg:block">
              <div
                className="sticky top-28 p-5 max-h-[calc(100vh-6rem)] overflow-y-auto"
                style={{
                  border: '1px solid var(--trace-line)',
                  background: 'var(--card-bg)'
                }}
              >
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}

          {/* ─── Main Content ─── */}
          <main className={`overflow-hidden w-full ${showTOC ? '' : 'lg:col-span-2 max-w-[900px] mx-auto'}`}>
            {/* Featured image */}
            {post.mainImage?.asset?.url && (
              <figure className="mb-14">
                <div 
                  className="relative" 
                  style={{ border: '1px solid var(--trace-line)' }}
                >
                  <Image 
                    src={post.mainImage.asset.url} 
                    alt={post.mainImage.alt || post.title} 
                    width={1400} 
                    height={700} 
                    className="w-full" 
                    priority
                  />
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-px" style={{ background: 'var(--red)' }} />
                  <div className="absolute top-0 left-0 h-8 w-px" style={{ background: 'var(--red)' }} />
                  <div className="absolute bottom-0 right-0 w-8 h-px" style={{ background: 'var(--red)' }} />
                  <div className="absolute bottom-0 right-0 h-8 w-px" style={{ background: 'var(--red)' }} />
                </div>
              </figure>
            )}

            {/* Article body */}
            <div className="max-w-[800px]">
              <PortableText value={body} components={components} />
            </div>

            {/* ─── End marker ─── */}
            <div className="mt-20 flex items-center gap-4">
              <div className="w-16 h-px" style={{ background: 'var(--red)' }} />
              <span 
                className="text-[10px] tracking-[3px] uppercase" 
                style={{ color: 'var(--white-dim)' }}
              >
                End
              </span>
              <div className="w-16 h-px" style={{ background: 'var(--red)' }} />
            </div>
          </main>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PREV / NEXT NAVIGATION
         ═══════════════════════════════════════════════════════════════ */}
      <nav 
        className="border-t px-6 md:px-10 lg:px-16"
        style={{ borderColor: 'var(--trace-line)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Previous Post */}
            <div
              className="group py-12 md:pr-8 md:border-r transition-colors duration-300 hover:bg-[rgba(185,28,28,0.04)]"
              style={{ borderColor: 'var(--trace-line)' }}
            >
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug.current}`}
                  className="block"
                >
                  <span
                    className="text-[10px] tracking-[3px] uppercase mb-4 flex items-center gap-2"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Previous
                  </span>
                  {prevPost.category && (
                    <span
                      className="text-[9px] tracking-[2px] uppercase block mb-2"
                      style={{ color: 'var(--red)' }}
                    >
                      {prevPost.category}
                    </span>
                  )}
                  <span
                    className="text-[var(--text)] text-[18px] md:text-[20px] leading-[1.3] group-hover:text-[var(--red)] transition-colors line-clamp-2"
                  >
                    {prevPost.title}
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
                  <span 
                    className="text-[16px]"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    No older posts
                  </span>
                </div>
              )}
            </div>

            {/* Next Post */}
            <div
              className="group py-12 md:pl-8 border-t md:border-t-0 transition-colors duration-300 hover:bg-[rgba(185,28,28,0.04)]"
              style={{ borderColor: 'var(--trace-line)' }}
            >
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug.current}`}
                  className="block text-right"
                >
                  <span
                    className="text-[10px] tracking-[3px] uppercase mb-4 flex items-center justify-end gap-2"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    Next
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  {nextPost.category && (
                    <span
                      className="text-[9px] tracking-[2px] uppercase block mb-2"
                      style={{ color: 'var(--red)' }}
                    >
                      {nextPost.category}
                    </span>
                  )}
                  <span
                    className="text-[var(--text)] text-[18px] md:text-[20px] leading-[1.3] group-hover:text-[var(--red)] transition-colors line-clamp-2"
                  >
                    {nextPost.title}
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
                  <span 
                    className="text-[16px]"
                    style={{ color: 'var(--white-dim)' }}
                  >
                    No newer posts
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER: Back to all
         ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="py-12 px-6 md:px-10 lg:px-16 text-center border-t"
        style={{ borderColor: 'var(--trace-line)' }}
      >
        <Link
          href="/blog"
          className="group inline-flex items-center gap-4 text-[11px] tracking-[3px] uppercase text-[var(--white-dim)] hover:text-[var(--red)] transition-colors duration-300"
        >
          <span className="w-8 h-px transition-colors duration-300 bg-[var(--trace-line)] group-hover:bg-[var(--red)]" />
          All writings
          <span className="w-8 h-px transition-colors duration-300 bg-[var(--trace-line)] group-hover:bg-[var(--red)]" />
        </Link>
      </div>
    </article>
  )
}