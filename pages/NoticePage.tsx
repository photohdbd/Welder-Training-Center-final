
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Notice } from '../types';

const NoticePage: React.FC = () => {
  const context = useContext(AppContext);
  const notices = context?.notices || [];
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  if (!context) return null;
  const { lang, t } = context;
  
  const title = lang === 'bn' ? selectedNotice?.title_bn : selectedNotice?.title_en;
  const content = lang === 'bn' ? selectedNotice?.content_bn : selectedNotice?.content_en;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">{t('all_notices')}</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {notices.length > 0 ? (
            notices.map(notice => {
              const title = lang === 'bn' ? notice.title_bn : notice.title_en;
              const dateLabel = lang === 'bn' ? 'প্রকাশিত' : 'Published';
              return (
                <div key={notice.id} 
                     className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                     onClick={() => setSelectedNotice(notice)}
                >
                  <div className="p-4">
                      <h2 className="text-xl font-semibold text-blue-700">{title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{dateLabel}: {notice.date}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">{t('no_notices')}</p>
          )}
        </div>
      </div>

      {selectedNotice && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative transform transition-transform duration-300 scale-95 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-sm text-gray-500 mb-4">
                {(lang === 'bn' ? 'প্রকাশিত' : 'Published')}: {selectedNotice.date}
            </p>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {content}
            </div>
            <button 
                onClick={() => setSelectedNotice(null)} 
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label={t('close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticePage;
