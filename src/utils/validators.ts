/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/**
 * Validation Utilities
 *
 * Reusable validation functions for forms and data
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
};

/**
 * Validate username format
 * Allows alphanumeric, dots, underscores, hyphens
 */
export const validateUsername = (username: string): ValidationResult => {
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;

  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 50) {
    return { valid: false, error: 'Username must be less than 50 characters' };
  }

  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, dots, underscores, and hyphens' };
  }

  return { valid: true };
};

/**
 * Validate password complexity
 * Requirements: 8+ chars, uppercase, lowercase, number, special char
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

/**
 * Validate role name
 */
export const validateRoleName = (name: string): ValidationResult => {
  if (!name) {
    return { valid: false, error: 'Role name is required' };
  }

  if (name.length < 3) {
    return { valid: false, error: 'Role name must be at least 3 characters' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Role name must be less than 100 characters' };
  }

  return { valid: true };
};

/**
 * Validate role key format
 * Lowercase alphanumeric with underscores
 */
export const validateRoleKey = (key: string): ValidationResult => {
  const roleKeyRegex = /^[a-z0-9_]+$/;

  if (!key) {
    return { valid: false, error: 'Role key is required' };
  }

  if (key.length < 3) {
    return { valid: false, error: 'Role key must be at least 3 characters' };
  }

  if (key.length > 50) {
    return { valid: false, error: 'Role key must be less than 50 characters' };
  }

  if (!roleKeyRegex.test(key)) {
    return { valid: false, error: 'Role key can only contain lowercase letters, numbers, and underscores' };
  }

  return { valid: true };
};

/**
 * Generate role key from role name
 */
export const generateRoleKeyFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Remove duplicate underscores
    .substring(0, 50); // Limit length
};

/**
 * Generate secure random password
 * Meets all password complexity requirements
 */
export const generateSecurePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}';

  // Ensure at least one of each required type
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill remaining characters (total 12 chars)
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }

  return { valid: true };
};

/**
 * Validate minimum length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult => {
  if (value.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  return { valid: true };
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  return { valid: true };
};

/**
 * Validate array not empty
 */
export const validateArrayNotEmpty = (
  array: any[],
  fieldName: string
): ValidationResult => {
  if (!array || array.length === 0) {
    return { valid: false, error: `${fieldName} must have at least one item` };
  }

  return { valid: true };
};

/**
 * Combine multiple validation results
 */
export const combineValidations = (...results: ValidationResult[]): ValidationResult => {
  const failed = results.find((r) => !r.valid);
  return failed || { valid: true };
};

/**
 * Validate module name for permission creation
 * Allows alphanumeric, spaces, hyphens, underscores
 */
export const validateModuleName = (name: string): ValidationResult => {
  if (!name) {
    return { valid: false, error: 'Module name is required' };
  }

  if (name.length < 3) {
    return { valid: false, error: 'Module name must be at least 3 characters' };
  }

  if (name.length > 50) {
    return { valid: false, error: 'Module name must be less than 50 characters' };
  }

  // Allow letters, numbers, spaces, hyphens, underscores
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return { valid: false, error: 'Module name can only contain letters, numbers, spaces, hyphens, and underscores' };
  }

  return { valid: true };
};
