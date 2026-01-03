/**
 * Module Service
 *
 * Handles module retrieval and management
 * Modules define the navigation structure and available features
 */

import modulesData from '../../data/modules.json';
import { Module, ServiceResponse } from '../../types';

/**
 * Simulates API latency
 */
const simulateApiLatency = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Get all modules
 */
export const getAllModules = async (): Promise<ServiceResponse<Module[]>> => {
  await simulateApiLatency();

  try {
    return {
      success: true,
      data: modulesData.modules as Module[],
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_MODULES_ERROR',
        message: 'Failed to fetch modules',
        details: error,
      },
    };
  }
};

/**
 * Get active modules only
 */
export const getActiveModules = async (): Promise<ServiceResponse<Module[]>> => {
  await simulateApiLatency();

  try {
    const activeModules = modulesData.modules.filter((m) => m.isActive) as Module[];

    return {
      success: true,
      data: activeModules,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_ACTIVE_MODULES_ERROR',
        message: 'Failed to fetch active modules',
        details: error,
      },
    };
  }
};

/**
 * Get module by key
 */
export const getModuleByKey = async (key: string): Promise<ServiceResponse<Module | null>> => {
  await simulateApiLatency();

  try {
    const module = (modulesData.modules.find((m) => m.key === key) as Module) || null;

    return {
      success: true,
      data: module,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_MODULE_ERROR',
        message: `Failed to fetch module: ${key}`,
        details: error,
      },
    };
  }
};

/**
 * Get modules by category
 */
export const getModulesByCategory = async (
  category: string
): Promise<ServiceResponse<Module[]>> => {
  await simulateApiLatency();

  try {
    const categoryModules = modulesData.modules.filter(
      (m) => m.category === category
    ) as Module[];

    return {
      success: true,
      data: categoryModules,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_CATEGORY_MODULES_ERROR',
        message: `Failed to fetch modules for category: ${category}`,
        details: error,
      },
    };
  }
};

/**
 * Get modules grouped by category
 */
export const getGroupedModules = async (): Promise<
  ServiceResponse<Record<string, Module[]>>
> => {
  await simulateApiLatency();

  try {
    const grouped = modulesData.modules.reduce((acc, module) => {
      const m = module as Module;
      if (!acc[m.category]) {
        acc[m.category] = [];
      }
      acc[m.category].push(m);
      return acc;
    }, {} as Record<string, Module[]>);

    // Sort modules within each category by order
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    return {
      success: true,
      data: grouped,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_GROUPED_MODULES_ERROR',
        message: 'Failed to fetch grouped modules',
        details: error,
      },
    };
  }
};

/**
 * Get all available categories
 */
export const getCategories = async (): Promise<ServiceResponse<string[]>> => {
  await simulateApiLatency();

  try {
    const categories = [...new Set(modulesData.modules.map((m) => m.category))];

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'GET_CATEGORIES_ERROR',
        message: 'Failed to fetch categories',
        details: error,
      },
    };
  }
};

/**
 * Search modules by name or description
 */
export const searchModules = async (query: string): Promise<ServiceResponse<Module[]>> => {
  await simulateApiLatency();

  try {
    const lowercaseQuery = query.toLowerCase();
    const results = modulesData.modules.filter(
      (m) =>
        m.name.toLowerCase().includes(lowercaseQuery) ||
        m.key.toLowerCase().includes(lowercaseQuery) ||
        m.description.toLowerCase().includes(lowercaseQuery)
    ) as Module[];

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SEARCH_MODULES_ERROR',
        message: 'Failed to search modules',
        details: error,
      },
    };
  }
};
