
import React, { useContext, useState, ReactNode } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    if (!context) return null;
    const { t } = context;

    const handleLogout = () => {
        if (context) {
            context.logout();
            navigate('/admin/login');
        }
    };

    const linkClass = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-md transition-colors";
    const activeLinkClass = "bg-gray-900 font-semibold";

    const sidebarContent = (
      <>
        <div className="p-4">
            <h2 className="text-white text-2xl font-bold">{t('admin_panel')}</h2>
        </div>
        <nav className="mt-4 px-2 space-y-2 flex-grow">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('dashboard')}</NavLink>
            <NavLink to="/admin/settings" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('settings')}</NavLink>
            <NavLink to="/admin/slides" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('slides')}</NavLink>
            <NavLink to="/admin/courses" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('courses_manage')}</NavLink>
            <NavLink to="/admin/trainings" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('trainings_manage')}</NavLink>
            <NavLink to="/admin/gallery" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('gallery_manage')}</NavLink>
            <NavLink to="/admin/videos" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('videos_manage')}</NavLink>
            <NavLink to="/admin/notices" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('notices_manage')}</NavLink>
            <NavLink to="/admin/trainers" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('trainers_manage')}</NavLink>
            <NavLink to="/admin/students" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('students_certificates')}</NavLink>
            <NavLink to="/admin/upload-certificate" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('upload_certificate')}</NavLink>
        </nav>
        <div className="px-4 mb-4 space-y-2">
          <Link to="/" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {t('back_to_site')}
          </Link>
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              {t('logout')}
          </button>
        </div>
      </>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col`}>
                {sidebarContent}
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b lg:hidden">
                    <h1 className="text-xl font-semibold">{t('admin_panel')}</h1>
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
