import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "北京小客车家庭积分计算器 - 摇号积分查询工具 | 2026最新政策",
  description: "北京小客车指标家庭积分在线计算器，支持普通摇号、新能源轮候积分计算。基于2026年最新官方政策规则，自动计算家庭总积分，帮助您了解申请资格和中签概率。",
  keywords: "北京摇号,小客车指标,家庭积分,积分计算器,新能源轮候,摇号积分查询,北京车牌,家庭摇号",
  authors: [{ name: "北京小客车积分计算器" }],
  openGraph: {
    title: "北京小客车家庭积分计算器",
    description: "基于官方政策规则自动计算家庭总积分，帮助您了解申请资格和中签概率",
    type: "website",
    locale: "zh_CN",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://bj-car-points.pages.dev",
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
        <meta name="baidu-site-verification" content="codeva-placeholder" />
        <meta name="360-site-verification" content="placeholder" />
        <meta name="sogou_site_verification" content="placeholder" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
