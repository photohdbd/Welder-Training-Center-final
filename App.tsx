
import React, { useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppContext } from './context/AppContext';

import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import HomePage from './pages/HomePage';
import CertificateVerificationPage from './pages/CertificateVerificationPage';
import NoticePage from './pages/NoticePage';
import TrainerPage from './pages/TrainerPage';
import CoursesPage from './pages/CoursesPage';
import GalleryPage from './pages/GalleryPage';
import VideoPage from './pages/VideoPage';


import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSlides from './pages/admin/AdminSlides';
import AdminNotices from './pages/admin/AdminNotices';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCourses from './pages/admin/AdminCourses';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTrainings from './pages/admin/AdminTrainings';
import AdminVideos from './pages/admin/AdminVideos';
import AdminUploadCertificate from './pages/admin/AdminUploadCertificate';

const PublicLayout: React.FC = () => (
    <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
    </div>
);

const ProtectedRoute: React.FC = () => {
    const context = useContext(AppContext);
    if (!context?.isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    );
};


const App: React.FC = () => {
    const context = useContext(AppContext);

    useEffect(() => {
        if (context?.lang) {
            document.documentElement.lang = context.lang;
            document.title = context.lang === 'bn' ? 'ওয়েল্ডার ট্রেনিং সেন্টার' : 'Welder Training Center';
        }
        
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('loader-hidden');
            }, 500);
        }

    }, [context?.lang]);
    
    useEffect(() => {
        if (context?.siteSettings.faviconUrl) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = context.siteSettings.faviconUrl;
        }
    }, [context?.siteSettings.faviconUrl]);


    return (
        <HashRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="certificate-verification" element={<CertificateVerificationPage />} />
                    <Route path="notices" element={<NoticePage />} />
                    <Route path="trainers" element={<TrainerPage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="videos" element={<VideoPage />} />
                </Route>
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="slides" element={<AdminSlides />} />
                    <Route path="notices" element={<AdminNotices />} />
                    <Route path="trainers" element={<AdminTrainers />} />
                    <Route path="students" element={<AdminStudents />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="trainings" element={<AdminTrainings />} />
                    <Route path="videos" element={<AdminVideos />} />
                    <Route path="upload-certificate" element={<AdminUploadCertificate />} />
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                </Route>

                 {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
};

export default App;
