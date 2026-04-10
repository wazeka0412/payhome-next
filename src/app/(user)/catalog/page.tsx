import { redirect } from 'next/navigation';

/**
 * v4.0 で資料請求機能は廃止されました。
 * 代替として AI家づくり診断（/diagnosis）にリダイレクトします。
 * 既存のブックマーク・SEO流入に配慮してページは残し、301相当で転送します。
 */
export default function CatalogDeprecatedRedirect() {
  redirect('/diagnosis');
}
