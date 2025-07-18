import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      glassmorphism: {
        background: string;
        border: string;
        backdrop: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      glassmorphism?: {
        background?: string;
        border?: string;
        backdrop?: string;
      };
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e40af 100%)',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.8)',
    },
    error: {
      main: '#ff6b6b',
      light: '#ff8a8a',
      dark: '#e74c3c',
    },
    warning: {
      main: '#feca57',
      light: '#fed36b',
      dark: '#f39c12',
    },
    info: {
      main: '#4ecdc4',
      light: '#6bccc4',
      dark: '#26a69a',
    },
    success: {
      main: '#2ecc71',
      light: '#58d68d',
      dark: '#27ae60',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: 'rgba(255, 255, 255, 0.95)',
    },
    body1: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 400,
    },
    body2: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 12,
  },
  custom: {
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdrop: 'blur(20px)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e40af 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        },
        contained: {
          background: 'rgba(59, 130, 246, 0.8)',
          border: '1px solid rgba(59, 130, 246, 0.6)',
          '&:hover': {
            background: 'rgba(59, 130, 246, 0.9)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
          },
        },
        outlined: {
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'rgba(255, 255, 255, 0.95)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(59, 130, 246, 0.8)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.8)',
            '&.Mui-focused': {
              color: 'rgba(59, 130, 246, 0.9)',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: 'rgba(255, 255, 255, 0.95)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(59, 130, 246, 0.8)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'rgba(255, 255, 255, 0.95)',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});