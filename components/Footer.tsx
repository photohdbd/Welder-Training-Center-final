
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Footer: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { t, siteSettings, lang } = context;
  
  const siteName = lang === 'bn' ? siteSettings.name_bn : siteSettings.name_en;
  const description = lang === 'bn' ? siteSettings.description_bn : siteSettings.description_en;
  const address = lang === 'bn' ? siteSettings.address_bn : siteSettings.address_en;

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white">{siteName}</h3>
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-white">{t('quick_links')}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><NavLink to="/" className="text-gray-400 hover:text-white transition-colors">{t('home')}</NavLink></li>
              <li><NavLink to="/courses" className="text-gray-400 hover:text-white transition-colors">{t('courses')}</NavLink></li>
              <li><NavLink to="/videos" className="text-gray-400 hover:text-white transition-colors">{t('videos')}</NavLink></li>
              <li><NavLink to="/notices" className="text-gray-400 hover:text-white transition-colors">{t('notices')}</NavLink></li>
              <li><NavLink to="/certificate-verification" className="text-gray-400 hover:text-white transition-colors">{t('certificate_verification')}</NavLink></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-white">{t('contact')}</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li className="flex items-center justify-center md:justify-start">
                  <span>{address}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                  <span>{siteSettings.phone}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                  <span>{siteSettings.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-2 sm:mb-0">{t('copyright')}</p>
          <Link to="/admin/login" className="text-sm text-gray-400 hover:text-white transition duration-300">
            {t('admin_login')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;