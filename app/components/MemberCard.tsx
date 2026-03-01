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
          >
            删除
          </button>
        )}
      </div>

      <div className="grid four">
        <label>
          成员称呼 <span className="required">*</span>
          <input
            type="text"
            value={member.name}
            onChange={(e) => onUpdate(member.id, { name: e.target.value })}
            className={hasFieldError('name') ? 'error' : ''}
            aria-invalid={hasFieldError('name')}
            aria-describedby={hasFieldError('name') ? `error-${member.id}-name` : undefined}
          />
          <ErrorMessage 
            message={getFieldError('name')} 
            className="field-error"
          />
        </label>

        <label>
          普通摇号开始年份
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
          <span className="hint">
            {member.ordinaryStartYear && `累计${ordinaryRounds}次 = ${ordinaryStep}分`}
          </span>
          <ErrorMessage 
            message={getFieldError('ordinaryStartYear')} 
            className="field-error"
          />
        </label>

        <label>
          开始参与时段
          <select
            value={member.ordinaryStartHalf}
            onChange={(e) => onUpdate(member.id, { ordinaryStartHalf: e.target.value as Half })}
            disabled={!member.ordinaryStartYear}
            aria-label="选择开始参与普通摇号的时段"
          >
            <option value="first">上半年（6月）</option>
            <option value="second">下半年（12月）</option>
          </select>
          <span className="hint">
            {member.ordinaryStartYear ? `累计${ordinaryRounds}次 = ${ordinaryStep}分` : '请先选择开始年份'}
          </span>
        </label>

        <label>
          新能源轮候开始年份
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
          <span className="hint">
            {member.queueStartYear ? `轮候 ${queueYears} 年 = ${queueYears}分` : ''}
          </span>
          <ErrorMessage 
            message={getFieldError('queueStartYear')} 
            className="field-error"
          />
        </label>

        {member.role === "main" && (
          <label>
            是否具备C5驾照
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
            <span className="hint">主申请人额外+1阶梯（需参与普通摇号）</span>
            <ErrorMessage 
              message={getFieldError('hasC5')} 
              className="field-error"
            />
          </label>
        )}
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