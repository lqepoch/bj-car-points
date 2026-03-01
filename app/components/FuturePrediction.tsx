"use client";

import { Member } from '../types';

interface FuturePredictionProps {
  members: Member[];
  familyApplyStartYear: number | null;
  currentResult: any;
}

const nowYear = new Date().getFullYear();

// 复制计算函数（简化版）
function calcRoundsByYearAndHalf(startYear: number | null, startHalf: "first" | "second", currentYear: number): number {
  if (!startYear || startYear > currentYear) return 0;
  
  let rounds = 0;
  for (let year = startYear; year <= currentYear; year++) {
    if (year === startYear) {
      rounds += startHalf === "first" ? 2 : 1;
    } else if (year === currentYear) {
      const now = new Date();
      const month = now.getMonth() + 1;
      rounds += month <= 6 ? 0 : 1;
    } else {
      rounds += 2;
    }
  }
  return rounds;
}

function calcStepBefore2021(rounds: number): number {
  if (rounds === 0) return 0;
  if (rounds <= 6) return 1;
  if (rounds <= 12) return 2;
  if (rounds <= 18) return 3;
  if (rounds <= 24) return 4;
  if (rounds <= 30) return 5;
  if (rounds <= 36) return 6;
  if (rounds <= 42) return 7;
  if (rounds <= 48) return 8;
  if (rounds <= 54) return 9;
  if (rounds <= 60) return 10;
  if (rounds <= 66) return 11;
  if (rounds <= 72) return 12;
  if (rounds <= 78) return 13;
  return 13;
}

function calcStepAfter2021(rounds: number): number {
  return rounds === 0 ? 0 : Math.ceil(rounds / 2);
}

function calcQueueYears(startYear: number | null, currentYear: number): number {
  if (!startYear || startYear > currentYear) return 0;
  return currentYear - startYear;
}

export default function FuturePrediction({ members, familyApplyStartYear, currentResult }: FuturePredictionProps) {
  // 找到所有成员中最早的开始年份
  const allStartYears = members.flatMap(m => [m.ordinaryStartYear, m.queueStartYear].filter(y => y !== null)) as number[];
  const earliestStartYear = allStartYears.length > 0 ? Math.min(...allStartYears) : nowYear;
  const predictionStartYear = Math.max(earliestStartYear, nowYear);

  const predictions = [0, 1, 2, 3, 4, 5].map((yearOffset) => {
    const futureYear = predictionStartYear + yearOffset;
    const futureFamilyYears = familyApplyStartYear ? Math.max(0, futureYear - familyApplyStartYear) : 0;
    
    // 计算每个成员未来的积分
    const futureDetails = currentResult.detail.map((d: any) => {
      const member = members.find(m => m.id === d.id);
      if (!member) return { ...d, point: d.point };
      
      const ordinaryStarted = member.ordinaryStartYear && member.ordinaryStartYear <= futureYear;
      const queueStarted = member.queueStartYear && member.queueStartYear <= futureYear;
      const memberStarted = ordinaryStarted || queueStarted;
      
      if (!memberStarted) {
        return { ...d, point: 0 };
      }
      
      // 计算未来的普通摇号阶梯分
      let futureOrdinaryStep = 0;
      if (member.ordinaryStartYear) {
        const futureRounds = calcRoundsByYearAndHalf(member.ordinaryStartYear, member.ordinaryStartHalf, futureYear);
        const pre2021Rounds = member.ordinaryStartYear <= 2020 
          ? calcRoundsByYearAndHalf(member.ordinaryStartYear, member.ordinaryStartHalf, 2020)
          : 0;
        const post2021StartYear = Math.max(member.ordinaryStartYear, 2021);
        const post2021Rounds = post2021StartYear <= futureYear
          ? calcRoundsByYearAndHalf(post2021StartYear, member.ordinaryStartYear <= 2020 ? "first" : member.ordinaryStartHalf, futureYear)
          : 0;
        
        futureOrdinaryStep = calcStepBefore2021(pre2021Rounds) + calcStepAfter2021(post2021Rounds);
      }
      
      const futureQueueStep = member.queueStartYear ? calcQueueYears(member.queueStartYear, futureYear) : 0;
      const futureStageTotal = futureOrdinaryStep + d.c5Extra + futureQueueStep;
      const futurePoint = d.base + futureStageTotal + futureFamilyYears;
      
      return { ...d, point: futurePoint };
    });
    
    // 过滤出已经开始参与的成员
    const activeFutureDetails = futureDetails.filter((d: any) => d.point > 0);
    
    // 计算代际数
    const futureMemberNames = activeFutureDetails.map((d: any) => d.name.toLowerCase());
    const futureHasParent = futureMemberNames.some((name: string) => name.includes('父') || name.includes('母') || name.includes('parent'));
    const futureHasChild = futureMemberNames.some((name: string) => name.includes('子') || name.includes('女') || name.includes('child') || name.includes('孩'));
    
    let futureGenerations = 1;
    if (futureHasParent && futureHasChild) {
      futureGenerations = 3;
    } else if (futureHasParent || futureHasChild) {
      futureGenerations = 2;
    }
    
    // 计算未来的家庭总积分
    const futureMainPoint = activeFutureDetails.find((d: any) => d.role === "main")?.point ?? 0;
    const futureSpousePoint = activeFutureDetails.find((d: any) => d.role === "spouse")?.point ?? 0;
    const futureOthersPoint = activeFutureDetails.filter((d: any) => d.role === "other").reduce((sum: number, d: any) => sum + d.point, 0);
    
    const futureIncludeSpouse = activeFutureDetails.some((d: any) => d.role === "spouse");
    
    const futureTotal = futureIncludeSpouse
      ? ((futureMainPoint + futureSpousePoint) * 2 + futureOthersPoint) * futureGenerations
      : (futureMainPoint + futureOthersPoint) * futureGenerations;
    
    return {
      year: futureYear,
      familyYears: futureFamilyYears,
      details: futureDetails,
      total: futureTotal,
      isCurrentYear: yearOffset === 0 && futureYear === nowYear
    };
  });

  return (
    <div>
      <h3>📅 未来5年积分预测</h3>
      <div className="prediction-box">
        <p className="muted small" style={{ marginBottom: '16px' }}>
          基于当前规则，假设所有成员继续参与摇号/轮候，预测未来5年家庭总积分变化。
        </p>
        <table className="policy-table">
          <thead>
            <tr>
              <th>年份</th>
              <th>家庭申请年限</th>
              {currentResult.detail.map((d: any) => (
                <th key={d.id}>{d.name}</th>
              ))}
              <th>家庭总积分</th>
              <th>较上年增加</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => {
              const increase = index === 0 ? '-' : `+${prediction.total - predictions[index - 1].total}`;
              
              return (
                <tr key={index} style={{ background: prediction.isCurrentYear ? '#f0f9ff' : 'transparent' }}>
                  <td>{prediction.year}年{prediction.isCurrentYear ? '（当前）' : ''}</td>
                  <td>{prediction.familyYears}年</td>
                  {prediction.details.map((d: any) => (
                    <td key={d.id}>{d.point}分</td>
                  ))}
                  <td><strong>{prediction.total}分</strong></td>
                  <td>{increase}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: '12px', padding: '12px', background: '#fffbeb', borderRadius: '8px' }}>
          <p className="muted small" style={{ margin: 0 }}>
            <strong>增长说明：</strong>
            <br />• 参与普通摇号的成员：每年2次摇号 = +1阶梯分
            <br />• 参与新能源轮候的成员：每满1年 = +1轮候分
            <br />• 所有成员：家庭申请每满1年 = 各+1分
            <br />• 家庭总积分 = 个人积分之和 × 计算公式 × 代际数
          </p>
        </div>
      </div>
    </div>
  );
}