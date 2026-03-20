/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://payhome.jp',
  generateRobotsTxt: false, // we have a manual one
  exclude: ['/admin/*', '/dashboard/*', '/api/*', '/mypage'],
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Property pages get higher priority
    if (path.startsWith('/property/')) {
      return { loc: path, changefreq: 'monthly', priority: 0.9 }
    }
    // Top page highest priority
    if (path === '/') {
      return { loc: path, changefreq: 'daily', priority: 1.0 }
    }
    // Video, area, builders pages
    if (['/videos', '/area', '/builders', '/consultation'].includes(path)) {
      return { loc: path, changefreq: 'weekly', priority: 0.8 }
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority }
  },
}
