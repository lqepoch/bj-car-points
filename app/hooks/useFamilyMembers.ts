"use client";

import { useState, useCallback } from 'react';
import { Member, MemberRole, Half } from '../types';

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

export function useFamilyMembers() {
  const [members, setMembers] = useState<Member[]>([
    createMember(1, "main", "主申请人"),
    createMember(2, "spouse", "配偶"),
  ]);

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