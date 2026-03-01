"use client";

import { CalculationResult } from '../types';

interface ScoreDisplayProps {
  result: CalculationResult;
}

export default function ScoreDisplay({ result }: ScoreDisplayProps) {
  if (!result.ok) {
    return <p className="warn">{result.message}</p>;
  }

  return (
    <>
      <div className="score-display">
        <div className="score-label">家庭总积分</div>
        <div className="score">{result.total}</div>
        <div className="score-unit">分</div>
      </div>

      <div className="formula-box">
        <h3>🧮 计算公式</h3>
        {result.includeSpouse ? (
          <div>
            <p className="formula" style={{ marginBottom: '8px' }}>
              总积分 = [(主申请人 + 配偶) × 2 + 其他成员之和] × 代际数
            </p>
            <p className="formula" style={{ fontSize: '14px', color: '#666' }}>
              = [({result.detail.find(d => d.role === "main")?.point || 0} + {result.detail.find(d => d.role === "spouse")?.point || 0}) × 2 + {result.detail.filter(d => d.role === "other").map(d => d.point).join(' + ') || '0'}] × {result.generations} = {result.total}分
            </p>
          </div>
        ) : (
          <div>
            <p className="formula" style={{ marginBottom: '8px' }}>
              总积分 = (主申请人 + 其他成员之和) × 代际数
            </p>
            <p className="formula" style={{ fontSize: '14px', color: '#666' }}>
              = ({result.detail.find(d => d.role === "main")?.point || 0} + {result.detail.filter(d => d.role === "other").map(d => d.point).join(' + ') || '0'}) × {result.generations} = {result.total}分
            </p>
          </div>
        )}
      </div>

      <h3>成员积分明细</h3>
      <div className="detail-cards">
        {result.detail.map((d) => (
          <div className="detail-card" key={d.id}>
            <div className="detail-header">
              <strong>{d.name}</strong>
              <span className="detail-point">{d.point} 分</span>
            </div>
            <div className="detail-breakdown">
              <div className="breakdown-item">
                <span>基础分</span>
                <span>{d.base}</span>
              </div>
              {d.ordinaryStep > 0 && (
                <>
                  <div className="breakdown-item">
                    <span>普通摇号阶梯（共{d.ordinaryRounds}次）</span>
                    <span>+{d.ordinaryStep}</span>
                  </div>
                  {d.pre2021Rounds > 0 && (
                    <div className="breakdown-item sub">
                      <span>└ 2020年前 {d.pre2021Rounds}次</span>
                      <span>{d.pre2021Step}分</span>
                    </div>
                  )}
                  {d.post2021Rounds > 0 && (
                    <div className="breakdown-item sub">
                      <span>└ 2021年后 {d.post2021Rounds}次</span>
                      <span>{d.post2021Step}分</span>
                    </div>
                  )}
                </>
              )}
              {d.c5Extra > 0 && (
                <div className="breakdown-item">
                  <span>C5驾照加分</span>
                  <span>+{d.c5Extra}</span>
                </div>
              )}
              {d.queueStep > 0 && (
                <div className="breakdown-item">
                  <span>新能源轮候（{d.queueYears}年）</span>
                  <span>+{d.queueStep}</span>
                </div>
              )}
              {d.familyYears > 0 && (
                <div className="breakdown-item">
                  <span>家庭申请年限</span>
                  <span>+{d.familyYears}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="disclaimer">
        <strong>⚠️ 免责声明</strong>
        <p>本计算器仅供参考，最终积分以北京市小客车指标调控管理信息系统官方计算结果为准。政策如有调整，请以官方最新公告为准。</p>
      </div>
    </>
  );
}