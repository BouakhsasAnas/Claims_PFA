import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import NewClaim from './pages/user/NewClaim';
import MyClaims from './pages/user/MyClaims';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminStats from './pages/admin/Stats';
import ResponsableFiliereDashboard from './pages/responsable_filiere/ResponsableFiliereDashboard';
import ResponsableFiliereProfile from './pages/responsable_filiere/Profile';
import ResponsableSiteDashboard from './pages/responsable_site/ResponsableSiteDashboard';
import ResponsableSiteProfile from './pages/responsable_site/Profile';
import AuthService from './services/auth';

// Composant pour protéger les routes (simplifié)
const PrivateRoute = ({ children, roles }) => {
    const user = AuthService.getCurrentUser();

    console.log('PrivateRoute - User from localStorage:', user); // Debug
    console.log('PrivateRoute - Required roles:', roles); // Debug

    if (!user) {
        console.log('PrivateRoute - No user, redirecting to login'); // Debug
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.user.role)) {
        console.log('PrivateRoute - Role mismatch. User role:', user.user.role, 'Required:', roles); // Debug
        return <Navigate to="/login" />; // Changed from "/" to "/login" for debugging
    }

    console.log('PrivateRoute - Access granted'); // Debug
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* User Routes */}
                <Route path="/user/new-claim" element={
                    <PrivateRoute roles={['Etudiant']}>
                        <NewClaim />
                    </PrivateRoute>
                } />

                <Route path="/user/my-claims" element={
                    <PrivateRoute roles={['Etudiant']}>
                        <MyClaims />
                    </PrivateRoute>
                } />

                <Route path="/user/profile" element={
                    <PrivateRoute roles={['Etudiant']}>
                        <UserProfile />
                    </PrivateRoute>
                } />

                <Route path="/user" element={
                    <Navigate to="/user/my-claims" replace />
                } />

                <Route path="/admin" element={
                    <PrivateRoute roles={['Administrateur']}>
                        <AdminDashboard />
                    </PrivateRoute>
                } />

                <Route path="/admin/users" element={
                    <PrivateRoute roles={['Administrateur']}>
                        <UserManagement />
                    </PrivateRoute>
                } />

                <Route path="/admin/stats" element={
                    <PrivateRoute roles={['Administrateur', 'Etudiant', 'Responsable Filiere', 'Responsable Site']}>
                        <AdminStats />
                    </PrivateRoute>
                } />

                <Route path="/responsable-filiere" element={
                    <PrivateRoute roles={['Responsable Filiere']}>
                        <ResponsableFiliereDashboard />
                    </PrivateRoute>
                } />

                <Route path="/responsable-filiere/profile" element={
                    <PrivateRoute roles={['Responsable Filiere']}>
                        <ResponsableFiliereProfile />
                    </PrivateRoute>
                } />

                <Route path="/responsable-site" element={
                    <PrivateRoute roles={['Responsable Site']}>
                        <ResponsableSiteDashboard />
                    </PrivateRoute>
                } />

                <Route path="/responsable-site/profile" element={
                    <PrivateRoute roles={['Responsable Site']}>
                        <ResponsableSiteProfile />
                    </PrivateRoute>
                } />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
