"use client";

import { useMemo } from 'react';
import { Member, ScoreDetail, CalculationResult } from '../types';

const nowYear = new Date().getFullYear();

// 计算当前时段
function getCurrentHalf(): "first" | "second" {
  const now = new Date();
  const month = now.getMonth() + 1;
  return month <= 6 ? "first" : "second";
}

// 计算摇号次数
function calcRoundsByYearAndHalf(
  startYear: number | null,
  startHalf: "first" | "second",
  currentYear: number
): number {
  if (!startYear || startYear > currentYear) return 0;
  
  let rounds = 0;
  for (let year = startYear; year <= currentYear; year++) {
    if (year === startYear) {
      if (startHalf === "first") {
        rounds += 2; // 6月和12月
      } else {
        rounds += 1; // 只有12月
      }
    } else if (year === currentYear) {
      const currentHalf = getCurrentHalf();
      if (currentHalf === "first") {
        rounds += 0; // 当前年份上半年，还没有摇号
      } else {
        rounds += 1; // 当前年份下半年，已经有6月的摇号
      }
    } else {
      rounds += 2; // 完整年份，6月和12月
    }
  }
  return rounds;
}

// 2020年前阶梯分计算
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
  return 13;
}

// 2021年后阶梯分计算
function calcStepAfter2021(rounds: number): number {
  if (rounds === 0) return 0;
  return Math.ceil(rounds / 2);
}

// 计算总阶梯分
function calcTotalStepByYearAndHalf(
  startYear: number | null,
  startHalf: "first" | "second",
  currentYear: number
): {
  totalRounds: number;
  pre2021Rounds: number;
  post2021Rounds: number;
  pre2021Step: number;
  post2021Step: number;
  totalStep: number;
} {
  if (!startYear || startYear > currentYear) {
    return {
      totalRounds: 0,
      pre2021Rounds: 0,
      post2021Rounds: 0,
      pre2021Step: 0,
      post2021Step: 0,
      totalStep: 0,
    };
  }

  // 2020年前的次数
  const pre2021Rounds = startYear <= 2020 
    ? calcRoundsByYearAndHalf(startYear, startHalf, 2020)
    : 0;

  // 2021年后的次数
  const post2021StartYear = Math.max(startYear, 2021);
  const post2021Rounds = post2021StartYear <= currentYear
    ? calcRoundsByYearAndHalf(post2021StartYear, startYear <= 2020 ? "first" : startHalf, currentYear)
    : 0;

  const pre2021Step = calcStepBefore2021(pre2021Rounds);
  const post2021Step = calcStepAfter2021(post2021Rounds);

  return {
    totalRounds: pre2021Rounds + post2021Rounds,
    pre2021Rounds,
    post2021Rounds,
    pre2021Step,
    post2021Step,
    totalStep: pre2021Step + post2021Step,
  };
}

// 计算新能源轮候年限
function calcQueueYears(startYear: number | null, currentYear: number): number {
  if (!startYear || startYear > currentYear) return 0;
  return currentYear - startYear;
}

export function useScoreCalculation(
  members: Member[],
  familyApplyStartYear: number | null
) {
  return useMemo(() => {
    // 计算家庭申请年限
    const familyApplyYears = familyApplyStartYear && familyApplyStartYear <= nowYear
      ? nowYear - familyApplyStartYear
      : 0;

    // 自动判断是否包含配偶
    const includeSpouse = members.some(m => m.role === "spouse");

    const main = members.find(m => m.role === "main");
    const spouse = members.find(m => m.role === "spouse");

    if (!main) {
      return { 
        ok: false, 
        message: "至少需要1位主申请人", 
        total: 0, 
        detail: [],
        includeSpouse,
        generations: 1
      };
    }

    if (includeSpouse && !spouse) {
      return { 
        ok: false, 
        message: "请添加配偶成员", 
        total: 0, 
        detail: [],
        includeSpouse,
        generations: 1
      };
    }

    const detail: ScoreDetail[] = members.map(m => {
      // 基础分
      const base = m.role === "main" ? 2 : 1;
      
      // 判断成员在当前年份是否已经开始参与
      const ordinaryStarted = m.ordinaryStartYear && m.ordinaryStartYear <= nowYear;
      const queueStarted = m.queueStartYear && m.queueStartYear <= nowYear;
      const memberStarted = ordinaryStarted || queueStarted;
      
      // 计算普通摇号阶梯分
      const ordinaryData = calcTotalStepByYearAndHalf(m.ordinaryStartYear, m.ordinaryStartHalf, nowYear);
      
      // C5额外加分
      const c5Extra = m.role === "main" && m.hasC5 && ordinaryData.totalRounds > 0 ? 1 : 0;
      
      // 计算新能源轮候年限
      const queueYears = calcQueueYears(m.queueStartYear, nowYear);
      const queueStep = queueYears;
      
      // 阶梯（轮候）积分
      const stageTotal = ordinaryData.totalStep + c5Extra + queueStep;
      
      // 家庭申请年限分
      const memberFamilyYears = memberStarted ? familyApplyYears : 0;
      
      // 个人积分
      const point = memberStarted ? (base + stageTotal + memberFamilyYears) : 0;

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
        familyYears: memberFamilyYears,
        point,
      };
    });

    // 过滤出已经开始参与的成员
    const activeMembers = detail.filter(d => d.point > 0);
    
    // 根据已开始参与的成员动态计算代际数
    const activeMemberNames = activeMembers.map(d => d.name.toLowerCase());
    const hasParent = activeMemberNames.some(r => r.includes('父') || r.includes('母') || r.includes('parent'));
    const hasChild = activeMemberNames.some(r => r.includes('子') || r.includes('女') || r.includes('child') || r.includes('孩'));
    
    let activeGenerations = 1;
    if (hasParent && hasChild) {
      activeGenerations = 3;
    } else if (hasParent || hasChild) {
      activeGenerations = 2;
    }
    
    const mainPoint = activeMembers.find(d => d.role === "main")?.point ?? 0;
    const spousePoint = activeMembers.find(d => d.role === "spouse")?.point ?? 0;
    const othersPoint = activeMembers.filter(d => d.role === "other").reduce((sum, d) => sum + d.point, 0);

    const activeIncludeSpouse = activeMembers.some(d => d.role === "spouse");
    
    // 家庭总积分公式
    const total = activeIncludeSpouse
      ? ((mainPoint + spousePoint) * 2 + othersPoint) * activeGenerations
      : (mainPoint + othersPoint) * activeGenerations;

    return { 
      ok: true, 
      message: "", 
      total, 
      detail,
      includeSpouse: activeIncludeSpouse,
      generations: activeGenerations
    };
  }, [members, familyApplyStartYear]);
}