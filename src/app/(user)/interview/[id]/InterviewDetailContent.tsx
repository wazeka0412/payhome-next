'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useInterviews } from '@/lib/content-store'
import type { InterviewBodyItem } from '@/lib/interviews'
import ShareButtons from './ShareButtons'

export default function InterviewDetailContent({ id }: { id: string }) {
  const interviews = useInterviews()
  const interview = interviews.find((item) => item.id === id)
  if (!interview) notFound()

  const idx = interviews.indexOf(interview)
  const prev = idx > 0 ? interviews[idx - 1] : null
  const next = idx < interviews.length - 1 ? interviews[idx + 1] : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto px-4">
          <nav>
            <Link href="/">ホーム</Link>
            <span>&gt;</span>
            <Link href="/interview">取材・レポート</Link>
            <span>&gt;</span>
            <span className="text-gray-800">{interview.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Detail */}
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4">
          <article className="article-detail">
            {/* Meta */}
            <div className="article-detail__meta">
              <span className="article-detail__date">{interview.date}</span>
              <span className="article-detail__tag">{interview.category}</span>
            </div>

            {/* Title */}
            <h1 className="article-detail__title">{interview.title}</h1>

            {/* Hero Photo */}
            <div className="article-detail__hero" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/pei_think.png" alt="" style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.5, marginBottom: '8px' }} />
              <span style={{ color: '#ccc', fontSize: '0.85rem' }}>取材写真</span>
            </div>

            {/* Body */}
            <div className="article-detail__body">
              {interview.body.map((item, i) => (
                <BodyBlock key={i} item={item} />
              ))}
            </div>

            {/* Share */}
            <div className="article-detail__share">
              <span>この記事をシェア：</span>
              <ShareButtons />
            </div>

            {/* Prev / Next */}
            <div className="article-detail__nav">
              {prev ? (
                <Link href={`/interview/${prev.id}`}>&larr; 前の記事</Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/interview/${next.id}`}>次の記事 &rarr;</Link>
              ) : (
                <span />
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

function BodyBlock({ item }: { item: InterviewBodyItem }) {
  switch (item.type) {
    case 'p':
      return <p>{item.text}</p>;
    case 'h2':
      return <h2>{item.text}</h2>;
    case 'h3':
      return <h3>{item.text}</h3>;
    case 'blockquote':
      return (
        <blockquote>
          <p>{item.text}</p>
        </blockquote>
      );
    case 'ul':
      return (
        <ul>
          {item.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {item.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ol>
      );
    case 'img':
      return (
        <div className="img-placeholder">{item.alt}</div>
      );
    default:
      return null;
  }
}
