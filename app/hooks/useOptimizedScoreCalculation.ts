"use client";

import { useMemo } from 'react';
import { Member } from '../types';
import { useScoreCalculation } from './useScoreCalculation';

// 优化的积分计算hook，使用深度比较避免不必要的重计算
export function useOptimizedScoreCalculation(
  members: Member[],
  familyApplyStartYear: number | null
) {
  // 创建稳定的依赖项，只有实际内容变化时才重新计算
  const membersKey = useMemo(() => {
    return JSON.stringify(members.map(m => ({
      id: m.id,
      role: m.role,
      name: m.name,
      ordinaryStartYear: m.ordinaryStartYear,
      ordinaryStartHalf: m.ordinaryStartHalf,
      queueStartYear: m.queueStartYear,
      hasC5: m.hasC5
    })));
  }, [members]);

  const familyYearKey = useMemo(() => {
    return familyApplyStartYear;
  }, [familyApplyStartYear]);

  // 使用原始的计算hook，但依赖优化后的key
  return useMemo(() => {
    return useScoreCalculation(members, familyApplyStartYear);
  }, [membersKey, familyYearKey, members, familyApplyStartYear]);
}