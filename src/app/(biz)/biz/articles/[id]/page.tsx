import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { bizArticleItems, getBizArticleById, getAdjacentBizArticle } from '@/lib/biz-articles-data';
import ShareButtons from '@/components/ui/ShareButtons';

export function generateStaticParams() {
  return bizArticleItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getBizArticleById(id);
  if (!item) return { title: '記事が見つかりません' };
  return { title: item.title, description: item.excerpt };
}

export default async function BizArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getBizArticleById(id);
  if (!item) notFound();
  const { prev, next } = getAdjacentBizArticle(id);

  return (
    <>
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto px-4">
          <nav>
            <Link href="/biz">ホーム</Link>
            <span>&gt;</span>
            <Link href="/biz/articles">集客ノウハウ</Link>
            <span>&gt;</span>
            <span className="text-gray-800">{item.title}</span>
          </nav>
        </div>
      </div>

      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4">
          <article className="article-detail">
            <div className="article-detail__meta">
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
              {prev ? <Link href={`/biz/articles/${prev.id}`}>&larr; 前の記事</Link> : <span />}
              {next ? <Link href={`/biz/articles/${next.id}`}>次の記事 &rarr;</Link> : <span />}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
