'use client';

import Link from 'next/link';
import ShareButtons from '@/components/ui/ShareButtons';
import { useNews } from '@/lib/content-store';

export default function NewsDetailContent({ id }: { id: string }) {
  const news = useNews();
  const item = news.find(n => n.id === id);

  if (!item) {
    return <div className="text-center py-20 text-gray-400">記事が見つかりません</div>;
  }

  const idx = news.findIndex(n => n.id === id);
  const prev = idx > 0 ? news[idx - 1] : null;
  const next = idx < news.length - 1 ? news[idx + 1] : null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto px-4">
          <nav>
            <Link href="/">ホーム</Link>
            <span>&gt;</span>
            <Link href="/news">ニュース</Link>
            <span>&gt;</span>
            <span className="text-gray-800">{item.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4">
          <article className="article-detail">
            {/* Meta */}
            <div className="article-detail__meta">
              <span className="article-detail__date">{item.date}</span>
              <span className="article-detail__tag">{item.category}</span>
            </div>

            {/* Title */}
            <h1 className="article-detail__title">{item.title}</h1>

            {/* Photo */}
            <div className="article-detail__hero" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/pei_think.png" alt="" style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.5, marginBottom: '8px' }} />
              <span style={{ color: '#ccc', fontSize: '0.85rem' }}>記事イメージ</span>
            </div>

            {/* Body */}
            <div
              className="article-detail__body"
              dangerouslySetInnerHTML={{ __html: item.body }}
            />

            {/* Share */}
            <div className="article-detail__share">
              <span>この記事をシェア：</span>
              <ShareButtons />
            </div>

            {/* Prev/Next */}
            <div className="article-detail__nav">
              {prev ? (
                <Link href={`/news/${prev.id}`}>&larr; 前の記事</Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/news/${next.id}`}>次の記事 &rarr;</Link>
              ) : (
                <span />
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
