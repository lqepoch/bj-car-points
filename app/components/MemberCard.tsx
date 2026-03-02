"use client";

import { Member, MemberRole, Half } from '../types';
import { validateMember, getErrorMessage, ValidationError } from '../utils/validation';
import ErrorMessage from './ErrorMessage';

interface MemberCardProps {
  member: Member;
  onUpdate: (id: number, patch: Partial<Member>) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
  ordinaryRounds: number;
  ordinaryStep: number;
  queueYears: number;
  yearOptions: number[];
  validationErrors?: ValidationError[];
}

export default function MemberCard({
  member,
  onUpdate,
  onRemove,
  canRemove,
  ordinaryRounds,
  ordinaryStep,
  queueYears,
  yearOptions,
  validationErrors = []
}: MemberCardProps) {
  
  const getFieldError = (field: string) => {
    return getErrorMessage(validationErrors, `member-${member.id}-${field}`);
  };

  const hasFieldError = (field: string) => {
    return validationErrors.some(e => e.field === `member-${member.id}-${field}`);
  };

  return (
    <article className="member">
      <div className="member-head">
        <div>
          <strong>{member.name}</strong>
          <span className="role-badge">
            {member.role === "main" ? "主申请人" : member.role === "spouse" ? "配偶" : "其他成员"}
          </span>
        </div>
        {canRemove && (
          <button 
            className="danger" 
            type="button" 
            onClick={() => onRemove(member.id)}
            aria-label={`删除成员 ${member.name}`}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            删除
          </button>
        )}
      </div>

      <div className="member-form-grid">
        <div className="form-row">
          <label className="form-field">
            <span className="field-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              普通摇号开始年份
            </span>
            <select
              value={member.ordinaryStartYear ?? ""}
              onChange={(e) => onUpdate(member.id, { 
                ordinaryStartYear: e.target.value ? Number(e.target.value) : null 
              })}
              className={hasFieldError('ordinaryStartYear') ? 'error' : ''}
              aria-invalid={hasFieldError('ordinaryStartYear')}
              aria-describedby={hasFieldError('ordinaryStartYear') ? `error-${member.id}-ordinaryStartYear` : undefined}
            >
              <option value="">未参与</option>
              {[...yearOptions].reverse().map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
            <span className="field-hint">
              {member.ordinaryStartYear && `累计${ordinaryRounds}次 = ${ordinaryStep}分`}
            </span>
            <ErrorMessage 
              message={getFieldError('ordinaryStartYear')} 
              className="field-error"
            />
          </label>

          <label className="form-field">
            <span className="field-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              开始参与时段
            </span>
            <select
              value={member.ordinaryStartHalf}
              onChange={(e) => onUpdate(member.id, { ordinaryStartHalf: e.target.value as Half })}
              disabled={!member.ordinaryStartYear}
              aria-label="选择开始参与普通摇号的时段"
            >
              <option value="first">上半年（6月）</option>
              <option value="second">下半年（12月）</option>
            </select>
            <span className="field-hint">
              {member.ordinaryStartYear ? `累计${ordinaryRounds}次 = ${ordinaryStep}分` : '请先选择开始年份'}
            </span>
          </label>
        </div>

        <div className="form-row">
          <label className="form-field">
            <span className="field-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
                <line x1="23" y1="13" x2="23" y2="11"/>
              </svg>
              新能源轮候开始年份
            </span>
            <select
              value={member.queueStartYear ?? ""}
              onChange={(e) => onUpdate(member.id, { 
                queueStartYear: e.target.value ? Number(e.target.value) : null 
              })}
              className={hasFieldError('queueStartYear') ? 'error' : ''}
              aria-invalid={hasFieldError('queueStartYear')}
              aria-describedby={hasFieldError('queueStartYear') ? `error-${member.id}-queueStartYear` : undefined}
            >
              <option value="">未参与</option>
              {[...yearOptions].reverse().map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
            <span className="field-hint">
              {member.queueStartYear ? `轮候 ${queueYears} 年 = ${queueYears}分` : ''}
            </span>
            <ErrorMessage 
              message={getFieldError('queueStartYear')} 
              className="field-error"
            />
          </label>

          {member.role === "main" && (
            <label className="form-field">
              <span className="field-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                是否具备C5驾照
              </span>
              <select
                value={member.hasC5 ? "yes" : "no"}
                onChange={(e) => onUpdate(member.id, { hasC5: e.target.value === "yes" })}
                className={hasFieldError('hasC5') ? 'error' : ''}
                aria-invalid={hasFieldError('hasC5')}
                aria-describedby={hasFieldError('hasC5') ? `error-${member.id}-hasC5` : undefined}
              >
                <option value="no">否</option>
                <option value="yes">是</option>
              </select>
              <span className="field-hint">主申请人额外+1阶梯（需参与普通摇号）</span>
              <ErrorMessage 
                message={getFieldError('hasC5')} 
                className="field-error"
              />
            </label>
          )}
        </div>
      </div>

      {/* 显示该成员的实时积分预览 */}
      {(member.ordinaryStartYear || member.queueStartYear) && (
        <div className="member-score-preview">
          <div className="score-preview-header">
            <span className="score-icon">📊</span>
            <span>实时积分预览</span>
          </div>
          <div className="score-breakdown">
            <div className="score-item">
              <span>基础分</span>
              <span>{member.role === "main" ? "2" : "1"}分</span>
            </div>
            {ordinaryStep > 0 && (
              <div className="score-item">
                <span>普通摇号阶梯分</span>
                <span>+{ordinaryStep}分</span>
              </div>
            )}
            {member.hasC5 && member.role === "main" && ordinaryRounds > 0 && (
              <div className="score-item">
                <span>C5驾照加分</span>
                <span>+1分</span>
              </div>
            )}
            {queueYears > 0 && (
              <div className="score-item">
                <span>新能源轮候分</span>
                <span>+{queueYears}分</span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}