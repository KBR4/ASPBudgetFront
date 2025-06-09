import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { theme } from './theme';
import store from './store/store';

// Components
import Login from './components/login';
import Register from './components/register';
import ProfilePage from './components/profilepage';
import MainPage from './components/mainpage';
import BudgetWorkspace from './components/budgetworkspace';
import AuthProtected from './components/AuthProtected';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes (no auth required) */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Protected routes (require authentication) */}
            <Route element={<AuthProtected />}>
              <Route path='/' element={<MainPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/budget/:id' element={<BudgetWorkspace />} />
            </Route>

            {/* Optional: Redirect to login for unknown routes */}
            <Route path='*' element={<Navigate to='/login' replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
