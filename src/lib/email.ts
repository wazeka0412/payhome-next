import { Resend } from 'resend'

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
