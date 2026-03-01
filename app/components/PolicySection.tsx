"use client";

export default function PolicySection() {
  return (
    <section className="card">
      <h2>📖 政策规则说明</h2>
      
      <div className="rule-section">
        <h3>🔢 普通摇号阶梯分对照表</h3>
        <div className="table-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ textAlign: 'center', marginBottom: '12px' }}>2020年12月31日前规则</h4>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>累计次数</th>
                  <th>阶梯分</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>0次</td><td>0分</td></tr>
                <tr><td>1-6次</td><td>1分</td></tr>
                <tr><td>7-12次</td><td>2分</td></tr>
                <tr><td>13-18次</td><td>3分</td></tr>
                <tr><td>19-24次</td><td>4分</td></tr>
                <tr><td>25-30次</td><td>5分</td></tr>
                <tr><td>31-36次</td><td>6分</td></tr>
                <tr><td>37-42次</td><td>7分</td></tr>
                <tr><td>43-48次</td><td>8分</td></tr>
                <tr><td>49-54次</td><td>9分</td></tr>
                <tr><td>55-60次</td><td>10分</td></tr>
                <tr><td>61-66次</td><td>11分</td></tr>
                <tr><td>67-72次</td><td>12分</td></tr>
                <tr><td>73-78次</td><td>13分</td></tr>
              </tbody>
            </table>
            <p className="muted small" style={{ marginTop: 8 }}>
              截至2020年12月31日，共进行摇号78次
            </p>
          </div>
          <div>
            <h4 style={{ textAlign: 'center', marginBottom: '12px' }}>2021年1月1日后规则</h4>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>累计次数</th>
                  <th>阶梯分</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>0次</td><td>0分</td></tr>
                <tr><td>1-2次</td><td>1分</td></tr>
                <tr><td>3-4次</td><td>2分</td></tr>
                <tr><td>5-6次</td><td>3分</td></tr>
                <tr><td>7-8次</td><td>4分</td></tr>
                <tr><td>9-10次</td><td>5分</td></tr>
                <tr><td>11-12次</td><td>6分</td></tr>
                <tr><td>13-14次</td><td>7分</td></tr>
                <tr><td>15-16次</td><td>8分</td></tr>
                <tr><td>17-18次</td><td>9分</td></tr>
                <tr><td>19-20次</td><td>10分</td></tr>
                <tr><td>21-22次</td><td>11分</td></tr>
                <tr><td>23-24次</td><td>12分</td></tr>
                <tr><td>25次及以上</td><td>每2次+1分（上不封顶）</td></tr>
              </tbody>
            </table>
            <p className="muted small" style={{ marginTop: 8 }}>
              每2次摇号增加1分，持续累加
            </p>
          </div>
        </div>
        <p className="muted small" style={{ marginTop: 12 }}>
          说明：每年2次摇号（6月26日和12月26日）。例如2025年下半年到2026年3月1日，只参加了1次（2025年12月26日）。
        </p>
      </div>

      <div className="rule-section">
        <h3>💡 计算示例</h3>
        <div className="example-grid">
          <div className="example-card">
            <h4>示例1：夫妻+子女（2代）👨‍👩‍👧</h4>
            <p className="muted small">家庭申请3年</p>
            <ul className="example-list">
              <li>主申请人：2+4+3=9分（普通24次）</li>
              <li>配偶：1+3+3=7分（普通18次）</li>
              <li>子女：1+2+3=6分（轮候2年）</li>
            </ul>
            <p className="example-result">
              总积分 = [(9+7)×2+6]×2 = <strong>76分</strong>
            </p>
          </div>

          <div className="example-card">
            <h4>示例2：不含配偶（2代）👨‍👧</h4>
            <p className="muted small">家庭申请2年</p>
            <ul className="example-list">
              <li>主申请人：2+5+2=9分（普通30次）</li>
              <li>父母：1+3+2=6分（普通18次）</li>
            </ul>
            <p className="example-result">
              总积分 = (9+6)×2 = <strong>30分</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}