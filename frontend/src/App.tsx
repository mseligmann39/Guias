import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import GuideDetailPage from './pages/GuideDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateGuidePage from './pages/CreateGuidePage';
import EditProfilePage from './pages/EditProfilePage';
import UserPublicProfile from './pages/UserPublicProfile';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
// (Importa las páginas de admin que acabas de crear)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminGameManagement from './pages/admin/AdminGameManagement';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminGuideManagement from './pages/admin/AdminGuideManagement';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminReportDetail from './pages/admin/AdminReportDetail';
/* Función principal de la aplicación.
Renderiza las rutas de la aplicación.
*/
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />
        <Route path="/guides/create" element={<CreateGuidePage />} />
        <Route path="/guides/edit/:guideId" element={<CreateGuidePage />} />
        <Route path="/guides/:guideId" element={<GuideDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/edit-profile' element={<EditProfilePage />} />
        <Route path="/profile/:userId" element={<UserPublicProfile />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/games" element={<AdminGameManagement />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/guides" element={<AdminGuideManagement />} />
          <Route path="/admin/reportes" element={<AdminReportsPage />} />
          <Route path="/admin/reportes/:id" element={<AdminReportDetail />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;