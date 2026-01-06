/**
 * useAbility Hook - CASL Integration
 *
 * Provides CASL-based permission checking with CRUD actions
 */

import { useContext, useMemo } from 'react';
import { AbilityContext } from '../contexts/AbilityContext';
import type { Actions, Subjects } from '../config/ability';

export const useAbility = () => {
  const ability = useContext(AbilityContext);

  /**
   * Check if user can perform action on subject
   */
  const can = useMemo(
    () => (action: Actions, subject: Subjects) => {
      return ability.can(action, subject);
    },
    [ability]
  );

  /**
   * Check if user cannot perform action on subject
   */
  const cannot = useMemo(
    () => (action: Actions, subject: Subjects) => {
      return ability.cannot(action, subject);
    },
    [ability]
  );

  /**
   * CRUD convenience methods
   */
  const canCreate = useMemo(
    () => (subject: Subjects) => ability.can('create', subject),
    [ability]
  );

  const canRead = useMemo(
    () => (subject: Subjects) => ability.can('read', subject),
    [ability]
  );

  const canUpdate = useMemo(
    () => (subject: Subjects) => ability.can('update', subject),
    [ability]
  );

  const canDelete = useMemo(
    () => (subject: Subjects) => ability.can('delete', subject),
    [ability]
  );

  const canExport = useMemo(
    () => (subject: Subjects) => ability.can('read', subject),
    [ability]
  );

  const canManage = useMemo(
    () => (subject: Subjects) => ability.can('manage', subject),
    [ability]
  );

  return {
    ability,
    can,
    cannot,
    // CRUD helpers
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canExport,
    canManage,
  };
};
