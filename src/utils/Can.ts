/**
 * CASL Ability Context and Can Component
 *
 * Exports AbilityContext for use in module routing
 */

import { createContextualCan } from '@casl/react';
import { AbilityContext } from '../contexts/AbilityContext';

export { AbilityContext };
export const Can = createContextualCan(AbilityContext.Consumer);
