'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAdjacentBizWebinar, type BizWebinar } from '@/lib/biz-webinars-data'
import ShareButtons from '@/components/ui/ShareButtons'

export default function WebinarDetailClient({ webinar, webinarId }: { webinar: BizWebinar; webinarId: string }) {
  const [formData, setFormData] = useState({ company: '', name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const { prev, next } = getAdjacentBizWebinar(webinarId)
  const isUpcoming = webinar.category === '開催予定'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'セミナー申込', ...formData, webinarTitle: webinar.title, webinarDate: webinar.date }),
      })
    } catch (e) { /* silent fail */ }
    setSubmitted(true)
  }

  return (
    <>
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto px-4">
          <nav>
            <Link href="/biz">ホーム</Link>
            <span>&gt;</span>
            <Link href="/biz/webinar">セミナー</Link>
            <span>&gt;</span>
            <span className="text-gray-800">{webinar.title}</span>
          </nav>
        </div>
      </div>

      <section className="py-0">
        <div className="max-w-7xl mx-auto px-4">
          <article className="article-detail">
            <div className="article-detail__meta">
              <span className="article-detail__date">{webinar.date}</span>
              <span className="article-detail__tag">{webinar.category}</span>
            </div>
            <h1 className="article-detail__title">{webinar.title}</h1>
            <div className="article-detail__hero" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/images/pei_think.png" alt="" style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.5, marginBottom: '8px' }} />
              <span style={{ color: '#ccc', fontSize: '0.85rem' }}>セミナーイメージ</span>
            </div>

            {/* Event Info */}
            <div style={{ background: '#fef3e8', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', borderLeft: '4px solid #E8740C' }}>
              {webinar.info.split('\n').map((line, i) => (
                <p key={i} style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.8, margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>

            <div className="article-detail__body" dangerouslySetInnerHTML={{ __html: webinar.body }} />

            {/* Speakers */}
            {webinar.speakers && webinar.speakers.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', borderLeft: '4px solid #E8740C', paddingLeft: '14px', marginBottom: '16px' }}>登壇者</h2>
                {webinar.speakers.map((speaker, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#faf8f5', borderRadius: '12px', marginBottom: '8px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFF8F0, #FDEBD0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src="/images/pei_think.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain', opacity: 0.4 }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a', margin: 0 }}>{speaker.name}</p>
                      <p style={{ fontSize: '0.8rem', color: '#888', margin: '2px 0 0' }}>{speaker.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Key Points */}
            {webinar.keyPoints && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', borderLeft: '4px solid #E8740C', paddingLeft: '14px', marginBottom: '16px' }}>主なポイント</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {webinar.keyPoints.map((point, i) => (
                    <span key={i} style={{ background: '#fef3e8', color: '#E8740C', fontSize: '0.85rem', fontWeight: 600, padding: '6px 16px', borderRadius: '20px' }}>{point}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            {webinar.participants && (
              <div style={{ marginTop: '20px', padding: '16px 20px', background: '#faf8f5', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>{webinar.participants}</span>
              </div>
            )}

            {/* Application Form */}
            {isUpcoming && (
              <div style={{ marginTop: '48px', padding: '32px', background: '#faf8f5', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: '8px' }}>このセミナーに申し込む</h2>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888', marginBottom: '24px' }}>以下のフォームに必要事項をご記入ください</p>

                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <img src="/images/pei_wink.png" alt="ペイさん" style={{ width: '112px', height: '112px', objectFit: 'contain', margin: '0 auto 20px' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>お申し込みを受け付けました！</h3>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>開催前日までにZoomリンクをメールでお送りいたします。</p>
                    <Link href="/biz/webinar" style={{ display: 'inline-block', background: '#E8740C', color: '#fff', fontWeight: 700, padding: '12px 32px', borderRadius: '30px', textDecoration: 'none', fontSize: '0.9rem' }}>
                      セミナー一覧に戻る
                    </Link>
                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(6,199,85,0.1)', borderRadius: '12px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#06C755', marginBottom: '8px' }}>📱 LINEで最新情報を受け取る</p>
                      <a href="https://line.me/R/ti/p/@253gzmoh" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#06C755', color: '#fff', fontSize: '0.85rem', fontWeight: 700, padding: '10px 24px', borderRadius: '30px', textDecoration: 'none' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.629.629 0 0 1-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.63.63 0 0 1 .495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                        友だち追加
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
                    {[
                      { label: '会社名', key: 'company', required: true },
                      { label: 'お名前', key: 'name', required: true },
                      { label: 'メールアドレス', key: 'email', required: true, type: 'email' },
                      { label: '電話番号', key: 'phone', required: false, type: 'tel' },
                    ].map((field) => (
                      <div key={field.key} style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                          {field.label}
                          {field.required && <span style={{ color: '#e74c3c', marginLeft: '4px', fontSize: '0.75rem' }}>必須</span>}
                        </label>
                        <input
                          type={field.type || 'text'}
                          required={field.required}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>
                    ))}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '6px' }}>ご質問・ご要望</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="当日聞きたいことなどがあればご記入ください"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ width: '100%', padding: '14px', background: '#E8740C', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '30px', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      申し込む（無料）
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Share */}
            <div className="article-detail__share">
              <span>この記事をシェア：</span>
              <ShareButtons />
            </div>

            {/* Prev/Next */}
            <div className="article-detail__nav">
              {prev ? <Link href={`/biz/webinar/${prev.id}`}>&larr; 前のセミナー</Link> : <span />}
              {next ? <Link href={`/biz/webinar/${next.id}`}>次のセミナー &rarr;</Link> : <span />}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
