/**
 * CASL Ability Context
 *
 * Provides CASL ability instance to the entire app
 */

import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility, defaultAbility } from '../config/ability';

export const AbilityContext = createContext<AppAbility>(defaultAbility);
export const Can = createContextualCan(AbilityContext.Consumer);
