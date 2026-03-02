import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      color: 'var(--text)'
    }}>
      <h1 style={{ fontSize: '72px', margin: '0 0 20px 0', color: 'var(--brand)' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '0 0 20px 0' }}>页面未找到</h2>
      <p style={{ fontSize: '16px', margin: '0 0 30px 0', color: 'var(--text-muted)' }}>
        抱歉，您访问的页面不存在或已被移动。
      </p>
      <Link 
        href="/" 
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: 'var(--brand)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          transition: 'background-color 0.2s'
        }}
      >
        返回首页
      </Link>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: 'var(--text-muted)' }}>
        <p>常用链接：</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>
            积分计算器
          </Link>
          <Link href="/about" style={{ color: 'var(--brand)', textDecoration: 'none' }}>
            关于我们
          </Link>
          <Link href="/privacy" style={{ color: 'var(--brand)', textDecoration: 'none' }}>
            隐私政策
          </Link>
        </div>
      </div>
    </div>
  )
}