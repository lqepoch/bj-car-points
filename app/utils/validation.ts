import { Member } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const currentYear = new Date().getFullYear();

// 验证单个成员
export function validateMember(member: Member): ValidationError[] {
  const errors: ValidationError[] = [];

  // 验证姓名
  if (!member.name.trim()) {
    errors.push({
      field: 'name',
      message: '请输入成员姓名'
    });
  }

  // 验证普通摇号开始年份
  if (member.ordinaryStartYear !== null) {
    if (member.ordinaryStartYear < 2011) {
      errors.push({
        field: 'ordinaryStartYear',
        message: '摇号最早从2011年开始'
      });
    }
    if (member.ordinaryStartYear > currentYear) {
      errors.push({
        field: 'ordinaryStartYear',
        message: '摇号开始年份不能超过当前年份'
      });
    }
  }

  // 验证新能源轮候开始年份
  if (member.queueStartYear !== null) {
    if (member.queueStartYear < 2014) {
      errors.push({
        field: 'queueStartYear',
        message: '新能源轮候最早从2014年开始'
      });
    }
    if (member.queueStartYear > currentYear) {
      errors.push({
        field: 'queueStartYear',
        message: '轮候开始年份不能超过当前年份'
      });
    }
  }

  // 验证逻辑一致性：如果同时参与普通摇号和新能源轮候
  if (member.ordinaryStartYear && member.queueStartYear) {
    if (member.queueStartYear < member.ordinaryStartYear) {
      errors.push({
        field: 'queueStartYear',
        message: '新能源轮候开始时间不应早于普通摇号开始时间'
      });
    }
  }

  // C5驾照只能是主申请人
  if (member.hasC5 && member.role !== 'main') {
    errors.push({
      field: 'hasC5',
      message: 'C5驾照加分仅适用于主申请人'
    });
  }

  return errors;
}

// 验证家庭申请开始年份
export function validateFamilyApplyYear(year: number | null): ValidationError[] {
  const errors: ValidationError[] = [];

  if (year !== null) {
    if (year < 2011) {
      errors.push({
        field: 'familyApplyStartYear',
        message: '家庭申请最早从2011年开始'
      });
    }
    if (year > currentYear) {
      errors.push({
        field: 'familyApplyStartYear',
        message: '家庭申请开始年份不能超过当前年份'
      });
    }
  }

  return errors;
}

// 验证家庭成员配置
export function validateFamilyStructure(members: Member[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // 必须有主申请人
  const mainMembers = members.filter(m => m.role === 'main');
  if (mainMembers.length === 0) {
    errors.push({
      field: 'family',
      message: '必须有一位主申请人'
    });
  } else if (mainMembers.length > 1) {
    errors.push({
      field: 'family',
      message: '只能有一位主申请人'
    });
  }

  // 最多一位配偶
  const spouseMembers = members.filter(m => m.role === 'spouse');
  if (spouseMembers.length > 1) {
    errors.push({
      field: 'family',
      message: '最多只能有一位配偶'
    });
  }

  // 检查是否有重复姓名
  const names = members.map(m => m.name.trim().toLowerCase()).filter(name => name);
  const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    errors.push({
      field: 'family',
      message: '成员姓名不能重复'
    });
  }

  return errors;
}

// 综合验证
export function validateAll(
  members: Member[], 
  familyApplyStartYear: number | null
): ValidationResult {
  const errors: ValidationError[] = [];

  // 验证家庭结构
  errors.push(...validateFamilyStructure(members));

  // 验证每个成员
  members.forEach((member, index) => {
    const memberErrors = validateMember(member);
    errors.push(...memberErrors.map(error => ({
      ...error,
      field: `member-${member.id}-${error.field}`
    })));
  });

  // 验证家庭申请年份
  errors.push(...validateFamilyApplyYear(familyApplyStartYear));

  // 验证家庭申请年份与成员开始年份的逻辑关系
  if (familyApplyStartYear) {
    members.forEach(member => {
      if (member.ordinaryStartYear && member.ordinaryStartYear < familyApplyStartYear) {
        errors.push({
          field: `member-${member.id}-ordinaryStartYear`,
          message: '个人摇号开始时间不应早于家庭申请开始时间'
        });
      }
      if (member.queueStartYear && member.queueStartYear < familyApplyStartYear) {
        errors.push({
          field: `member-${member.id}-queueStartYear`,
          message: '个人轮候开始时间不应早于家庭申请开始时间'
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 获取友好的错误提示
export function getErrorMessage(errors: ValidationError[], field: string): string | null {
  const error = errors.find(e => e.field === field);
  return error ? error.message : null;
}

// 检查特定字段是否有错误
export function hasError(errors: ValidationError[], field: string): boolean {
  return errors.some(e => e.field === field);
}

// 按字段分组错误
export function groupErrorsByField(errors: ValidationError[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  
  errors.forEach(error => {
    if (!grouped[error.field]) {
      grouped[error.field] = [];
    }
    grouped[error.field].push(error.message);
  });
  
  return grouped;
}