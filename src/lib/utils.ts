import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

export type Program = 'Preschool' | 'Kindergarten A' | 'Kindergarten B' | 'Lower Elementary' | 'Upper Elementary';

export const PROGRAMS: Program[] = ['Preschool', 'Kindergarten A', 'Kindergarten B', 'Lower Elementary', 'Upper Elementary'];

export function programFromAge(age: number): Program {
  if (age <= 4) return 'Preschool';
  if (age <= 5) return 'Kindergarten A';
  if (age <= 6) return 'Kindergarten B';
  if (age <= 9) return 'Lower Elementary';
  return 'Upper Elementary';
}

export function programFromDob(dob: string): Program {
  return programFromAge(calcAge(dob));
}
