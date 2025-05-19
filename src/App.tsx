import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import ProfilePage from './components/profilepage';
import MainPage from './components/mainpage';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BudgetWorkspace from './components/budgetworkspace';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/' element={<MainPage />} />
          <Route path='/budget/:id' element={<BudgetWorkspace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
