# 北京小客车家庭积分计算器

专业的北京小客车指标家庭积分在线计算工具，基于官方政策规则，为您提供准确的积分计算服务。

## 🚀 功能特点

- **精确计算**：基于2026年最新官方政策规则
- **详细明细**：完整的积分计算过程展示
- **未来预测**：支持未来10年内的积分预测
- **历史记录**：保存和管理计算历史
- **响应式设计**：适配各种设备
- **无障碍支持**：符合WCAG标准

## 🎯 SEO优化特性

### 搜索引擎优化
- ✅ 完整的Meta标签配置
- ✅ Open Graph社交媒体优化
- ✅ Twitter Cards支持
- ✅ 结构化数据（JSON-LD）
- ✅ FAQ结构化数据
- ✅ 网站地图（sitemap.xml）
- ✅ Robots.txt配置
- ✅ 规范化URL设置

### 搜索引擎支持
- ✅ Google搜索优化
- ✅ 百度搜索优化
- ✅ 360搜索支持
- ✅ 搜狗搜索支持
- ✅ 必应搜索支持

### 性能优化
- ✅ 静态站点生成（SSG）
- ✅ CDN加速（Cloudflare Pages）
- ✅ 图片优化
- ✅ 缓存策略
- ✅ 安全头配置

## 📱 PWA支持

- ✅ Web App Manifest
- ✅ 离线访问支持
- ✅ 桌面安装支持
- ✅ 移动端优化

## 🔒 隐私与安全

- ✅ 完整的隐私政策
- ✅ 数据本地存储
- ✅ HTTPS安全传输
- ✅ 安全头配置
- ✅ XSS防护

## 🛠️ 技术栈

- **框架**：Next.js 14 + TypeScript
- **样式**：CSS Modules
- **状态管理**：React Hooks
- **部署**：Cloudflare Pages
- **构建**：静态站点生成

## 📦 部署流程

按照以下顺序执行部署：

### 1. 构建验证
```bash
npm run build
```

### 2. 推送代码
```bash
git add .
git commit -m "描述信息"
git push origin main
```

### 3. 部署到Cloudflare Pages
```bash
npx wrangler pages deploy out --project-name bj-car-points --branch main
```

## 🎨 页面结构

- **首页** (`/`) - 积分计算器主界面
- **关于我们** (`/about`) - 项目介绍和功能说明
- **隐私政策** (`/privacy`) - 隐私保护和数据使用说明
- **404页面** - 友好的错误页面

## 📊 SEO检查清单

- [x] 页面标题优化（Title Tags）
- [x] 元描述优化（Meta Descriptions）
- [x] 关键词配置（Keywords）
- [x] 结构化数据（Schema.org）
- [x] Open Graph标签
- [x] Twitter Cards
- [x] 网站地图（Sitemap）
- [x] Robots.txt
- [x] 规范化URL（Canonical URLs）
- [x] 图片Alt标签
- [x] 语义化HTML结构
- [x] 页面加载速度优化
- [x] 移动端友好性
- [x] HTTPS安全连接
- [x] 内部链接优化

## 🔍 搜索引擎验证

需要在以下平台验证网站所有权：

- **Google Search Console**：使用`google-site-verification`标签
- **百度站长平台**：使用`baidu-site-verification`标签
- **360站长平台**：使用`360-site-verification`标签
- **搜狗站长平台**：使用`sogou_site_verification`标签

## 📈 分析工具

- **百度统计**：网站访问分析
- **Google Analytics**：用户行为分析（可选）

## 🚨 免责声明

本工具仅供参考，计算结果不构成官方承诺。实际积分以北京市小客车指标调控管理办公室公布的官方结果为准。

## 📄 许可证

本项目采用开源许可证，欢迎社区贡献。

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

---

**官方政策参考**：[北京市小客车数量调控暂行规定实施细则](https://xkczb.jtw.beijing.gov.cn/bszn/20201230/1609342087846_1.html)
