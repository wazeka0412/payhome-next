'use client'

import { useEffect } from 'react'

export default function BizPageLoader() {
  useEffect(() => {
    document.body.classList.add('pei-page-loaded')

    // === カードホバー/タップ弾みエフェクト ===
    const cards = document.querySelectorAll('[class*="card"], [class*="Card"], [class*="rounded-2xl"]')
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
    const buttons = document.querySelectorAll('a[class*="bg-[#E8740C]"], button[class*="bg-[#E8740C]"]')
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
    })

    // === セクションフェードイン ===
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

    // === ページ遷移フェード ===
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as Element)?.closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return
      document.body.classList.add('pei-page-exit')
      setTimeout(() => {
        document.body.classList.remove('pei-page-exit')
        document.body.classList.add('pei-page-loaded')
      }, 400)
    }
    document.addEventListener('click', handleLinkClick)

    // === スクロール進捗バー ===
    const bar = document.createElement('div')
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#E8740C,#D4660A);z-index:10000;width:0;transition:width 0.1s linear;border-radius:0 2px 2px 0;'
    document.body.appendChild(bar)
    const onScroll = () => {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.body.scrollHeight - window.innerHeight
        bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%'
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.body.classList.remove('pei-page-loaded')
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('scroll', onScroll)
      bar.remove()
    }
  }, [])

  return null
}
