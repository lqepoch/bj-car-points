"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Member, MemberRole, Half, Theme } from '../types';

/**
 * 计算历史记录类型
 */
interface CalculationHistory {
  id: string;
  timestamp: number;
  members: Member[];
  familyApplyStartYear: number | null;
  familyApplyStartHalf: Half;
  totalScore: number;
  name?: string;
}

/**
 * 应用状态接口
 */
interface AppState {
  // 主题相关
  theme: Theme;
  
  // 成员相关
  members: Member[];
  
  // 家庭申请年份
  familyApplyStartYear: number | null;
  
  // 步骤相关
  currentStep: number;
  
  // 验证错误
  errors: Record<string, string[]>;
  
  // 计算历史
  calculationHistory: CalculationHistory[];
}

/**
 * 应用操作接口
 */
interface AppActions {
  // 主题操作
  setTheme: (theme: Theme) => void;
  
  // 成员操作
  updateMember: (id: number, patch: Partial<Member>) => void;
  addMember: (roleType: string) => void;
  removeMember: (id: number) => void;
  
  // 家庭申请年份操作
  setFamilyApplyStartYear: (year: number | null) => void;
  
  // 步骤操作
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // 验证操作
  setErrors: (errors: Record<string, string[]>) => void;
  setError: (key: string, errorMessages: string[]) => void;
  clearError: (key: string) => void;
  clearErrors: () => void;
  
  // 历史记录操作
  saveCalculation: (
    members: Member[],
    familyApplyStartYear: number | null,
    familyApplyStartHalf: Half,
    totalScore: number,
    name?: string
  ) => void;
  removeCalculation: (id: string) => void;
  clearHistory: () => void;
}

/**
 * 工具函数：创建新成员
 */
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

/**
 * 初始状态
 */
const initialState: AppState = {
  theme: "auto",
  members: [
    createMember(1, "main", "主申请人"),
    createMember(2, "spouse", "配偶"),
  ],
  familyApplyStartYear: null,
  currentStep: 1,
  errors: {},
  calculationHistory: [],
};

/**
 * 统一的应用状态管理 Store
 * 
 * 使用 Zustand 的 persist 中间件自动处理 localStorage 持久化
 * 存储键名保持与旧版本一致，确保数据平滑迁移
 */
export const useStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // 初始状态
      ...initialState,
      
      // 主题操作
      setTheme: (theme) => {
        set({ theme });
        
        // 更新 DOM 主题属性
        if (typeof window !== 'undefined') {
          const root = document.documentElement;
          if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
          } else {
            root.setAttribute('data-theme', theme);
          }
        }
      },
      
      // 成员操作
      updateMember: (id, patch) => {
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...patch } : m
          ),
        }));
      },
      
      addMember: (roleType) => {
        set((state) => {
          const nextId = Math.max(...state.members.map((m) => m.id)) + 1;
          
          // 计算同类型成员的数量，用于编号
          const sameTypeCount = state.members.filter((m) =>
            m.name.includes(roleType)
          ).length;
          const memberName = `${roleType}${sameTypeCount + 1}`;
          
          return {
            members: [...state.members, createMember(nextId, "other", memberName)],
          };
        });
      },
      
      removeMember: (id) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }));
      },
      
      // 家庭申请年份操作
      setFamilyApplyStartYear: (year) => {
        set({ familyApplyStartYear: year });
      },
      
      // 步骤操作
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      
      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(2, state.currentStep + 1),
        }));
      },
      
      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        }));
      },
      
      // 验证操作
      setErrors: (errors) => {
        set({ errors });
      },
      
      setError: (key, errorMessages) => {
        set((state) => ({
          errors: { ...state.errors, [key]: errorMessages },
        }));
      },
      
      clearError: (key) => {
        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[key];
          return { errors: newErrors };
        });
      },
      
      clearErrors: () => {
        set({ errors: {} });
      },
      
      // 历史记录操作
      saveCalculation: (members, familyApplyStartYear, familyApplyStartHalf, totalScore, name) => {
        const calculation: CalculationHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          members: JSON.parse(JSON.stringify(members)), // 深拷贝
          familyApplyStartYear,
          familyApplyStartHalf,
          totalScore,
          name: name || `计算记录 ${new Date().toLocaleString()}`,
        };
        
        set((state) => ({
          calculationHistory: [calculation, ...state.calculationHistory].slice(0, 10), // 最多保存10条
        }));
      },
      
      removeCalculation: (id) => {
        set((state) => ({
          calculationHistory: state.calculationHistory.filter((calc) => calc.id !== id),
        }));
      },
      
      clearHistory: () => {
        set({ calculationHistory: [] });
      },
    }),
    {
      name: 'bj-car-calculator-storage', // localStorage 键名，与旧版本保持一致
      storage: createJSONStorage(() => localStorage),
      
      // 部分持久化：不持久化 currentStep 和 errors（这些是临时状态）
      partialize: (state) => ({
        theme: state.theme,
        members: state.members,
        familyApplyStartYear: state.familyApplyStartYear,
        calculationHistory: state.calculationHistory,
      }),
    }
  )
);

/**
 * 初始化主题（在客户端组件中调用）
 */
export function initializeTheme() {
  if (typeof window !== 'undefined') {
    const theme = useStore.getState().theme;
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }
}
