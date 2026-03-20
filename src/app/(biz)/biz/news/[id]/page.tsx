import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { bizNewsItems, getBizNewsById, getAdjacentBizNews } from '@/lib/biz-news-data';
import ShareButtons from '@/components/ui/ShareButtons';

export function generateStaticParams() {
  return bizNewsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getBizNewsById(id);
  if (!item) return { title: '記事が見つかりません' };
  return { title: item.title, description: item.excerpt };
}

export default async function BizNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getBizNewsById(id);
  if (!item) notFound();
  const { prev, next } = getAdjacentBizNews(id);

  return (
    <>
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto px-4">
          <nav>
            <Link href="/biz">ホーム</Link>
            <span>&gt;</span>
            <Link href="/biz/news">業界ニュース</Link>
            <span>&gt;</span>
            <span className="text-gray-800">{item.title}</span>
          </nav>
        </div>
      </div>

      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4">
          <article className="article-detail">
            <div className="article-detail__meta">
              <span className="article-detail__date">{item.date}</span>
              <span className="article-detail__tag">{item.category}</span>
            </div>
            <h1 className="article-detail__title">{item.title}</h1>
            <div className="article-detail__hero" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/pei_think.png" alt="" style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.5, marginBottom: '8px' }} />
              <span style={{ color: '#ccc', fontSize: '0.85rem' }}>記事イメージ</span>
            </div>
            <div className="article-detail__body" dangerouslySetInnerHTML={{ __html: item.body }} />
            <div className="article-detail__share">
              <span>この記事をシェア：</span>
              <ShareButtons />
            </div>
            <div className="article-detail__nav">
              {prev ? <Link href={`/biz/news/${prev.id}`}>&larr; 前の記事</Link> : <span />}
              {next ? <Link href={`/biz/news/${next.id}`}>次の記事 &rarr;</Link> : <span />}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
