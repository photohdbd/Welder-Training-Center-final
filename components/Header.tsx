import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!context) return null;
  const { siteSettings, lang, setLang, t } = context;

  const toggleLanguage = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  const linkClass = "px-4 py-3 text-[17px] text-gray-700 hover:text-blue-600 font-medium transition duration-300";
  const activeLinkClass = "font-bold text-blue-700 border-b-[3px] border-blue-600";
  
  const siteName = lang === 'bn' ? siteSettings.name_bn : siteSettings.name_en;

  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)} end>{t('home')}</NavLink>
      <NavLink to="/courses" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)}>{t('courses')}</NavLink>
      <NavLink to="/gallery" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)}>{t('gallery')}</NavLink>
      <NavLink to="/videos" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)}>{t('videos')}</NavLink>
      <NavLink to="/certificate-verification" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)}>{t('certificate_verification')}</NavLink>
      <NavLink to="/notices" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)}>{t('notices')}</NavLink>
      <NavLink to="/trainers" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`} onClick={() => setIsMenuOpen(false)}>{t('trainers')}</NavLink>
    </>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[96px]">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-3">
              <img className="h-20 w-auto" src={siteSettings.logoUrl} alt="Logo" />
              <span className="text-2xl font-bold text-gray-800">{siteName}</span>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <nav className="flex items-center space-x-1">{navLinks}</nav>
            <button onClick={toggleLanguage} className="ml-4 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">
              {t('language_switch')}
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-2 text-gray-700 hover:text-gray-900 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2 px-2">
          <nav className="flex flex-col space-y-1">
            {navLinks}
             <button onClick={toggleLanguage} className="mt-2 w-full px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">
              {t('language_switch')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;