"use client";

import { useMemo, useState } from "react";

type MemberRole = "main" | "spouse" | "other";
type Half = "first" | "second"; // 上半年/下半年

type Member = {
  id: number;
  role: MemberRole;
  name: string;
  ordinaryStartYear: number | null;
  ordinaryStartHalf: Half;
  queueStartYear: number | null;
  hasC5: boolean;
};

const nowYear = new Date().getFullYear();
const START_YEAR = 2011; // 北京摇号开始年份

// 获取当前是上半年还是下半年（基于摇号日期）
function getCurrentHalf(): Half {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  // 12月26日之后算完成了下半年摇号，否则只完成了上半年
  if (month === 12 && day >= 26) {
    return "second";
  } else if (month >= 6 && (month > 6 || day >= 26)) {
    // 6月26日之后到12月25日之间，算完成了上半年
    return "first";
  }
  // 6月26日之前，上一年的下半年都还没开始
  return "none" as any; // 表示当年还没有摇号
}

// 计算从开始年份+半年到当前已经参加的摇号次数
// 每年2次：6月26日（上半年）和12月26日（下半年）
function calcRoundsByYearAndHalf(
  startYear: number | null,
  startHalf: Half,
  currentYear: number
): number {
  if (!startYear || startYear > currentYear) return 0;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  let rounds = 0;
  
  for (let year = startYear; year <= currentYear; year++) {
    if (year === currentYear) {
      // 当前年份：根据实际日期判断
      if (currentMonth > 12 || (currentMonth === 12 && currentDay >= 26)) {
        // 12月26日之后，两次都完成了
        rounds += (year === startYear && startHalf === "second") ? 1 : 2;
      } else if (currentMonth > 6 || (currentMonth === 6 && currentDay >= 26)) {
        // 6月26日之后，只完成了上半年
        rounds += (year === startYear && startHalf === "second") ? 0 : 1;
      } else {
        // 6月26日之前，当年还没有摇号
        rounds += 0;
      }
    } else if (year === startYear) {
      // 开始年份（不是当前年）
      if (startHalf === "first") {
        rounds += 2; // 从上半年开始，当年参加2次
      } else {
        rounds += 1; // 从下半年开始，当年参加1次
      }
    } else {
      // 中间的完整年份，每年2次
      rounds += 2;
    }
  }
  
  return rounds;
}

// 2020年前规则：1-6次=1分，7-12次=2分...（每6次一档）
function calcStepBefore2021(rounds: number): number {
  if (rounds === 0) return 0;
  if (rounds >= 1 && rounds <= 6) return 1;
  if (rounds >= 7 && rounds <= 12) return 2;
  if (rounds >= 13 && rounds <= 18) return 3;
  if (rounds >= 19 && rounds <= 24) return 4;
  if (rounds >= 25 && rounds <= 30) return 5;
  if (rounds >= 31 && rounds <= 36) return 6;
  if (rounds >= 37 && rounds <= 42) return 7;
  if (rounds >= 43 && rounds <= 48) return 8;
  if (rounds >= 49 && rounds <= 54) return 9;
  if (rounds >= 55 && rounds <= 60) return 10;
  if (rounds >= 61 && rounds <= 66) return 11;
  if (rounds >= 67 && rounds <= 72) return 12;
  if (rounds >= 73 && rounds <= 78) return 13;
  return 13; // 超过78次按13分计算
}

// 2021年后规则：1-2次=1分，3-4次=2分，5-6次=3分...（每2次+1分，上不封顶）
function calcStepAfter2021(rounds: number): number {
  if (rounds === 0) return 0;
  // 每2次增加1分，向上取整
  return Math.ceil(rounds / 2);
}

// 根据开始年份和半年计算总阶梯分（分段计算）
function calcTotalStepByYearAndHalf(
  startYear: number | null,
  startHalf: Half,
  currentYear: number
): { 
  pre2021Rounds: number; 
  post2021Rounds: number; 
  pre2021Step: number; 
  post2021Step: number; 
  totalStep: number;
  totalRounds: number;
} {
  if (!startYear || startYear > currentYear) {
    return { pre2021Rounds: 0, post2021Rounds: 0, pre2021Step: 0, post2021Step: 0, totalStep: 0, totalRounds: 0 };
  }

  let pre2021Rounds = 0;
  let post2021Rounds = 0;

  if (startYear <= 2020) {
    // 2020年及之前开始
    pre2021Rounds = calcRoundsByYearAndHalf(startYear, startHalf, Math.min(2020, currentYear));
    if (currentYear >= 2021) {
      post2021Rounds = calcRoundsByYearAndHalf(2021, "first", currentYear);
    }
  } else {
    // 2021年及之后开始
    post2021Rounds = calcRoundsByYearAndHalf(startYear, startHalf, currentYear);
  }

  // 分别计算阶梯分
  const pre2021Step = calcStepBefore2021(pre2021Rounds);
  const post2021Step = calcStepAfter2021(post2021Rounds);

  return {
    pre2021Rounds,
    post2021Rounds,
    pre2021Step,
    post2021Step,
    totalStep: pre2021Step + post2021Step,
    totalRounds: pre2021Rounds + post2021Rounds
  };
}

// 根据开始年份计算轮候年限
function calcQueueYears(startYear: number | null, currentYear: number): number {
  if (!startYear || startYear > currentYear) return 0;
  return currentYear - startYear;
}

// 生成年份选项
function getYearOptions(): number[] {
  const years: number[] = [];
  for (let year = START_YEAR; year <= nowYear; year++) {
    years.push(year);
  }
  return years;
}

function createMember(id: number, role: MemberRole, name: string): Member {
  return { id, role, name, ordinaryStartYear: null, ordinaryStartHalf: "first", queueStartYear: null, hasC5: false };
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [familyApplyYears, setFamilyApplyYears] = useState(0);
  const [generations, setGenerations] = useState(2);
  const [includeSpouse, setIncludeSpouse] = useState(true);
  const [members, setMembers] = useState<Member[]>([
    createMember(1, "main", "主申请人"),
    createMember(2, "spouse", "配偶"),
  ]);

  const visibleMembers = useMemo(
    () => members.filter((m) => includeSpouse || m.role !== "spouse"),
    [members, includeSpouse]
  );

  const result = useMemo(() => {
    const main = visibleMembers.find((m) => m.role === "main");
    const spouse = visibleMembers.find((m) => m.role === "spouse");

    if (!main) {
      return { ok: false, message: "至少需要1位主申请人", total: 0, detail: [] };
    }
    if (includeSpouse && !spouse) {
      return { ok: false, message: "请添加配偶成员", total: 0, detail: [] };
    }

    const detail = visibleMembers.map((m) => {
      // 基础分
      const base = m.role === "main" ? 2 : 1;
      
      // 计算普通摇号阶梯分（分段计算）
      const ordinaryData = calcTotalStepByYearAndHalf(m.ordinaryStartYear, m.ordinaryStartHalf, nowYear);
      
      // C5额外加分（仅主申请人且参与普通摇号）
      const c5Extra = m.role === "main" && m.hasC5 && ordinaryData.totalRounds > 0 ? 1 : 0;
      
      // 计算新能源轮候年限
      const queueYears = calcQueueYears(m.queueStartYear, nowYear);
      
      // 新能源轮候分
      const queueStep = queueYears;
      
      // 阶梯（轮候）积分 = 普通阶梯 + C5加分 + 新能源轮候
      const stageTotal = ordinaryData.totalStep + c5Extra + queueStep;
      
      // 个人积分 = 基础分 + 阶梯（轮候）积分 + 家庭申请年限分
      const point = base + stageTotal + familyApplyYears;

      return {
        id: m.id,
        name: m.name,
        role: m.role,
        base,
        ordinaryRounds: ordinaryData.totalRounds,
        pre2021Rounds: ordinaryData.pre2021Rounds,
        post2021Rounds: ordinaryData.post2021Rounds,
        pre2021Step: ordinaryData.pre2021Step,
        post2021Step: ordinaryData.post2021Step,
        ordinaryStep: ordinaryData.totalStep,
        c5Extra,
        queueYears,
        queueStep,
        stageTotal,
        familyYears: familyApplyYears,
        point,
      };
    });

    const mainPoint = detail.find((d) => d.role === "main")?.point ?? 0;
    const spousePoint = detail.find((d) => d.role === "spouse")?.point ?? 0;
    const othersPoint = detail.filter((d) => d.role === "other").reduce((sum, d) => sum + d.point, 0);

    // 家庭总积分公式
    const total = includeSpouse
      ? ((mainPoint + spousePoint) * 2 + othersPoint) * generations
      : (mainPoint + othersPoint) * generations;

    return { ok: true, message: "", total, detail };
  }, [visibleMembers, includeSpouse, generations, familyApplyYears]);

  function updateMember(id: number, patch: Partial<Member>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function addMember(name: string) {
    const nextId = Math.max(...members.map((m) => m.id)) + 1;
    setMembers((prev) => [...prev, createMember(nextId, "other", name)]);
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="container">
      {/* 头部 */}
      <div className="hero card">
        <div>
          <h1>北京小客车家庭积分计算器</h1>
          <p className="muted">
            基于官方政策规则自动计算家庭总积分，帮助您了解申请资格和中签概率
          </p>
        </div>
        <span className="badge">官方规则</span>
      </div>

      {/* 步骤指示器 */}
      <section className="card stepper">
        <div className={`step ${step >= 1 ? "on" : ""}`} onClick={() => setStep(1)}>
          <div className="step-num">1</div>
          <div className="step-text">家庭参数</div>
        </div>
        <div className={`step ${step >= 2 ? "on" : ""}`} onClick={() => setStep(2)}>
          <div className="step-num">2</div>
          <div className="step-text">成员信息</div>
        </div>
        <div className={`step ${step >= 3 ? "on" : ""}`} onClick={() => setStep(3)}>
          <div className="step-num">3</div>
          <div className="step-text">计算结果</div>
        </div>
      </section>

      <div className="workbench">
        <div className="workbench-main">
          {/* 步骤1：家庭参数 */}
          {step === 1 && (
            <section className="card">
              <h2>家庭基础参数</h2>
              <div className="grid three">
                <label>
                  家庭申请年限（满年）
                  <input
                    type="number"
                    min={0}
                    value={familyApplyYears}
                    onChange={(e) => setFamilyApplyYears(Number(e.target.value) || 0)}
                    placeholder="例如：3"
                  />
                  <span className="hint">每满一年，所有成员各+1分</span>
                </label>

                <label>
                  家庭代际数
                  <select value={generations} onChange={(e) => setGenerations(Number(e.target.value))}>
                    <option value={1}>1代</option>
                    <option value={2}>2代</option>
                    <option value={3}>3代（最多）</option>
                  </select>
                  <span className="hint">家庭中包含几代人</span>
                </label>

                <label>
                  是否包含配偶
                  <select
                    value={includeSpouse ? "yes" : "no"}
                    onChange={(e) => setIncludeSpouse(e.target.value === "yes")}
                  >
                    <option value="yes">包含配偶</option>
                    <option value="no">不包含配偶</option>
                  </select>
                  <span className="hint">影响总积分计算公式</span>
                </label>
              </div>
            </section>
          )}

          {/* 步骤2：成员信息 */}
          {step === 2 && (
            <section className="card">
              <h2>成员信息录入</h2>
              <div className="actions">
                <button type="button" onClick={() => addMember("父母")}>+ 添加父母</button>
                <button type="button" onClick={() => addMember("子女")}>+ 添加子女</button>
                <button type="button" onClick={() => addMember("其他成员")}>+ 添加其他</button>
              </div>

              <div className="members">
                {visibleMembers.map((m) => (
                  <article className="member" key={m.id}>
                    <div className="member-head">
                      <div>
                        <strong>{m.name}</strong>
                        <span className="role-badge">
                          {m.role === "main" ? "主申请人" : m.role === "spouse" ? "配偶" : "其他成员"}
                        </span>
                      </div>
                      {m.role !== "main" && (
                        <button className="danger" type="button" onClick={() => removeMember(m.id)}>
                          删除
                        </button>
                      )}
                    </div>

                    <div className="grid four">
                      <label>
                        成员称呼
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => updateMember(m.id, { name: e.target.value })}
                        />
                      </label>

                      <label>
                        普通摇号开始年份
                        <select
                          value={m.ordinaryStartYear ?? ""}
                          onChange={(e) => updateMember(m.id, { ordinaryStartYear: e.target.value ? Number(e.target.value) : null })}
                        >
                          <option value="">未参与</option>
                          {getYearOptions().map((year) => (
                            <option key={year} value={year}>
                              {year}年
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        开始参与时段
                        <select
                          value={m.ordinaryStartHalf}
                          onChange={(e) => updateMember(m.id, { ordinaryStartHalf: e.target.value as Half })}
                          disabled={!m.ordinaryStartYear}
                        >
                          <option value="first">上半年（6月）</option>
                          <option value="second">下半年（12月）</option>
                        </select>
                        <span className="hint">
                          {m.ordinaryStartYear && (() => {
                            const data = calcTotalStepByYearAndHalf(m.ordinaryStartYear, m.ordinaryStartHalf, nowYear);
                            return `累计${data.totalRounds}次（2020前${data.pre2021Rounds}次=${data.pre2021Step}分 + 2021后${data.post2021Rounds}次=${data.post2021Step}分）`;
                          })()}
                        </span>
                      </label>

                      <label>
                        新能源轮候开始年份
                        <select
                          value={m.queueStartYear ?? ""}
                          onChange={(e) => updateMember(m.id, { queueStartYear: e.target.value ? Number(e.target.value) : null })}
                        >
                          <option value="">未参与</option>
                          {getYearOptions().map((year) => (
                            <option key={year} value={year}>
                              {year}年
                            </option>
                          ))}
                        </select>
                        <span className="hint">
                          {m.queueStartYear && `轮候 ${calcQueueYears(m.queueStartYear, nowYear)} 年`}
                        </span>
                      </label>

                      {m.role === "main" && (
                        <label>
                          是否具备C5驾照
                          <select
                            value={m.hasC5 ? "yes" : "no"}
                            onChange={(e) => updateMember(m.id, { hasC5: e.target.value === "yes" })}
                          >
                            <option value="no">否</option>
                            <option value="yes">是</option>
                          </select>
                          <span className="hint">主申请人额外+1阶梯</span>
                        </label>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 步骤3：计算结果 */}
          {step === 3 && (
            <section className="card result">
              <h2>家庭积分计算结果</h2>
              {result.ok ? (
                <>
                  <div className="score-display">
                    <div className="score-label">家庭总积分</div>
                    <div className="score">{result.total}</div>
                    <div className="score-unit">分</div>
                  </div>

                  <div className="formula-box">
                    <h3>计算公式</h3>
                    {includeSpouse ? (
                      <p className="formula">
                        总积分 = [(主申请人 + 配偶) × 2 + 其他成员] × 代际数
                      </p>
                    ) : (
                      <p className="formula">
                        总积分 = (主申请人 + 其他成员) × 代际数
                      </p>
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
                    <p>本计算器仅供参考，最终积分以北京市小客车指标调控管理信息系统官方计算结果为准。</p>
                  </div>
                </>
              ) : (
                <p className="warn">{result.message}</p>
              )}
            </section>
          )}

          {/* 导航按钮 */}
          <section className="nav card">
            <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              ← 上一步
            </button>
            <button type="button" onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={step === 3}>
              下一步 →
            </button>
          </section>
        </div>

        {/* 侧边栏 */}
        <aside className="card workbench-side">
          <h3>实时预览</h3>
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

          <h4>政策要点</h4>
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
            rel="noreferrer"
            className="policy-link"
          >
            查看官方政策 →
          </a>
        </aside>
      </div>

      {/* 政策说明 */}
      <section className="card">
        <h2>政策规则说明</h2>
        
        <div className="rule-section">
          <h3>普通摇号阶梯分对照表</h3>
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
          <h3>计算示例</h3>
          <div className="example-grid">
            <div className="example-card">
              <h4>示例1：夫妻+子女（2代）</h4>
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
              <h4>示例2：不含配偶（2代）</h4>
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
    </main>
  );
}
