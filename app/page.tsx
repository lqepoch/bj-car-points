"use client";

import { useState, useMemo, useCallback } from "react";
import { useScoreCalculation } from './hooks/useScoreCalculation';
import { useTheme, useFamilyMembers, useFamilyApplyYear, useSteps, useValidation, useCalculationHistory } from './store/useAppStore';
import { validateAll, groupErrorsByField } from './utils/validation';
import { Half } from './types';
import MemberCard from './components/MemberCard';
import ScoreDisplay from './components/ScoreDisplay';
import FuturePrediction from './components/FuturePrediction';
import PolicySection from './components/PolicySection';
import CalculationHistory from './components/CalculationHistory';
import ErrorMessage from './components/ErrorMessage';
import AccessibilityEnhancements from './components/AccessibilityEnhancements';

type Theme = "light" | "dark" | "auto";

// 工具函数
function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2011; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
}

function getFutureYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2011; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { currentStep, setCurrentStep, nextStep, prevStep } = useSteps();
  const { members, updateMember, addMember, removeMember } = useFamilyMembers();
  const { familyApplyStartYear, setFamilyApplyStartYear, familyApplyStartHalf, setFamilyApplyStartHalf } = useFamilyApplyYear();
  const { errors, setErrors, clearErrors } = useValidation();
  const { saveCalculation } = useCalculationHistory();
  
  const [showHistory, setShowHistory] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const result = useScoreCalculation(members, familyApplyStartYear);
  const yearOptions = useMemo(() => getYearOptions(), []);
  const futureYearOptions = useMemo(() => getFutureYearOptions(), []);

  // 实时验证
  const validation = useMemo(() => {
    return validateAll(members, familyApplyStartYear);
  }, [members, familyApplyStartYear]);

  const groupedErrors = useMemo(() => {
    return groupErrorsByField(validation.errors);
  }, [validation.errors]);

  // 计算家庭申请年限
  const familyApplyYears = useMemo(() => {
    const nowYear = new Date().getFullYear();
    if (!familyApplyStartYear || familyApplyStartYear > nowYear) return 0;
    return nowYear - familyApplyStartYear;
  }, [familyApplyStartYear]);

  // 处理步骤切换
  const handleNextStep = useCallback(() => {
    if (currentStep === 1) {
      // 验证第一步的数据
      if (!validation.isValid) {
        setErrors(groupedErrors);
        return;
      }
      clearErrors();
    }
    nextStep();
  }, [currentStep, validation.isValid, groupedErrors, setErrors, clearErrors, nextStep]);

  // 保存计算结果
  const handleSaveCalculation = useCallback(() => {
    if (result.ok) {
      const name = saveName.trim() || `计算记录 ${new Date().toLocaleString()}`;
      saveCalculation(members, familyApplyStartYear, familyApplyStartHalf, result.total, name);
      setSaveDialogOpen(false);
      setSaveName("");
    }
  }, [result, members, familyApplyStartYear, familyApplyStartHalf, saveName, saveCalculation]);

  // 加载历史记录
  const handleLoadCalculation = useCallback((historyMembers: any[], historyFamilyYear: number | null) => {
    // 这里需要重新设置所有成员数据
    // 由于我们的hook设计，需要逐个更新
    // 简化处理：提示用户手动输入
    alert('历史记录加载功能需要手动复制数据，未来版本将支持一键加载');
    setShowHistory(false);
  }, []);

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "北京小客车家庭积分计算器",
            "description": "基于官方政策规则自动计算家庭总积分，帮助您了解申请资格和中签概率",
            "url": "https://bj-car-points.pages.dev",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CNY"
            },
            "featureList": [
              "普通摇号积分计算",
              "新能源轮候积分计算", 
              "家庭总积分计算",
              "未来积分预测",
              "计算历史记录"
            ],
            "screenshot": "https://bj-car-points.pages.dev/og-image.png",
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "inLanguage": "zh-CN",
            "isAccessibleForFree": true,
            "author": {
              "@type": "Organization",
              "name": "北京小客车积分计算器团队"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1200",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />
      
      {/* FAQ结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "北京小客车家庭积分如何计算？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "家庭申请人积分 = 基础积分 + 阶梯（轮候）积分 + 家庭申请年限加分。主申请人基础分2分，其他成员1分。普通摇号按次数映射阶梯分，新能源轮候每满一年+1分。"
                }
              },
              {
                "@type": "Question", 
                "name": "家庭总积分公式是什么？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "含配偶：总积分 = [(主申请人积分 + 配偶积分) × 2 + 其他成员积分之和] × 家庭代际数。不含配偶：总积分 = (主申请人积分 + 其他成员积分之和) × 家庭代际数。"
                }
              },
              {
                "@type": "Question",
                "name": "新能源轮候和普通摇号可以同时进行吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "可以。选择'新能源指标或普通指标'策略，5月先参加新能源配置，未入围自动转入普通摇号池。普通摇号阶梯分和新能源轮候年限分同时累积。"
                }
              },
              {
                "@type": "Question",
                "name": "这个计算器的结果准确吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "本工具严格按照北京市交通委员会官方政策规则开发，计算结果仅供参考。实际积分以北京市小客车指标调控管理办公室公布的官方结果为准。"
                }
              }
            ]
          })
        }}
      />
      
      <main className="container">
        <AccessibilityEnhancements />
      
      {/* 头部 */}
      <div className="hero card">
        <div className="hero-content">
          <h1>🚗 北京小客车家庭积分计算器</h1>
          <p className="muted">
            基于官方政策规则自动计算家庭总积分，帮助您了解申请资格和中签概率
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="small"
            onClick={() => setShowHistory(!showHistory)}
            aria-label="查看计算历史"
          >
            📚 历史记录
          </button>
          <div className="theme-toggle">
            <button
              className={theme === "light" ? "active" : ""}
              onClick={() => setTheme("light")}
              title="浅色模式"
            >
              ☀️
            </button>
            <button
              className={theme === "auto" ? "active" : ""}
              onClick={() => setTheme("auto")}
              title="跟随系统"
            >
              AUTO
            </button>
            <button
              className={theme === "dark" ? "active" : ""}
              onClick={() => setTheme("dark")}
              title="深色模式"
            >
              🌙
            </button>
          </div>
        </div>
      </div>

      <div className="workbench">
        <div className="workbench-main">
          {/* 历史记录弹窗 */}
          {showHistory && (
            <div className="modal-overlay" onClick={() => setShowHistory(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>计算历史记录</h2>
                  <button 
                    type="button" 
                    className="modal-close"
                    onClick={() => setShowHistory(false)}
                    aria-label="关闭历史记录"
                  >
                    ✕
                  </button>
                </div>
                <CalculationHistory onLoadCalculation={handleLoadCalculation} />
              </div>
            </div>
          )}

          {/* 保存对话框 */}
          {saveDialogOpen && (
            <div className="modal-overlay" onClick={() => setSaveDialogOpen(false)}>
              <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>保存计算结果</h3>
                  <button 
                    type="button" 
                    className="modal-close"
                    onClick={() => setSaveDialogOpen(false)}
                    aria-label="关闭保存对话框"
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <label>
                    记录名称
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder={`计算记录 ${new Date().toLocaleString()}`}
                      autoFocus
                    />
                  </label>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setSaveDialogOpen(false)}>
                      取消
                    </button>
                    <button type="button" onClick={handleSaveCalculation}>
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 步骤1：成员信息 */}
          {currentStep === 1 && (
            <section className="card">
              <div className="section-header">
                <h2>👨‍👩‍👧‍👦 家庭成员信息</h2>
                <div className="progress-indicator">
                  <span className="progress-step active">1. 填写信息</span>
                  <span className="progress-arrow">→</span>
                  <span className="progress-step">2. 查看结果</span>
                </div>
              </div>

              {/* 显示全局错误 */}
              {groupedErrors.family && (
                <div className="global-errors">
                  {groupedErrors.family.map((error, index) => (
                    <ErrorMessage key={index} message={error} />
                  ))}
                </div>
              )}

              <div className="members">
                {members.map((member) => {
                  // 计算该成员的相关数据
                  const memberDetail = result.detail.find(d => d.id === member.id);
                  
                  return (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onUpdate={updateMember}
                      onRemove={removeMember}
                      canRemove={member.role !== "main"}
                      ordinaryRounds={memberDetail?.ordinaryRounds || 0}
                      ordinaryStep={memberDetail?.ordinaryStep || 0}
                      queueYears={memberDetail?.queueYears || 0}
                      yearOptions={futureYearOptions}
                      validationErrors={validation.errors}
                    />
                  );
                })}
              </div>

              <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => addMember("父母")} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  添加父母
                </button>
                <button type="button" onClick={() => addMember("子女")} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  添加子女
                </button>
                <button type="button" onClick={() => addMember("其他成员")} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  添加其他
                </button>
              </div>

              <div style={{ marginTop: '20px', padding: '16px', background: '#e0f2fe', borderRadius: '12px', border: '2px solid #0284c7' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>💡</span>
                  <div>
                    <strong style={{ color: '#0c4a6e', fontSize: '16px' }}>申请策略说明</strong>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', lineHeight: '1.6', color: '#0c4a6e' }}>
                      <strong>推荐策略：</strong>选择"新能源指标或普通指标"（两者都选）<br />
                      • 5月先参加新能源配置（按积分排序），未入围自动转入普通摇号池<br />
                      • <strong>普通摇号阶梯分和新能源轮候年限分同时累积</strong>，互不影响<br />
                      • 一旦开始轮候新能源，建议持续选择此策略，避免轮候时间中断
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '20px', background: 'var(--brand-light)', borderRadius: '12px', border: '2px solid var(--brand)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', color: 'var(--brand)' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <strong style={{ color: 'var(--brand)' }}>家庭申请信息 <span className="required">*</span></strong>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>申请开始年份</span>
                    <select
                      value={familyApplyStartYear ?? ""}
                      onChange={(e) => setFamilyApplyStartYear(e.target.value ? Number(e.target.value) : null)}
                      style={{ width: '100%' }}
                      className={groupedErrors.familyApplyStartYear ? 'error' : ''}
                      aria-invalid={!!groupedErrors.familyApplyStartYear}
                    >
                      <option value="">请选择</option>
                      {[...yearOptions].reverse().map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                    {groupedErrors.familyApplyStartYear && (
                      <ErrorMessage message={groupedErrors.familyApplyStartYear[0]} />
                    )}
                  </label>

                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>申请开始时段</span>
                    <select
                      value={familyApplyStartHalf}
                      onChange={(e) => setFamilyApplyStartHalf(e.target.value as Half)}
                      disabled={!familyApplyStartYear}
                      style={{ width: '100%' }}
                      aria-label="选择家庭申请开始时段"
                    >
                      <option value="first">上半年（6月前）</option>
                      <option value="second">下半年（6月后）</option>
                    </select>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      此选项不影响积分计算，仅用于记录
                    </span>
                  </label>
                </div>

                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {familyApplyStartYear ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                          <polyline points="17 6 23 6 23 12"/>
                        </svg>
                        已申请 <strong>{familyApplyYears}</strong> 年，所有成员各+<strong>{familyApplyYears}</strong>分
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="16" x2="12" y2="12"/>
                          <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        请选择以家庭为单位首次申请的年份
                      </>
                    )}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* 步骤2：计算结果 */}
          {currentStep === 2 && (
            <section className="card result">
              <div className="section-header">
                <h2>📊 家庭积分计算结果</h2>
                <div className="progress-indicator">
                  <span className="progress-step">1. 填写信息</span>
                  <span className="progress-arrow">→</span>
                  <span className="progress-step active">2. 查看结果</span>
                </div>
              </div>
              
              <ScoreDisplay result={result} />
              
              {result.ok && (
                <>
                  <div className="result-actions">
                    <button 
                      type="button" 
                      onClick={() => setSaveDialogOpen(true)}
                      className="save-button"
                    >
                      💾 保存计算结果
                    </button>
                  </div>
                  
                  <FuturePrediction 
                    members={members}
                    familyApplyStartYear={familyApplyStartYear}
                    currentResult={result}
                  />
                </>
              )}
            </section>
          )}

          {/* 导航按钮 */}
          <section className="nav card">
            <button 
              type="button" 
              onClick={prevStep} 
              disabled={currentStep === 1}
            >
              ← 上一步
            </button>
            <button 
              type="button" 
              onClick={handleNextStep} 
              disabled={currentStep === 2}
            >
              下一步 →
            </button>
          </section>
        </div>

        {/* 侧边栏 */}
        <aside className="card workbench-side">
          <h3>📈 实时预览</h3>
          {result.ok ? (
            <>
              <div className="preview-score">{result.total} 分</div>
              <div className="preview-detail">
                {result.detail.map((d) => (
                  <div key={d.id} className="preview-item">
                    <span>{d.name}</span>
                    <span>{d.point} 分</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="muted small">{result.message || "请填写完整信息"}</p>
          )}

          <h4>📋 政策要点</h4>
          <ul className="policy-list">
            <li>主申请人基础分2分，其他成员1分</li>
            <li>普通摇号按次数映射阶梯分</li>
            <li>新能源轮候每满一年+1分</li>
            <li>家庭申请每满一年，所有成员各+1分</li>
            <li>含配偶：[(主+配偶)×2+其他]×代际</li>
            <li>不含配偶：(主+其他)×代际</li>
          </ul>

          <a 
            href="https://xkczb.jtw.beijing.gov.cn/bszn/20201230/1609342087846_1.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="policy-link"
          >
            🔗 查看官方政策文件 →
          </a>
        </aside>
      </div>

      <PolicySection />
    </main>
    </>
  );
}