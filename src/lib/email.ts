import { Resend } from 'resend'
import type { ContactPreferences } from './contact-preferences'
import {
  CONTACT_FREQUENCY_LABELS,
  CONTACT_CHANNEL_LABELS,
  CONTACT_TIMESLOT_LABELS,
  CONTACT_PURPOSE_LABELS,
  CONSIDERATION_PHASE_LABELS,
} from './contact-preferences'
import type { ViewingMode } from './event-viewing-mode'
import { VIEWING_MODE_INFO } from './event-viewing-mode'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface LeadNotificationData {
  leadId: string
  type: string
  name: string
  email: string
  phone?: string
  area?: string
  budget?: string
  layout?: string
  message?: string
  sourceChannel?: string
  /** Smart Match: contact preferences set by the user */
  contactPreferences?: ContactPreferences | null
  /** Phase 1.5: viewing mode selected at booking time */
  viewingMode?: ViewingMode | null
  /** Event title & date (for 見学会予約 type) */
  eventTitle?: string
  eventDate?: string
}

/**
 * SMART MATCH プロフィールブロックの HTML を生成する
 * 見学会予約の通知メール本文の上部に差し込まれ、工務店様が
 * 最初に目にする情報として機能する。
 */
function renderSmartMatchBlock(lead: LeadNotificationData): string {
  const parts: string[] = []
  const hasViewingMode = Boolean(lead.viewingMode)
  const hasContactPrefs = Boolean(lead.contactPreferences)

  if (!hasViewingMode && !hasContactPrefs) return ''

  parts.push(`
    <div style="background: linear-gradient(135deg, #FFF8F0 0%, #FFF3E6 100%); border: 2px solid #E8740C; border-radius: 12px; padding: 20px; margin: 16px 0;">
      <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
        <div style="flex: 1;">
          <p style="margin: 0; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; color: #E8740C;">
            SMART MATCH｜お客様の希望
          </p>
          <p style="margin: 4px 0 0; font-size: 14px; font-weight: bold; color: #3D2200;">
            お客様との相性の良いコミュニケーション設計
          </p>
          <p style="margin: 6px 0 0; font-size: 11px; color: #6B7280; line-height: 1.6;">
            お客様が事前にお知らせくださったご希望です。最適なタイミング・手段でご対応いただくことで、より質の高い商談をご提供いただけます。
          </p>
        </div>
      </div>
  `)

  // ── Viewing mode ──
  if (hasViewingMode && lead.viewingMode) {
    const info = VIEWING_MODE_INFO[lead.viewingMode]
    parts.push(`
      <div style="background: white; border: 1px solid rgba(232,116,12,0.2); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 36px; vertical-align: top; font-size: 24px; padding-right: 8px;">${info.icon}</td>
            <td>
              <p style="margin: 0; font-size: 10px; font-weight: bold; color: #6B7280;">見学会当日の目的</p>
              <p style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #3D2200;">${info.label}</p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #6B7280;">${info.description}</p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #E8740C; font-weight: 500;">
                おすすめ対応：${info.builderNote}
              </p>
            </td>
          </tr>
        </table>
      </div>
    `)
  }

  // ── Contact preferences ──
  if (hasContactPrefs && lead.contactPreferences) {
    const p = lead.contactPreferences
    const rows: Array<[string, string]> = [
      ['検討フェーズ', CONSIDERATION_PHASE_LABELS[p.consideration_phase].label],
      ['ご希望の連絡頻度', CONTACT_FREQUENCY_LABELS[p.frequency]],
      ['ご希望の連絡手段', p.channels.map((c) => CONTACT_CHANNEL_LABELS[c]).join(' / ')],
      ['ご都合の良い時間帯', p.timeslots.map((t) => CONTACT_TIMESLOT_LABELS[t]).join(' / ')],
      ['連絡目的', CONTACT_PURPOSE_LABELS[p.purpose]],
    ]
    if (p.memo) rows.push(['お客様メモ', `「${p.memo}」`])

    parts.push(`
      <div style="background: white; border-radius: 8px; padding: 12px;">
        <p style="margin: 0 0 8px; font-size: 10px; font-weight: bold; color: #6B7280;">
          連絡の相性設定
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    `)
    for (const [label, value] of rows) {
      parts.push(`
          <tr>
            <td style="padding: 4px 0; color: #E8740C; font-weight: bold; width: 120px; vertical-align: top;">${label}</td>
            <td style="padding: 4px 0; color: #3D2200;">${value}</td>
          </tr>
      `)
    }
    parts.push(`
        </table>
      </div>
    `)
  }

  parts.push(`</div>`)
  return parts.join('')
}

/**
 * 工務店にリード通知メールを送信する
 * 非同期で実行し、失敗してもリード作成には影響しない
 */
export async function sendLeadNotification(
  lead: LeadNotificationData,
  builderEmail: string,
  builderName: string
): Promise<void> {
  if (!resend) {
    console.log('[Email] Resend not configured, skipping notification')
    return
  }

  const smartMatchBlock = renderSmartMatchBlock(lead)

  try {
    await resend.emails.send({
      from: 'ぺいほーむ <noreply@payhome.jp>',
      to: builderEmail,
      subject: `【ぺいほーむ】新しい${lead.type}がありました`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #E8740C; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">ぺいほーむ リード通知</h1>
          </div>
          <div style="padding: 24px; background: #fff;">
            <p style="margin: 0 0 16px;">${builderName} 様</p>
            <p style="margin: 0 0 16px;">新しい<strong>${lead.type}</strong>がありました。</p>

            ${smartMatchBlock}

            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #888; width: 100px;">お名前</td>
                <td style="padding: 8px 0; font-weight: bold;">${lead.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #888;">メール</td>
                <td style="padding: 8px 0;">${lead.email}</td>
              </tr>
              ${lead.phone ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">電話</td><td style="padding: 8px 0;">${lead.phone}</td></tr>` : ''}
              ${lead.area ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">エリア</td><td style="padding: 8px 0;">${lead.area}</td></tr>` : ''}
              ${lead.budget ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">予算</td><td style="padding: 8px 0;">${lead.budget}</td></tr>` : ''}
              ${lead.layout ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">間取り</td><td style="padding: 8px 0;">${lead.layout}</td></tr>` : ''}
              ${lead.eventTitle ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">イベント</td><td style="padding: 8px 0;">${lead.eventTitle}</td></tr>` : ''}
              ${lead.eventDate ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">希望日</td><td style="padding: 8px 0;">${lead.eventDate}</td></tr>` : ''}
              ${lead.sourceChannel ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #888;">流入元</td><td style="padding: 8px 0;">${lead.sourceChannel}</td></tr>` : ''}
            </table>

            ${lead.message ? `<div style="background: #f9f9f9; padding: 12px; border-radius: 8px; margin: 16px 0;"><p style="margin: 0 0 4px; color: #888; font-size: 12px;">メッセージ</p><p style="margin: 0;">${lead.message.split('\n---FORM_META---')[0]}</p></div>` : ''}

            <p style="margin: 24px 0 0; font-size: 12px; color: #888;">
              このメールはぺいほーむプラットフォームから自動送信されています。
            </p>
          </div>
        </div>
      `,
    })
    console.log(`[Email] Lead notification sent to ${builderEmail}`)
  } catch (error) {
    console.error('[Email] Failed to send notification:', error)
  }
}
