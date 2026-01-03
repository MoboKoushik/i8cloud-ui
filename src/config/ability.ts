/**
 * CASL Ability Configuration
 *
 * Defines CRUD permissions using @casl/ability
 * Works with new permission format: { uuid, subject, action }
 */

import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Permission } from '../types';

/**
 * Define actions for CASL
 */
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

/**
 * Subjects are dynamically defined from permissions
 * Common subjects: user, role, category, product, order, etc.
 */
export type Subjects = string | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

/**
 * Build CASL ability from user permissions
 * Permissions now have format: { uuid, subject, action }
 */
export const buildAbilityFor = (permissions: Permission[]): AppAbility => {
  const { can, build } = new AbilityBuilder(AppAbility);

  permissions.forEach((permission) => {
    // Directly use subject and action from permission
    can(permission.action as Actions, permission.subject);
  });

  return build();
};

/**
 * Default ability (no permissions)
 */
export const defaultAbility = new AppAbility([]);
