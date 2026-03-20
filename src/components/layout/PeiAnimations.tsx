'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

// ページごとのpeek-in設定（旧サイトと同一）
const PEEK_CONFIG: Record<string, { side: 'left' | 'right'; image: string; text: string } | null> = {
  '/': null, // TOPは左右両方
  '/videos': { side: 'right', image: '/images/pei_think.png', text: 'どの動画が\n気になる？' },
  '/interview': { side: 'left', image: '/images/pei_surprise.png', text: '取材の裏側、\n面白いよ！' },
  '/articles': { side: 'left', image: '/images/pei_confused.png', text: '参考になる\n記事ばかり！' },
  '/about': { side: 'right', image: '/images/pei_wink.png', text: 'よろしくね！' },
  '/consultation': { side: 'left', image: '/images/pei_smile.png', text: 'お気軽に\nご相談を！' },
  '/magazine': { side: 'right', image: '/images/pei_think.png', text: '毎月発行\nしてるよ！' },
  '/webinar': { side: 'left', image: '/images/pei_smile.png', text: '一緒に\n学ぼう！' },
  '/builders': { side: 'right', image: '/images/pei_wink.png', text: '素敵な工務店\nばかり！' },
  '/area': { side: 'left', image: '/images/pei_smile.png', text: 'エリアで\n探そう！' },
}

export default function PeiAnimations() {
  const pathname = usePathname()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [peekLeftVisible, setPeekLeftVisible] = useState(false)
  const [peekRightVisible, setPeekRightVisible] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const peekShownRef = useRef({ left: false, right: false })

  // ページごとのpeek-in設定を取得
  const isTopPage = pathname === '/'
  const pageConfig = PEEK_CONFIG[pathname] || null

  // ページ遷移時にpeekをリセット
  useEffect(() => {
    peekShownRef.current = { left: false, right: false }
    setPeekLeftVisible(false)
    setPeekRightVisible(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.add('pei-page-loaded')

    const handleScroll = () => {
      const threshold = window.innerWidth <= 768 ? 300 : 600
      setShowBackToTop(window.scrollY > threshold)

      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)

      const ratio = scrollTop / Math.max(docHeight, 1)

      if (isTopPage) {
        // TOPは左右両方
        if (ratio > 0.2 && !peekShownRef.current.left) {
          peekShownRef.current.left = true
          setPeekLeftVisible(true)
          setTimeout(() => setPeekLeftVisible(false), 5000)
        }
        if (ratio > 0.55 && !peekShownRef.current.right) {
          peekShownRef.current.right = true
          setPeekRightVisible(true)
          setTimeout(() => setPeekRightVisible(false), 5000)
        }
      } else if (pageConfig) {
        // サブページは片方のみ
        const side = pageConfig.side
        if (ratio > 0.35 && !peekShownRef.current[side]) {
          peekShownRef.current[side] = true
          if (side === 'left') {
            setPeekLeftVisible(true)
            setTimeout(() => setPeekLeftVisible(false), 5000)
          } else {
            setPeekRightVisible(true)
            setTimeout(() => setPeekRightVisible(false), 5000)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    setTimeout(handleScroll, 500)

    // Greeting (once per session)
    if (!sessionStorage.getItem('pei-greeted')) {
      setTimeout(() => {
        setShowGreeting(true)
        sessionStorage.setItem('pei-greeted', '1')
      }, 2000)
      setTimeout(() => setShowGreeting(false), 8000)
    }

    // Section fade-in
    const fadeTimer = setTimeout(() => {
      const sections = document.querySelectorAll('section')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top > window.innerHeight) {
          section.classList.add('fade-in-section')
        } else {
          section.classList.add('fade-in-section', 'is-visible')
        }
      })
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0, rootMargin: '100px 0px 0px 0px' }
      )
      sections.forEach((s) => observer.observe(s))
      setTimeout(() => sections.forEach((s) => s.classList.add('is-visible')), 2000)
    }, 100)

    // === カードホバー/タップ弾みエフェクト（旧サイトと同一） ===
    const cards = document.querySelectorAll('[class*="card"], [class*="Card"], a[class*="rounded"]')
    cards.forEach(card => {
      const el = card as HTMLElement
      el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s'
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = ''
        el.style.boxShadow = ''
      })
      el.addEventListener('touchstart', () => { el.style.transform = 'scale(0.97)' }, { passive: true })
      el.addEventListener('touchend', () => { el.style.transform = '' }, { passive: true })
    })

    // === ボタンホバー効果 ===
    const buttons = document.querySelectorAll('a[class*="bg-[#E8740C]"], button[class*="bg-[#E8740C]"], a[class*="border-[#E8740C]"]')
    buttons.forEach(btn => {
      const el = btn as HTMLElement
      el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = ''
        el.style.boxShadow = ''
      })
      el.addEventListener('mousedown', () => { el.style.transform = 'translateY(0) scale(0.98)' })
      el.addEventListener('mouseup', () => { el.style.transform = '' })
    })

    // === ページ遷移フェードアウト（Next.jsのルーター対応） ===
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as Element)?.closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return
      if (link.closest('header a:first-child') || e.defaultPrevented) return
      // Next.jsのLinkはclient-side navigationを使うのでbodyクラスでフェード
      document.body.classList.add('pei-page-exit')
      setTimeout(() => {
        document.body.classList.remove('pei-page-exit')
        document.body.classList.add('pei-page-loaded')
      }, 400)
    }
    document.addEventListener('click', handleLinkClick)

    return () => {
      document.body.classList.remove('pei-page-loaded')
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleLinkClick)
      clearTimeout(fadeTimer)
    }
  }, [isTopPage, pageConfig])

  // Cursor follower (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth <= 1024 || 'ontouchstart' in window) return

    const cursor = document.createElement('div')
    cursor.className = 'pei-cursor'
    cursor.innerHTML = '<img src="/images/pei_wink.png" alt="" width="32" height="32">'
    document.body.appendChild(cursor)

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0
    let animId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      cursor.style.opacity = '1'
    }
    document.addEventListener('mousemove', onMove)

    function animate() {
      curX += (mouseX - curX) * 0.08
      curY += (mouseY - curY) * 0.08
      cursor.style.transform = `translate(${curX + 15}px, ${curY + 15}px)`
      animId = requestAnimationFrame(animate)
    }
    animate()

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('a, button, .btn')) {
        const img = cursor.querySelector('img')
        if (img) img.src = '/images/pei_surprise.png'
        cursor.style.transform = `translate(${curX + 15}px, ${curY + 15}px) scale(1.3)`
      }
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('a, button, .btn')) {
        const img = cursor.querySelector('img')
        if (img) img.src = '/images/pei_wink.png'
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(animId)
      cursor.remove()
    }
  }, [])

  // Exit Intent Popup（改善版：段階的トリガー + ページ別内容）
  const [exitPopupContent, setExitPopupContent] = useState<{
    image: string; title: string; desc: string;
    cta1: { label: string; href: string; color: string };
    cta2: { label: string; href: string; color: string };
    timer?: string;
  } | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('exit-popup-shown')) return

    let dwellTime = 0
    let scrolledPast50 = false
    let hasInteracted = false
    let idleTimer: NodeJS.Timeout | null = null
    let dwellTimer: NodeJS.Timeout | null = null
    let lastScrollY = window.scrollY

    // 滞在時間カウント
    dwellTimer = setInterval(() => { dwellTime++ }, 1000)

    // インタラクション検知
    const markInteraction = () => { hasInteracted = true }
    document.addEventListener('touchstart', markInteraction, { passive: true })
    document.addEventListener('click', markInteraction)

    // ページ別のポップアップ内容を決定
    function getPopupContent() {
      const p = pathname
      const campaignTimer = '🎉 4/30まで！無料相談で1,000円分PayPay進呈'
      if (p.startsWith('/property/')) {
        return {
          image: '/images/pei_wink.png',
          title: 'この家、気になりますか？',
          desc: '今なら無料相談で1,000円分のPayPayをプレゼント！動画で紹介した工務店に相談できます。',
          cta1: { label: '無料相談する（PayPay進呈）', href: '/consultation', color: '#E8740C' },
          cta2: { label: 'LINEで聞いてみる', href: 'https://line.me/R/ti/p/@253gzmoh', color: '#06C755' },
          timer: campaignTimer,
        }
      }
      if (p === '/videos' || p === '/area') {
        return {
          image: '/images/pei_smile.png',
          title: 'お探しの家、見つかりましたか？',
          desc: '無料相談で1,000円分、見学会予約で4,000円分のPayPayをプレゼント中！',
          cta1: { label: '無料相談する（PayPay進呈）', href: '/consultation', color: '#E8740C' },
          cta2: { label: '見学会を予約する（4,000円）', href: '/event', color: '#D4660A' },
          timer: campaignTimer,
        }
      }
      if (p === '/simulator') {
        return {
          image: '/images/pei_think.png',
          title: '資金計画、プロに相談しませんか？',
          desc: '今なら無料相談で1,000円分PayPay進呈！ぺいほーむ経由の契約で10万円キャッシュバックも。',
          cta1: { label: '資金計画を無料相談（PayPay進呈）', href: '/consultation', color: '#E8740C' },
          cta2: { label: 'LINEで気軽に質問', href: 'https://line.me/R/ti/p/@253gzmoh', color: '#06C755' },
          timer: '🎉 4/30まで！契約で総額105,000円プレゼント',
        }
      }
      if (p === '/builders' || p.startsWith('/builders/')) {
        return {
          image: '/images/pei_wink.png',
          title: '工務店選びに迷っていますか？',
          desc: '無料相談で1,000円分PayPay進呈！あなたに合った工務店を2〜3社厳選してご紹介します。',
          cta1: { label: '工務店を紹介してもらう（PayPay進呈）', href: '/consultation', color: '#E8740C' },
          cta2: { label: '資料だけ請求する', href: '/catalog', color: '#D4660A' },
          timer: campaignTimer,
        }
      }
      if (p === '/consultation' || p === '/catalog' || p === '/event') {
        return null
      }
      if (p.startsWith('/interview') || p.startsWith('/news/') || p.startsWith('/articles/') || p.startsWith('/voice')) {
        return {
          image: '/images/pei_confused.png',
          title: '春のキャンペーン実施中！',
          desc: '無料相談で1,000円、見学会予約で4,000円分のPayPayをプレゼント。さらに契約で10万円！',
          cta1: { label: '無料相談する（1,000円PayPay）', href: '/consultation', color: '#E8740C' },
          cta2: { label: '見学会を予約（4,000円PayPay）', href: '/event', color: '#D4660A' },
          timer: '🎉 4/30まで！総額105,000円プレゼント',
        }
      }
      // TOP・その他
      return {
        image: '/images/pei_confused.png',
        title: '春のキャンペーン実施中！',
        desc: '無料相談するだけで1,000円分のPayPayをプレゼント。見学会予約なら4,000円分！',
        cta1: { label: '無料相談する（PayPay進呈）', href: '/consultation', color: '#E8740C' },
        cta2: { label: 'LINEで気軽に相談', href: 'https://line.me/R/ti/p/@253gzmoh', color: '#06C755' },
        timer: '🎉 4/30まで！総額105,000円プレゼント',
      }
    }

    function triggerPopup() {
      if (sessionStorage.getItem('exit-popup-shown')) return
      const content = getPopupContent()
      if (!content) return
      sessionStorage.setItem('exit-popup-shown', '1')
      setExitPopupContent(content)
      setShowExitPopup(true)
    }

    // スクロール率の追跡
    const handleScroll = () => {
      const scrollRatio = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)
      if (scrollRatio > 0.5) scrolledPast50 = true

      // モバイル: 滞在20秒 + スクロール50%超 + 操作3秒停止で発動
      if (window.innerWidth <= 1024) {
        if (idleTimer) clearTimeout(idleTimer)
        if (dwellTime >= 20 && scrolledPast50 && hasInteracted) {
          idleTimer = setTimeout(triggerPopup, 3000)
        }

        // ページ上部で素早く上スクロール（戻ろうとする動作）
        const currentY = window.scrollY
        const scrollDelta = lastScrollY - currentY
        if (scrollDelta > 80 && currentY < 200 && dwellTime >= 15 && hasInteracted) {
          triggerPopup()
        }
        lastScrollY = currentY
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // PC: 滞在15秒 + スクロール50%超 + マウス離脱
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && dwellTime >= 15 && scrolledPast50) {
        triggerPopup()
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    // モバイル: タッチ操作停止の検知
    const resetIdleOnTouch = () => {
      if (idleTimer) clearTimeout(idleTimer)
    }
    document.addEventListener('touchmove', resetIdleOnTouch, { passive: true })

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('touchstart', markInteraction)
      document.removeEventListener('click', markInteraction)
      document.removeEventListener('touchmove', resetIdleOnTouch)
      window.removeEventListener('scroll', handleScroll)
      if (dwellTimer) clearInterval(dwellTimer)
      if (idleTimer) clearTimeout(idleTimer)
    }
  }, [pathname]);

  // Logo Easter Egg
  useEffect(() => {
    const logo = document.querySelector('header a')
    if (!logo) return

    let clickCount = 0
    let clickTimer: NodeJS.Timeout

    const onClick = (e: Event) => {
      clickCount++
      clearTimeout(clickTimer)
      clickTimer = setTimeout(() => { clickCount = 0 }, 1200)

      if (clickCount >= 3) {
        e.preventDefault()
        const rect = (logo as HTMLElement).getBoundingClientRect()
        const faces = ['/images/pei_wink.png', '/images/pei_smile.png', '/images/pei_surprise.png', '/images/pei_think.png', '/images/pei_confused.png']
        const count = window.innerWidth <= 768 ? 6 : 8
        for (let i = 0; i < count; i++) {
          const img = document.createElement('img')
          img.src = faces[Math.floor(Math.random() * faces.length)]
          img.style.cssText = `position:fixed;left:${rect.left + Math.random() * rect.width}px;top:${rect.bottom}px;width:40px;height:40px;pointer-events:none;z-index:10000;animation:pei-float-up ${1 + Math.random()}s ease-out forwards;animation-delay:${Math.random() * 0.3}s;`
          document.body.appendChild(img)
          setTimeout(() => img.remove(), 2000)
        }
        clickCount = 0
      }
    }

    logo.addEventListener('click', onClick)
    return () => {
      logo.removeEventListener('click', onClick)
      clearTimeout(clickTimer)
    }
  }, [])

  // Touch animation (旧サイトと同一)
  const handlePeiTouch = useCallback((el: HTMLElement) => {
    const faces = ['😊', '🏠', '✨', '💫', '🎉', '❤️', '👍', '🌟']
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div')
      p.textContent = faces[Math.floor(Math.random() * faces.length)]
      const sz = 18 + Math.random() * 14
      p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${sz}px;pointer-events:none;z-index:10000;opacity:1;`
      document.body.appendChild(p)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          p.style.transition = 'all 1.2s ease-out'
          p.style.left = `${cx + (Math.random() - 0.5) * 180}px`
          p.style.top = `${cy - 60 - Math.random() * 120}px`
          p.style.opacity = '0'
          p.style.transform = `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`
        })
      })
      setTimeout(() => p.remove(), 1400)
    }

    el.style.transition = 'transform 0.3s ease'
    el.style.transform = 'scale(1.4)'
    setTimeout(() => { el.style.transform = 'scale(1)' }, 300)
  }, [])

  // 左peek-inの画像・テキスト
  const leftImage = isTopPage ? '/images/pei_smile.png' : (pageConfig?.side === 'left' ? pageConfig.image : '/images/pei_smile.png')
  const leftText = isTopPage ? '家づくり、\n楽しもう！' : (pageConfig?.side === 'left' ? pageConfig.text : '家づくり、\n楽しもう！')
  // 右peek-inの画像・テキスト
  const rightImage = isTopPage ? '/images/pei_ugh.png' : (pageConfig?.side === 'right' ? pageConfig.image : '/images/pei_ugh.png')
  const rightText = isTopPage ? '最後まで\n見てね〜' : (pageConfig?.side === 'right' ? pageConfig.text : '最後まで\n見てね〜')

  // 表示するかどうか
  const showLeft = isTopPage || pageConfig?.side === 'left'
  const showRight = isTopPage || pageConfig?.side === 'right'

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[10000] rounded-r-sm"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #E8740C, #D4660A)',
          transition: 'width 0.1s linear',
        }}
      />

      {/* Back to Top */}
      <button
        onClick={(e) => {
          handlePeiTouch(e.currentTarget as HTMLElement)
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200)
        }}
        className={`fixed z-[800] transition-all duration-300 cursor-pointer ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ bottom: '100px', right: '20px' }}
        aria-label="ページトップへ戻る"
      >
        <div className="w-14 h-14 rounded-full bg-white border-[3px] border-[#E8740C] shadow-lg flex flex-col items-center justify-center hover:scale-110 transition-transform">
          <Image src="/images/icon.png" alt="" width={28} height={28} className="object-contain" />
          <span className="text-[10px] font-bold text-[#E8740C] leading-none -mt-0.5">TOPへ</span>
        </div>
      </button>

      {/* Peek-in Left — 旧サイトと完全同一のCSS transition */}
      {showLeft && (
        <div
          className="fixed z-[800] cursor-pointer pei-peek-wrap"
          style={{
            left: 0,
            bottom: '30%',
            transform: peekLeftVisible ? 'translateX(-20%)' : 'translateX(-85%)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={(e) => {
            const img = e.currentTarget.querySelector('img')
            if (img) handlePeiTouch(img as HTMLElement)
            setPeekLeftVisible(false)
          }}
        >
          <Image
            src={leftImage}
            alt="ペイさん"
            width={80}
            height={80}
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', transition: 'transform 0.3s' }}
          />
          {/* 吹き出し: デフォルトopacity:0 scale(0.8)、ホバーでopacity:1 scale(1)（旧サイトと同一） */}
          <div
            className="absolute pointer-events-none bg-white pei-bubble"
            style={{
              top: '-45px',
              left: '60px',
              padding: '8px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#E8740C',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
              opacity: 0,
              transform: 'scale(0.8)',
              transition: 'all 0.3s',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: leftText.replace(/\n/g, '<br>') }} />
            <div
              className="absolute bg-white"
              style={{ width: '10px', height: '10px', transform: 'rotate(45deg)', bottom: '-4px', left: '20px' }}
            />
          </div>
        </div>
      )}

      {/* Peek-in Right — 旧サイトと完全同一のCSS transition */}
      {showRight && (
        <div
          className="fixed z-[800] cursor-pointer pei-peek-wrap"
          style={{
            right: 0,
            bottom: '15%',
            transform: peekRightVisible ? 'translateX(20%)' : 'translateX(85%)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={(e) => {
            const img = e.currentTarget.querySelector('img')
            if (img) handlePeiTouch(img as HTMLElement)
            setPeekRightVisible(false)
          }}
        >
          <Image
            src={rightImage}
            alt="ペイさん"
            width={80}
            height={80}
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', transition: 'transform 0.3s' }}
          />
          <div
            className="absolute pointer-events-none bg-white pei-bubble"
            style={{
              top: '-45px',
              right: '60px',
              padding: '8px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#E8740C',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
              opacity: 0,
              transform: 'scale(0.8)',
              transition: 'all 0.3s',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: rightText.replace(/\n/g, '<br>') }} />
            <div
              className="absolute bg-white"
              style={{ width: '10px', height: '10px', transform: 'rotate(45deg)', bottom: '-4px', right: '20px' }}
            />
          </div>
        </div>
      )}

      {/* Exit Intent Popup（ページ別コンテンツ + タイマー表示） */}
      {showExitPopup && exitPopupContent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" onClick={() => setShowExitPopup(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center relative animate-[popup-in_0.4s_ease-out]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowExitPopup(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer">✕</button>
            <img src={exitPopupContent.image} alt="ペイさん" className="w-20 h-20 mx-auto mb-4 object-contain" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">{exitPopupContent.title}</h3>
            <p className="text-sm text-gray-500 mb-5">{exitPopupContent.desc}</p>
            {exitPopupContent.timer && (
              <div className="mb-4 py-2 px-4 bg-red-50 rounded-lg">
                <p className="text-xs font-bold text-red-500">🔥 {exitPopupContent.timer}</p>
              </div>
            )}
            <a
              href={exitPopupContent.cta1.href}
              className="block w-full text-white font-bold py-3.5 rounded-full transition text-sm mb-3"
              style={{ background: exitPopupContent.cta1.color }}
              onClick={(e) => {
                if (exitPopupContent.cta1.href === '#') {
                  e.preventDefault()
                  setShowExitPopup(false)
                  // AIチャットを開く
                  const chatBtn = document.querySelector('[aria-label*="チャット"], [class*="chat-trigger"]') as HTMLElement
                  if (chatBtn) chatBtn.click()
                }
              }}
            >
              {exitPopupContent.cta1.label}
            </a>
            <a
              href={exitPopupContent.cta2.href}
              target={exitPopupContent.cta2.href.startsWith('http') ? '_blank' : undefined}
              rel={exitPopupContent.cta2.href.startsWith('http') ? 'noopener' : undefined}
              className="block w-full text-white font-bold py-3.5 rounded-full transition text-sm"
              style={{ background: exitPopupContent.cta2.color }}
            >
              {exitPopupContent.cta2.label}
            </a>
          </div>
        </div>
      )}

      {/* Greeting Popup */}
      <div
        className={`fixed left-4 z-[800] transition-all duration-500 ${
          showGreeting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ bottom: '100px' }}
        onClick={() => setShowGreeting(false)}
      >
        <div className="flex items-end gap-2 cursor-pointer">
          <Image src="/images/pei_wink.png" alt="ペイさん" width={56} height={56} />
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-orange-100 max-w-[200px]">
            <p className="text-sm font-bold text-[#E8740C]">ようこそ！ぺいほーむへ！</p>
            <p className="text-xs text-gray-500 mt-1">家づくりの情報をたっぷりお届けします</p>
          </div>
        </div>
      </div>
    </>
  )
}
