
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const TrainerPage: React.FC = () => {
  const context = useContext(AppContext);
  const trainers = context?.trainers || [];

  if (!context) return null;
  const { lang, t } = context;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">{t('our_trainers')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.length > 0 ? (
            trainers.map(trainer => {
              const name = lang === 'bn' ? trainer.name_bn : trainer.name_en;
              const expertise = lang === 'bn' ? trainer.expertise_bn : trainer.expertise_en;
              const address = lang === 'bn' ? trainer.address_bn : trainer.address_en;
              return (
                <div key={trainer.id} className="bg-white rounded-lg shadow-lg overflow-hidden text-center transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="pt-6">
                    <img src={trainer.imageUrl} alt={name} className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-gray-200"/>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                    <p className="text-blue-600 font-semibold mt-1">{expertise}</p>
                    <p className="text-gray-600 mt-4">{address}</p>
                    <p className="text-gray-600">{trainer.phone}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">{t('no_trainers')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerPage;
