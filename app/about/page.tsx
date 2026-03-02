import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于我们 - 北京小客车家庭积分计算器",
  description: "了解北京小客车家庭积分计算器的开发背景、功能特点和使用说明。基于官方政策规则，为您提供准确的积分计算服务。",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
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

      <h1 style={{ marginBottom: '30px', color: 'var(--text)' }}>关于我们</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>项目简介</h2>
        <p style={{ marginBottom: '15px' }}>
          北京小客车家庭积分计算器是一个专业的在线工具，旨在帮助北京市民准确计算家庭申请小客车指标的积分。
          本工具严格按照北京市交通委员会发布的官方政策规则进行开发，确保计算结果的准确性和可靠性。
        </p>
        <p>
          我们致力于为用户提供简单易用、功能完善的积分计算服务，帮助大家更好地了解自己的申请资格和中签概率。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>功能特点</h2>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ 
            padding: '20px', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--brand)' }}>🎯 精确计算</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              基于2026年最新官方政策规则，支持普通摇号阶梯积分和新能源轮候积分的精确计算，
              自动处理复杂的积分规则和时间节点。
            </p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--brand)' }}>📊 详细明细</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              提供完整的积分计算明细，清晰展示每个家庭成员的基础分、阶梯分、轮候分和家庭年限分，
              让您了解每一分的来源。
            </p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--brand)' }}>🔮 未来预测</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              支持未来10年内的积分预测，帮助您规划申请策略，了解积分变化趋势，
              为长期申请做好准备。
            </p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--brand)' }}>💾 历史记录</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              支持保存和管理计算历史记录，方便对比不同时期的积分变化，
              数据安全存储在本地浏览器中。
            </p>
          </div>
          
          <div style={{ 
            padding: '20px', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--brand)' }}>🎨 用户友好</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              简洁直观的界面设计，支持深色/浅色主题切换，响应式布局适配各种设备，
              提供无障碍访问支持。
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>政策依据</h2>
        <p style={{ marginBottom: '15px' }}>
          本工具的计算规则完全基于北京市交通委员会发布的官方政策文件：
        </p>
        <div style={{ 
          padding: '20px', 
          background: 'var(--brand-light)', 
          borderRadius: '8px',
          border: '2px solid var(--brand)'
        }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--brand)' }}>主要政策文件</h4>
          <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
            <li>
              <a 
                href="https://xkczb.jtw.beijing.gov.cn/bszn/20201230/1609342087846_1.html" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--brand)', textDecoration: 'none' }}
              >
                北京市小客车数量调控暂行规定实施细则（2020年修订）
              </a>
            </li>
            <li>北京市小客车指标调控管理办公室相关公告</li>
            <li>历年摇号和配置政策调整文件</li>
          </ul>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            我们持续关注政策变化，及时更新计算规则，确保工具的准确性和时效性。
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>使用说明</h2>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--text)' }}>第一步：填写家庭成员信息</h3>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px', fontSize: '14px' }}>
            <li>添加所有参与申请的家庭成员</li>
            <li>选择每个成员的角色（主申请人、配偶、父母、子女等）</li>
            <li>填写摇号次数和新能源轮候开始时间</li>
            <li>选择家庭申请开始年份</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--text)' }}>第二步：查看计算结果</h3>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px', fontSize: '14px' }}>
            <li>系统自动计算家庭总积分</li>
            <li>查看详细的积分明细和计算过程</li>
            <li>了解未来积分变化趋势</li>
            <li>保存计算结果供后续参考</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>技术特点</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', color: 'var(--brand)' }}>前端技术</h4>
            <ul style={{ fontSize: '14px', paddingLeft: '20px' }}>
              <li>Next.js 14 + TypeScript</li>
              <li>React Hooks 状态管理</li>
              <li>响应式CSS设计</li>
              <li>PWA支持</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', color: 'var(--brand)' }}>部署方案</h4>
            <ul style={{ fontSize: '14px', paddingLeft: '20px' }}>
              <li>Cloudflare Pages托管</li>
              <li>静态站点生成</li>
              <li>全球CDN加速</li>
              <li>HTTPS安全传输</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>开源信息</h2>
        <p style={{ marginBottom: '15px' }}>
          本项目采用开源方式开发，欢迎社区贡献和反馈：
        </p>
        <div style={{ 
          padding: '20px', 
          background: 'var(--surface)', 
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--brand)' }}>参与方式</h4>
          <ul style={{ fontSize: '14px', paddingLeft: '20px' }}>
            <li>提交Bug报告和功能建议</li>
            <li>贡献代码和文档</li>
            <li>分享使用经验和反馈</li>
            <li>帮助推广和宣传</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>联系我们</h2>
        <p style={{ marginBottom: '15px' }}>
          如果您在使用过程中遇到问题，或有任何建议和反馈，欢迎通过以下方式联系我们：
        </p>
        <div style={{ 
          padding: '20px', 
          background: 'var(--brand-light)', 
          borderRadius: '8px',
          border: '2px solid var(--brand)'
        }}>
          <ul style={{ fontSize: '14px', paddingLeft: '20px', margin: 0 }}>
            <li>GitHub Issues: 提交问题和建议</li>
            <li>项目讨论: 参与社区讨论</li>
            <li>邮件联系: 通过GitHub个人资料联系</li>
          </ul>
        </div>
      </section>

      <div style={{ 
        marginTop: '60px', 
        padding: '30px', 
        background: 'var(--surface)', 
        borderRadius: '12px',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--brand)' }}>免责声明</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
          本工具仅供参考，计算结果不构成官方承诺。实际积分和申请结果以北京市小客车指标调控管理办公室
          公布的官方数据为准。使用本工具产生的任何后果由用户自行承担。
          <br /><br />
          我们建议用户在正式申请前，务必通过官方渠道核实相关政策和个人信息。
        </p>
      </div>
    </div>
  );
}