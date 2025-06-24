import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LeaveFormPage from './pages/LeaveFormPage';
import LeaveHistoryPage from './pages/LeaveHistoryPage';
import AdminPanelPage from './pages/AdminPanelPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileUploadPage from './pages/ProfileUploadPage';
import ProfilePage from './pages/ProfilePage';
// import ProtectedAdminRoute from './ProtectedAdminRoute';
import MainLayout from './components/MainLayout'; // <-- new

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected routes inside layout */}
        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute allowedRoles={['driver', 'conductor']}>
              <MainLayout>
                <LeaveFormPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-history"
          element={
            <ProtectedRoute allowedRoles={['driver', 'conductor']}>
              <MainLayout>
                <LeaveHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminPanelPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/upload-profile" element={<ProfileUploadPage />} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
