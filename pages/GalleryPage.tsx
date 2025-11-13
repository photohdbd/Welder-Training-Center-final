
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const GalleryPage: React.FC = () => {
  const context = useContext(AppContext);
  const galleryItems = context?.galleryItems || [];

  if (!context) return null;
  const { lang, t } = context;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">{t('our_gallery')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.length > 0 ? (
            galleryItems.map(item => {
              const description = lang === 'bn' ? item.description_bn : item.description_en;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                  <div className="overflow-hidden h-64">
                      <img 
                          src={item.imageUrl} 
                          alt={description} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700">{description}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">{t('no_gallery')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
