import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f2f5', // Светло-серый фон
      paper: '#ffffff', // Белый фон для карточек
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2d3748',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(to bottom, #f0f2f5, #e0e4e9)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '8px 20px',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #3f51b5, #6573c3)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&.register-link': {
            textDecoration: 'none',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
});
