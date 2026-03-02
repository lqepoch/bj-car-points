import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策 - 北京小客车家庭积分计算器",
  description: "了解我们如何保护您的隐私和数据安全，我们的数据收集、使用和保护政策。",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      lineHeight: '1.6',
      color: 'var(--text)'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <Link 
          href="/" 
          style={{ 
            color: 'var(--brand)', 
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← 返回首页
        </Link>
      </div>

      <h1 style={{ marginBottom: '30px', color: 'var(--text)' }}>隐私政策</h1>
      
      <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '30px' }}>
        最后更新时间：2024年12月
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>1. 概述</h2>
        <p style={{ marginBottom: '15px' }}>
          北京小客车家庭积分计算器（以下简称"本工具"）致力于保护用户的隐私和数据安全。
          本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
        </p>
        <p>
          使用本工具即表示您同意本隐私政策的条款。如果您不同意本政策，请停止使用本工具。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>2. 信息收集</h2>
        
        <h3 style={{ marginBottom: '15px', color: 'var(--text)' }}>2.1 您主动提供的信息</h3>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>家庭成员基本信息（角色、摇号次数、轮候年限等）</li>
          <li>家庭申请开始年份</li>
          <li>计算历史记录的保存名称</li>
        </ul>

        <h3 style={{ marginBottom: '15px', color: 'var(--text)' }}>2.2 自动收集的信息</h3>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>访问时间和页面浏览记录</li>
          <li>设备信息（浏览器类型、操作系统等）</li>
          <li>IP地址和地理位置信息</li>
          <li>用户偏好设置（主题模式等）</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>3. 信息使用</h2>
        <p style={{ marginBottom: '15px' }}>我们收集的信息仅用于以下目的：</p>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>提供积分计算服务</li>
          <li>保存和管理您的计算历史记录</li>
          <li>改进工具功能和用户体验</li>
          <li>进行匿名的使用统计分析</li>
          <li>确保工具安全和防止滥用</li>
        </ul>
        <p>
          <strong>重要声明：</strong>我们不会将您的个人信息用于商业目的，不会向第三方出售、租赁或以其他方式转让您的个人信息。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>4. 数据存储</h2>
        
        <h3 style={{ marginBottom: '15px', color: 'var(--text)' }}>4.1 本地存储</h3>
        <p style={{ marginBottom: '15px' }}>
          您的计算数据主要存储在您的浏览器本地存储中，包括：
        </p>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>家庭成员信息</li>
          <li>计算历史记录</li>
          <li>用户偏好设置</li>
        </ul>

        <h3 style={{ marginBottom: '15px', color: 'var(--text)' }}>4.2 服务器存储</h3>
        <p style={{ marginBottom: '15px' }}>
          我们可能会收集匿名的使用统计数据用于改进服务，这些数据不包含任何可识别个人身份的信息。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>5. 数据安全</h2>
        <p style={{ marginBottom: '15px' }}>我们采取以下措施保护您的数据安全：</p>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>使用HTTPS加密传输</li>
          <li>定期更新安全措施</li>
          <li>限制数据访问权限</li>
          <li>监控异常访问行为</li>
        </ul>
        <p>
          尽管我们采取了合理的安全措施，但请注意，没有任何数据传输或存储方法是100%安全的。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>6. Cookie和类似技术</h2>
        <p style={{ marginBottom: '15px' }}>
          本工具使用Cookie和本地存储技术来：
        </p>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>记住您的偏好设置</li>
          <li>保存计算历史记录</li>
          <li>分析网站使用情况</li>
        </ul>
        <p>
          您可以通过浏览器设置管理Cookie，但这可能会影响工具的正常使用。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>7. 第三方服务</h2>
        <p style={{ marginBottom: '15px' }}>
          本工具可能使用以下第三方服务：
        </p>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>百度统计 - 用于网站访问分析</li>
          <li>Cloudflare Pages - 用于网站托管</li>
        </ul>
        <p>
          这些第三方服务有自己的隐私政策，我们建议您查阅相关政策了解详情。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>8. 用户权利</h2>
        <p style={{ marginBottom: '15px' }}>您有权：</p>
        <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
          <li>查看和修改您的个人信息</li>
          <li>删除您的计算历史记录</li>
          <li>选择不接受Cookie</li>
          <li>停止使用本工具</li>
        </ul>
        <p>
          如需行使上述权利或有任何隐私相关问题，请通过GitHub Issues联系我们。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>9. 儿童隐私</h2>
        <p>
          本工具不专门面向13岁以下的儿童。如果我们发现收集了13岁以下儿童的个人信息，
          我们将尽快删除这些信息。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>10. 政策更新</h2>
        <p style={{ marginBottom: '15px' }}>
          我们可能会不时更新本隐私政策。重大变更时，我们会在网站上发布通知。
          继续使用本工具即表示您接受更新后的政策。
        </p>
        <p>
          建议您定期查看本页面以了解最新的隐私政策。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>11. 联系我们</h2>
        <p style={{ marginBottom: '15px' }}>
          如果您对本隐私政策有任何问题或建议，请通过以下方式联系我们：
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>GitHub Issues: 在项目仓库中提交问题</li>
          <li>邮箱: 通过GitHub个人资料联系</li>
        </ul>
      </section>

      <div style={{ 
        marginTop: '60px', 
        padding: '20px', 
        background: 'var(--surface)', 
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
          <strong>免责声明：</strong>
          本工具仅供参考，计算结果不构成官方承诺。实际积分以北京市小客车指标调控管理办公室公布的结果为准。
          使用本工具产生的任何后果由用户自行承担。
        </p>
      </div>
    </div>
  );
}