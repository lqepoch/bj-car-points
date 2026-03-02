import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://bj-car-points.pages.dev'),
  title: "北京小客车家庭积分计算器 - 摇号积分查询工具 | 2026最新政策",
  description: "北京小客车指标家庭积分在线计算器，支持普通摇号、新能源轮候积分计算。基于2026年最新官方政策规则，自动计算家庭总积分，帮助您了解申请资格和中签概率。免费使用，实时计算，准确可靠。",
  keywords: "北京摇号,小客车指标,家庭积分,积分计算器,新能源轮候,摇号积分查询,北京车牌,家庭摇号,北京购车,车牌申请,摇号政策,积分排名",
  authors: [{ name: "北京小客车积分计算器团队" }],
  creator: "北京小客车积分计算器",
  publisher: "北京小客车积分计算器",
  category: "工具",
  classification: "在线计算器",
  openGraph: {
    title: "北京小客车家庭积分计算器 - 2026最新政策",
    description: "基于官方政策规则自动计算家庭总积分，支持普通摇号和新能源轮候积分计算，帮助您了解申请资格和中签概率",
    type: "website",
    locale: "zh_CN",
    url: "https://bj-car-points.pages.dev",
    siteName: "北京小客车家庭积分计算器",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "北京小客车家庭积分计算器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "北京小客车家庭积分计算器",
    description: "基于官方政策规则自动计算家庭总积分",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bj-car-points.pages.dev",
  },
  verification: {
    google: "google-site-verification-placeholder",
    yandex: "yandex-verification-placeholder",
    other: {
      "baidu-site-verification": "codeva-placeholder",
      "360-site-verification": "placeholder",
      "sogou_site_verification": "placeholder",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 搜索引擎验证 */}
        <meta name="baidu-site-verification" content="codeva-placeholder" />
        <meta name="360-site-verification" content="placeholder" />
        <meta name="sogou_site_verification" content="placeholder" />
        <meta name="google-site-verification" content="google-site-verification-placeholder" />
        
        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "北京小客车家庭积分计算器",
              "description": "北京小客车指标家庭积分在线计算器，支持普通摇号、新能源轮候积分计算",
              "url": "https://bj-car-points.pages.dev",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CNY"
              },
              "author": {
                "@type": "Organization",
                "name": "北京小客车积分计算器团队"
              },
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString().split('T')[0],
              "inLanguage": "zh-CN",
              "isAccessibleForFree": true,
              "keywords": "北京摇号,小客车指标,家庭积分,积分计算器,新能源轮候,摇号积分查询,北京车牌,家庭摇号"
            })
          }}
        />
        
        {/* 百度统计 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?your-baidu-analytics-id";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })();
            `
          }}
        />
      </head>
      <body>
        {children}
        
        {/* 页脚导航 */}
        <footer style={{
          marginTop: '60px',
          padding: '40px 20px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div>
                <h4 style={{ marginBottom: '15px', color: 'var(--text)' }}>关于我们</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  专业的北京小客车指标积分计算工具，基于官方政策规则，为您提供准确的积分计算服务。
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: '15px', color: 'var(--text)' }}>快速链接</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="/about" style={{ fontSize: '14px', color: 'var(--brand)', textDecoration: 'none' }}>关于我们</a>
                  <a href="/privacy" style={{ fontSize: '14px', color: 'var(--brand)', textDecoration: 'none' }}>隐私政策</a>
                  <a href="https://xkczb.jtw.beijing.gov.cn" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--brand)', textDecoration: 'none' }}>官方网站</a>
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '15px', color: 'var(--text)' }}>联系方式</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  如有问题或建议，欢迎通过GitHub Issues联系我们。
                </p>
              </div>
            </div>
            
            <div style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              <p>© 2024-2026 北京小客车家庭积分计算器. 本工具仅供参考，以官方公告和系统结果为准。</p>
              <p style={{ marginTop: '8px' }}>
                数据来源：
                <a href="https://xkczb.jtw.beijing.gov.cn/bszn/20201230/1609342087846_1.html" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style={{ color: 'var(--brand)', textDecoration: 'none', marginLeft: '4px' }}>
                  北京市交通委员会官方政策文件
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
