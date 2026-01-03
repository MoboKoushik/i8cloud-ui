/**
 * Mantine Theme Configuration
 */

import { createTheme } from '@mantine/core';
import { primaryBlue, successGreen, warningYellow, errorRed } from './colors';

export const theme = createTheme({
  primaryColor: 'blue',

  colors: {
    blue: primaryBlue,
    green: successGreen,
    yellow: warningYellow,
    red: errorRed,
  },

  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier New, monospace',

  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.125rem', lineHeight: '1.2' },
      h2: { fontSize: '1.75rem', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', lineHeight: '1.5' },
      h5: { fontSize: '1.125rem', lineHeight: '1.5' },
      h6: { fontSize: '1rem', lineHeight: '1.5' },
    },
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },

  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },

  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    Table: {
      defaultProps: {
        striped: true,
        highlightOnHover: true,
      },
    },
    TextInput: {
      styles: {
        label: {
          textAlign: 'left',
          display: 'block',
        },
      },
    },
    PasswordInput: {
      styles: {
        label: {
          textAlign: 'left',
          display: 'block',
        },
      },
    },
    Textarea: {
      styles: {
        label: {
          textAlign: 'left',
          display: 'block',
        },
      },
    },
    Select: {
      styles: {
        label: {
          textAlign: 'left',
          display: 'block',
        },
      },
    },
  },
});
