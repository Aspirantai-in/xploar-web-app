import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Re-export all utility functions
export * from './constants';
export * from './crypto';
export * from './date';
export * from './dateUtils';
export * from './errorHandler';
export * from './format';
export * from './jwt';

export * from './scoreCalculator';
export * from './storage';
export * from './storageUtils';
export * from './validation';