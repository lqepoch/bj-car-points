"use client";

import { useCalculationHistory } from '../store/useAppStore';

interface CalculationHistoryProps {
  onLoadCalculation?: (members: any[], familyApplyStartYear: number | null) => void;
}

export default function CalculationHistory({ onLoadCalculation }: CalculationHistoryProps) {
  const { calculationHistory, removeCalculation, clearHistory } = useCalculationHistory();

  if (calculationHistory.length === 0) {
    return (
      <div className="history-empty">
        <div className="empty-icon">📝</div>
        <p>暂无计算历史记录</p>
        <p className="muted small">完成计算后可保存记录</p>
      </div>
    );
  }

  return (
    <div className="calculation-history">
      <div className="history-header">
        <h3>📚 计算历史</h3>
        <button 
          type="button" 
          className="danger small"
          onClick={clearHistory}
          aria-label="清空所有历史记录"
        >
          清空全部
        </button>
      </div>

      <div className="history-list">
        {calculationHistory.map((record) => (
          <div key={record.id} className="history-item">
            <div className="history-item-header">
              <div className="history-info">
                <div className="history-name">{record.name}</div>
                <div className="history-date">
                  {new Date(record.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="history-score">{record.totalScore}分</div>
            </div>
            
            <div className="history-summary">
              <span className="summary-item">
                {record.members.length}名成员
              </span>
              {record.familyApplyStartYear && (
                <span className="summary-item">
                  {new Date().getFullYear() - record.familyApplyStartYear}年申请
                </span>
              )}
            </div>

            <div className="history-actions">
              {onLoadCalculation && (
                <button
                  type="button"
                  className="small"
                  onClick={() => onLoadCalculation(record.members, record.familyApplyStartYear)}
                  aria-label={`加载计算记录: ${record.name}`}
                >
                  📥 加载
                </button>
              )}
              <button
                type="button"
                className="danger small"
                onClick={() => removeCalculation(record.id)}
                aria-label={`删除计算记录: ${record.name}`}
              >
                🗑️ 删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}