"use client";

import { useState, useCallback, useEffect } from 'react';
import { Member, MemberRole, Half, Theme } from '../types';

interface CalculationHistory {
  id: string;
  timestamp: number;
  members: Member[];
  familyApplyStartYear: number | null;
  familyApplyStartHalf: Half;
  totalScore: number;
  name?: string;
}

function createMember(id: number, role: MemberRole, name: string): Member {
  return {
    id,
    role,
    name,
    ordinaryStartYear: null,
    ordinaryStartHalf: "first",
    queueStartYear: null,
    hasC5: false,
  };
}

// 本地存储工具函数
const STORAGE_KEY = 'bj-car-calculator-storage';

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 忽略存储错误
  }
}

// 主题管理 hook
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("auto");

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored?.theme) {
      setThemeState(stored.theme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    // 更新DOM
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', newTheme);
      }
      
      // 保存到本地存储
      const stored = loadFromStorage() || {};
      saveToStorage({ ...stored, theme: newTheme });
    }
  }, []);

  // 初始化主题
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return { theme, setTheme };
}

// 成员管理 hook
export function useFamilyMembers() {
  const [members, setMembers] = useState<Member[]>(() => {
    const stored = loadFromStorage();
    return stored?.members || [
      createMember(1, "main", "主申请人"),
      createMember(2, "spouse", "配偶"),
    ];
  });

  // 保存到本地存储
  useEffect(() => {
    const stored = loadFromStorage() || {};
    saveToStorage({ ...stored, members });
  }, [members]);

  const updateMember = useCallback((id: number, patch: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }, []);

  const addMember = useCallback((name: string) => {
    setMembers(prev => {
      const nextId = Math.max(...prev.map(m => m.id)) + 1;
      return [...prev, createMember(nextId, "other", name)];
    });
  }, []);

  const removeMember = useCallback((id: number) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  }, []);

  return {
    members,
    updateMember,
    addMember,
    removeMember
  };
}

// 家庭申请年份管理 hook
export function useFamilyApplyYear() {
  const [familyApplyStartYear, setFamilyApplyStartYearState] = useState<number | null>(() => {
    const stored = loadFromStorage();
    return stored?.familyApplyStartYear || null;
  });

  const [familyApplyStartHalf, setFamilyApplyStartHalfState] = useState<Half>(() => {
    const stored = loadFromStorage();
    return stored?.familyApplyStartHalf || "first";
  });

  const setFamilyApplyStartYear = useCallback((year: number | null) => {
    setFamilyApplyStartYearState(year);
    const stored = loadFromStorage() || {};
    saveToStorage({ ...stored, familyApplyStartYear: year });
  }, []);

  const setFamilyApplyStartHalf = useCallback((half: Half) => {
    setFamilyApplyStartHalfState(half);
    const stored = loadFromStorage() || {};
    saveToStorage({ ...stored, familyApplyStartHalf: half });
  }, []);

  return {
    familyApplyStartYear,
    setFamilyApplyStartYear,
    familyApplyStartHalf,
    setFamilyApplyStartHalf
  };
}

// 步骤管理 hook
export function useSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(2, prev + 1));
  }, []);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);
  
  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep
  };
}

// 验证管理 hook
export function useValidation() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((key: string, errorMessages: string[]) => {
    setErrors(prev => ({ ...prev, [key]: errorMessages }));
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  return {
    errors,
    setErrors,
    setError,
    clearError,
    clearErrors
  };
}

// 历史记录管理 hook
export function useCalculationHistory() {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>(() => {
    const stored = loadFromStorage();
    return stored?.calculationHistory || [];
  });

  // 保存到本地存储
  useEffect(() => {
    const stored = loadFromStorage() || {};
    saveToStorage({ ...stored, calculationHistory });
  }, [calculationHistory]);

  const saveCalculation = useCallback((
    members: Member[], 
    familyApplyStartYear: number | null,
    familyApplyStartHalf: Half,
    totalScore: number, 
    name?: string
  ) => {
    const calculation: CalculationHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      members: JSON.parse(JSON.stringify(members)), // 深拷贝
      familyApplyStartYear,
      familyApplyStartHalf,
      totalScore,
      name: name || `计算记录 ${new Date().toLocaleString()}`
    };
    
    setCalculationHistory(prev => [calculation, ...prev].slice(0, 10)); // 最多保存10条
  }, []);

  const removeCalculation = useCallback((id: string) => {
    setCalculationHistory(prev => prev.filter(calc => calc.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setCalculationHistory([]);
  }, []);

  return {
    calculationHistory,
    saveCalculation,
    removeCalculation,
    clearHistory
  };
}