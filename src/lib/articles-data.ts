export interface ArticleData {
  id: string;
  tag: string;
  date: string;
  title: string;
  description?: string;
  body?: string;
}

export const articles: ArticleData[] = [
  { id: 'article-01', tag: '家づくりの基本', date: '2026.03.10', title: '注文住宅 vs 建売住宅 ─ あなたに合うのはどっち？' },
  { id: 'article-02', tag: '資金計画', date: '2026.03.05', title: '住宅ローンの基本：固定金利と変動金利の選び方' },
  { id: 'article-03', tag: '間取り', date: '2026.02.28', title: '平屋の間取り完全ガイド ─ 人気の3LDKプラン10選' },
  { id: 'article-04', tag: '設備', date: '2026.02.20', title: 'キッチン選びで後悔しないための5つのポイント' },
  { id: 'article-05', tag: '断熱・省エネ', date: '2026.02.15', title: 'ZEH住宅とは？メリット・デメリットを徹底解説' },
  { id: 'article-06', tag: '土地探し', date: '2026.02.10', title: '鹿児島の土地探し完全ガイド ─ エリア別相場と選び方' },
  { id: 'article-07', tag: '家づくりの基本', date: '2026.02.05', title: '工務店とハウスメーカーの違いを比較してみた' },
  { id: 'article-08', tag: '資金計画', date: '2026.01.28', title: '家づくりの総費用を徹底解説 ─ 見落としがちな諸費用とは' },
  { id: 'article-09', tag: 'メンテナンス', date: '2026.01.20', title: '新築住宅のメンテナンスカレンダー ─ いつ何をすべき？' },
];

export const articleItems = articles;

export function getArticleItem(id: string): ArticleData | undefined {
  return articles.find((item) => item.id === id);
}

export function getAdjacentArticles(id: string): { prev: ArticleData | null; next: ArticleData | null } {
  const index = articles.findIndex((item) => item.id === id);
  return {
    prev: index > 0 ? articles[index - 1] : null,
    next: index < articles.length - 1 ? articles[index + 1] : null,
  };
}
