"use client";

import { useMemo, useState } from "react";

type MemberRole = "main" | "spouse" | "other";
type MemberRelation = "self" | "spouse" | "parent" | "child" | "other";

type Member = {
  id: number;
  role: MemberRole;
  relation: MemberRelation;
  name: string;
  ordinaryRounds: number;
  queueYears: number;
  hasC5: boolean;
};

type HistoryPoint = {
  year: number;
  point: number | null;
};

const nowYear = new Date().getFullYear();

function relationLabel(relation: MemberRelation) {
  const map = {
    self: "本人",
    spouse: "配偶",
    parent: "父母",
    child: "子女",
    other: "其他",
  };
  return map[relation];
}

function roleLabel(role: MemberRole) {
  const map = {
    main: "主申请人",
    spouse: "配偶",
    other: "其他成员",
  };
  return map[role];
}

// 基础积分：主申请人2分，其他成员1分
function basePoint(role: MemberRole) {
  return role === "main" ? 2 : 1;
}

// 根据摇号次数计算阶梯分（官方规则）
function calcStepByRounds(rounds: number): number {
  if (rounds === 0) return 0;
  
  // 2021年1月1日后规则：1-6次=1分，7-12次=2分，13-18次=3分...
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
  
  // 超过78次，按每6次+1分外推
  return 13 + Math.floor((rounds - 78) / 6);
}

function createMember(id: number, relation: MemberRelation, role: MemberRole, name: string): Member {
  return {
    id,
    relation,
    role,
    name,
    ordinaryRounds: 0,
    queueYears: 0,
    hasC5: false,
  };
}

function createDefaultMembers() {
  return [
    createMember(1, "self", "main", "主申请人"),
    createMember(2, "spouse", "spouse", "配偶"),
  ];
}

function linearPredict(history: HistoryPoint[], nextYears: number[]) {
  const valid = history.filter((h) => h.point !== null) as Array<{ year: number; point: number }>;
  if (valid.length < 2) return nextYears.map((year) => ({ year, point: null as number | null }));

  const n = valid.length;
  const sumX = valid.reduce((s, v) => s + v.year, 0);
  const sumY = valid.reduce((s, v) => s + v.point, 0);
  const sumXY = valid.reduce((s, v) => s + v.year * v.point, 0);
  const sumX2 = valid.reduce((s, v) => s + v.year * v.year, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return nextYears.map((year) => ({ year, point: null as number | null }));

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return nextYears.map((year) => {
    const value = Math.round((intercept + slope * year) * 10) / 10;
    return { year, point: value < 0 ? 0 : value };
  });
}

export default function Home() {
  const [step, setStep] = useState(1);

  const [familyApplyYears, setFamilyApplyYears] = useState(0);
  const [generations, setGenerations] = useState(2);
  const [includeSpouse, setIncludeSpouse] = useState(true);
  const [members, setMembers] = useState<Member[]>(createDefaultMembers());

  const [historyPoints, setHistoryPoints] = useState<HistoryPoint[]>([
    { year: nowYear - 4, point: null },
    { year: nowYear - 3, point: null },
    { year: nowYear - 2, point: null },
    { year: nowYear - 1, point: null },
    { year: nowYear, point: null },
  ]);

  const visibleMembers = useMemo(
    () => members.filter((m) => includeSpouse || m.role !== "spouse"),
    [members, includeSpouse]
  );

  const result = useMemo(() => {
    const main = visibleMembers.find((m) => m.role === "main");
    const spouse = visibleMembers.find((m) => m.role === "spouse");

    if (!main) {
      return { ok: false, message: "至少需要 1 位主申请人。", total: 0, formulaText: "", detail: [] as any[] };
    }
    if (includeSpouse && !spouse) {
      return {
        ok: false,
        message: "你选择了包含配偶，但当前没有配偶成员。",
        total: 0,
        formulaText: "",
        detail: [] as any[],
      };
    }

    const detail = visibleMembers.map((m) => {
      const base = basePoint(m.role);
      
      // 阶梯分 = 普通摇号阶梯分 + 新能源轮候年限分
      const ordinaryStep = calcStepByRounds(m.ordinaryRounds);
      
      // 主申请人C5额外+1阶（仅当参与普通摇号时）
      const c5Extra = m.role === "main" && m.hasC5 && m.ordinaryRounds > 0 ? 1 : 0;
      
      const queueStep = m.queueYears;
      const stageStep = ordinaryStep + c5Extra + queueStep;
      
      // 个人积分 = 基础分 + 阶梯（轮候）分 + 家庭申请年限分
      const point = base + stageStep + familyApplyYears;

      return {
        id: m.id,
        name: m.name,
        role: m.role,
        relation: m.relation,
        base,
        ordinaryStep,
        c5Extra,
        queueStep,
        stageStep,
        familyYears: familyApplyYears,
        point,
      };
    });

    const mainPoint = detail.find((d) => d.role === "main")?.point ?? 0;
    const spousePoint = detail.find((d) => d.role === "spouse")?.point ?? 0;
    const othersPoint = detail
      .filter((d) => d.role === "other")
      .reduce((sum, d) => sum + d.point, 0);

    // 官方公式
    const total = includeSpouse
      ? ((mainPoint + spousePoint) * 2 + othersPoint) * generations
      : (mainPoint + othersPoint) * generations;

    const formulaText = includeSpouse
      ? `总积分 = [(${mainPoint} + ${spousePoint}) × 2 + ${othersPoint}] × ${generations} = ${total}`
      : `总积分 = (${mainPoint} + ${othersPoint}) × ${generations} = ${total}`;

    return { ok: true, message: "", total, formulaText, detail };
  }, [visibleMembers, includeSpouse, generations, familyApplyYears]);

  const prediction = useMemo(
    () =>
      linearPredict(
        historyPoints,
        [nowYear + 1, nowYear + 2, nowYear + 3, nowYear + 4, nowYear + 5]
      ),
    [historyPoints]
  );

  function updateMember(id: number, patch: Partial<Member>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function addMember(kind: "parent" | "child" | "other") {
    const nextId = members.length ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    if (kind === "parent") {
      setMembers((prev) => [...prev, createMember(nextId, "parent", "other", `父母${nextId}`)]);
      return;
    }
    if (kind === "child") {
      setMembers((prev) => [...prev, createMember(nextId, "child", "other", `子女${nextId}`)]);
      return;
    }
    setMembers((prev) => [...prev, createMember(nextId, "other", "other", `成员${nextId}`)]);
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function updateHistoryPoint(year: number, value: string) {
    setHistoryPoints((prev) =>
      prev.map((h) => (h.year === year ? { ...h, point: value === "" ? null : Number(value) } : h))
    );
  }

  return (
    <main className="container">
      <div className="hero card">
        <div>
          <h1>北京小客车家庭积分计算器</h1>
          <p className="muted">
            基于官方政策规则：个人积分 = 基础分 + 阶梯（轮候）分 + 家庭申请年限分。
            家庭总积分按是否含配偶套用不同公式，并乘以家庭代际数。
          </p>
        </div>
        <span className="badge">官方规则</span>
      </div>

      <section className="card stepper">
        <div className={`step ${step >= 1 ? "on" : ""}`}>1. 家庭基础参数</div>
        <div className={`step ${step >= 2 ? "on" : ""}`}>2. 成员信息录入</div>
        <div className={`step ${step >= 3 ? "on" : ""}`}>3. 积分结果</div>
        <div className={`step ${step >= 4 ? "on" : ""}`}>4. 未来预测</div>
      </section>

      <div className="workbench">
        <div className="workbench-main">
          {step === 1 && (
            <section className="card">
              <h2>① 家庭基础参数</h2>
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
                </label>

                <label>
                  家庭代际数
                  <select value={generations} onChange={(e) => setGenerations(Number(e.target.value))}>
                    <option value={1}>1 代</option>
                    <option value={2}>2 代</option>
                    <option value={3}>3 代</option>
                  </select>
                </label>

                <label>
                  是否包含配偶
                  <select
                    value={includeSpouse ? "yes" : "no"}
                    onChange={(e) => setIncludeSpouse(e.target.value === "yes")}
                  >
                    <option value="yes">包含</option>
                    <option value="no">不包含</option>
                  </select>
                </label>
              </div>

              <p className="muted small" style={{ marginTop: 12 }}>
                说明：家庭申请年限加分，每满一年所有家庭申请人积分各增加 1 分。
                家庭代际数指家庭申请人中包含几代人，最多为 3 代。
              </p>
            </section>
          )}

          {step === 2 && (
            <section className="card">
              <h2>② 成员信息录入</h2>
              <div className="actions">
                <button type="button" onClick={() => addMember("parent")}>+ 添加父母</button>
                <button type="button" onClick={() => addMember("child")}>+ 添加子女</button>
                <button type="button" onClick={() => addMember("other")}>+ 添加其他成员</button>
              </div>

              <div className="members">
                {visibleMembers.map((m) => (
                  <article className="member" key={m.id}>
                    <div className="member-head">
                      <div>
                        <strong>{m.name}</strong>
                        <p className="muted small">
                          {roleLabel(m.role)} · {relationLabel(m.relation)} · 基础分 {basePoint(m.role)}
                        </p>
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
                        普通摇号累计次数
                        <input
                          type="number"
                          min={0}
                          value={m.ordinaryRounds}
                          onChange={(e) => updateMember(m.id, { ordinaryRounds: Number(e.target.value) || 0 })}
                          placeholder="例如：24"
                        />
                      </label>

                      <label>
                        新能源轮候满年数
                        <input
                          type="number"
                          min={0}
                          value={m.queueYears}
                          onChange={(e) => updateMember(m.id, { queueYears: Number(e.target.value) || 0 })}
                          placeholder="例如：2"
                        />
                      </label>

                      {m.role === "main" && (
                        <label>
                          是否具备 C5 驾照
                          <select
                            value={m.hasC5 ? "yes" : "no"}
                            onChange={(e) => updateMember(m.id, { hasC5: e.target.value === "yes" })}
                          >
                            <option value="no">否</option>
                            <option value="yes">是（额外+1阶）</option>
                          </select>
                        </label>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <p className="muted small" style={{ marginTop: 12 }}>
                说明：普通摇号次数按 2021 年后规则映射阶梯分（1-6次=1分，7-12次=2分...）。
                主申请人具备 C5 驾照且参与普通摇号时，额外增加 1 个阶梯数。
              </p>
            </section>
          )}

          {step === 3 && (
            <section className="card result">
              <h2>③ 家庭积分结果</h2>
              {result.ok ? (
                <>
                  <p className="score">家庭总积分：{result.total}</p>
                  <p className="formula">{result.formulaText}</p>
                  
                  <h3>成员明细</h3>
                  <ul className="detail-list">
                    {result.detail.map((d) => (
                      <li key={d.id}>
                        <strong>{d.name}</strong>（{roleLabel(d.role)}）：
                        基础 {d.base} + 普通阶梯 {d.ordinaryStep}
                        {d.c5Extra > 0 && ` + C5加分 ${d.c5Extra}`}
                        {d.queueStep > 0 && ` + 新能源轮候 ${d.queueStep}`}
                        {d.familyYears > 0 && ` + 家庭申请 ${d.familyYears}`}
                        {" = "}<b>{d.point}</b> 分
                      </li>
                    ))}
                  </ul>

                  <p className="muted small" style={{ marginTop: 12 }}>
                    注：以上计算结果仅供参考，最终以当年政策公告和官方系统实时计算结果为准。
                  </p>
                </>
              ) : (
                <p className="warn">{result.message}</p>
              )}
            </section>
          )}

          {step === 4 && (
            <section className="card">
              <h2>④ 未来5年分数预测（趋势法）</h2>
              <p className="muted small">
                请录入近5年官方历史"入围分/最低分"，系统用线性趋势预测未来5年。
                这不是官方预测，仅用于辅助参考。
              </p>

              <div className="grid five">
                {historyPoints.map((h) => (
                  <label key={h.year}>
                    {h.year} 年历史分
                    <input
                      type="number"
                      min={0}
                      value={h.point ?? ""}
                      onChange={(e) => updateHistoryPoint(h.year, e.target.value)}
                      placeholder="例如 56"
                    />
                  </label>
                ))}
              </div>

              <h3>预测结果</h3>
              <ul className="detail-list">
                {prediction.map((p) => (
                  <li key={p.year}>
                    {p.year} 年预测分：{p.point === null ? "请先至少填2个历史分" : p.point}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="nav card">
            <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))}>
              上一步
            </button>
            <button type="button" onClick={() => setStep((s) => Math.min(4, s + 1))}>
              下一步
            </button>
          </section>
        </div>

        <aside className="card workbench-side">
          <h3>实时结果预览</h3>
          {result.ok ? (
            <>
              <p className="score-mini">总积分：{result.total}</p>
              <p className="formula">{result.formulaText}</p>
            </>
          ) : (
            <p className="warn">{result.message}</p>
          )}

          <h4>关键规则</h4>
          <ul className="detail-list">
            <li>主申请人基础分 2，其他成员基础分 1</li>
            <li>普通摇号按次数映射阶梯分（1-6次=1分，7-12次=2分...）</li>
            <li>新能源轮候按满年数计分（每满一年+1分）</li>
            <li>主申请人 C5 驾照（参与普通摇号时）额外+1阶</li>
            <li>家庭申请每满一年，所有成员各+1分</li>
            <li>含配偶：[(主+配偶)×2+其他]×代际数</li>
            <li>不含配偶：(主+其他)×代际数</li>
          </ul>
        </aside>
      </div>

      <section className="card">
        <h2>政策规则说明</h2>
        
        <div className="icon-cards">
          <article className="icon-card">
            <img src="/icons/score.svg" alt="个人积分图标" width={40} height={40} />
            <div>
              <h3>个人积分</h3>
              <p>个人积分 = 基础积分 + 阶梯（轮候）积分 + 家庭申请年限积分</p>
            </div>
          </article>

          <article className="icon-card">
            <img src="/icons/family.svg" alt="家庭积分图标" width={40} height={40} />
            <div>
              <h3>家庭总积分</h3>
              <p>含配偶与不含配偶使用不同公式，并统一乘家庭代际数（最多3代）</p>
            </div>
          </article>

          <article className="icon-card">
            <img src="/icons/formula.svg" alt="公式拆解图标" width={40} height={40} />
            <div>
              <h3>系统自动计算</h3>
              <p>不需手填分数，仅填次数与年限，系统自动换算并展示过程</p>
            </div>
          </article>
        </div>

        <h3>普通摇号阶梯分对照表（2021年后规则）</h3>
        <div className="table-wrap">
          <table className="policy-table">
            <thead>
              <tr>
                <th>累计参加次数</th>
                <th>对应阶梯分</th>
                <th>累计参加次数</th>
                <th>对应阶梯分</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0 次</td>
                <td>0 分</td>
                <td>37-42 次</td>
                <td>7 分</td>
              </tr>
              <tr>
                <td>1-6 次</td>
                <td>1 分</td>
                <td>43-48 次</td>
                <td>8 分</td>
              </tr>
              <tr>
                <td>7-12 次</td>
                <td>2 分</td>
                <td>49-54 次</td>
                <td>9 分</td>
              </tr>
              <tr>
                <td>13-18 次</td>
                <td>3 分</td>
                <td>55-60 次</td>
                <td>10 分</td>
              </tr>
              <tr>
                <td>19-24 次</td>
                <td>4 分</td>
                <td>61-66 次</td>
                <td>11 分</td>
              </tr>
              <tr>
                <td>25-30 次</td>
                <td>5 分</td>
                <td>67-72 次</td>
                <td>12 分</td>
              </tr>
              <tr>
                <td>31-36 次</td>
                <td>6 分</td>
                <td>73-78 次</td>
                <td>13 分</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>家庭总积分公式</h3>
        <ul>
          <li>含配偶：总积分 = [(主申请人积分 + 配偶积分) × 2 + 其他成员积分之和] × 家庭代际数</li>
          <li>不含配偶：总积分 = (主申请人积分 + 其他成员积分之和) × 家庭代际数</li>
        </ul>

        <h3>算例演示</h3>
        <div className="example-grid">
          <article className="example-card">
            <h4>示例A：夫妻 + 1名子女（2代）</h4>
            <p>主申请人=18分，配偶=16分，子女=12分，代际=2</p>
            <p className="formula">[(18 + 16) × 2 + 12] × 2 = 160</p>
            <p><b>家庭总积分：160</b></p>
          </article>

          <article className="example-card">
            <h4>示例B：三代同堂（含配偶）</h4>
            <p>主申请人=20分，配偶=19分，其他成员合计=78分，代际=3</p>
            <p className="formula">[(20 + 19) × 2 + 78] × 3 = 468</p>
            <p><b>家庭总积分：468</b></p>
          </article>

          <article className="example-card">
            <h4>示例C：不含配偶（主申请人+父母）</h4>
            <p>主申请人=17分，其他成员合计=24分，代际=2</p>
            <p className="formula">(17 + 24) × 2 = 82</p>
            <p><b>家庭总积分：82</b></p>
          </article>
        </div>

        <p className="muted small">
          说明：上述算例为演示口径，最终以当年政策公告和系统实时计算结果为准。
        </p>

        <h3>政策依据</h3>
        <ul>
          <li>
            官方办事指南：
            <a href="https://xkczb.jtw.beijing.gov.cn/bszn/20201230/1609342087846_1.html" target="_blank" rel="noreferrer">
              北京市小客车指标管理信息系统 - 申请小客车指标办事说明（家庭）
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
