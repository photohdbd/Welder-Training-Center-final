
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const isOfferValid = (offerEndDate?: string) => {
    if (!offerEndDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only, not time
    const endDate = new Date(offerEndDate);
    return endDate >= today;
}

const CoursesPage: React.FC = () => {
  const context = useContext(AppContext);
  const courses = context?.courses || [];
  
  if (!context) return null;
  const { lang, t } = context;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">{t('all_courses')}</h1>
        <div className="max-w-4xl mx-auto space-y-8">
          {courses.length > 0 ? (
            courses.map(course => {
                const name = lang === 'bn' ? course.name_bn : course.name_en;
                const shortDescription = lang === 'bn' ? course.shortDescription_bn : course.shortDescription_en;
                const details = lang === 'bn' ? course.details_bn : course.details_en;
                const showOffer = course.offerPrice && isOfferValid(course.offerEndDate);
                return (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6 items-center">
                        <img src={course.imageUrl} alt={name} className="w-full md:w-1/3 h-56 object-cover rounded-md"/>
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-bold text-blue-800 mb-3">{name}</h2>
                            <p className="text-gray-700 font-semibold mb-4">{shortDescription}</p>
                            <div className="text-gray-600 whitespace-pre-wrap border-l-4 border-blue-200 pl-4">
                                {details}
                            </div>
                             <div className="mt-4 pt-4 border-t border-gray-200">
                                {showOffer ? (
                                    <div>
                                        <p className="text-xl text-gray-500">
                                            <span className="line-through">৳{course.price?.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</span>
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                           ৳{course.offerPrice?.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                                        </p>
                                         <p className="text-sm text-red-500 mt-1">
                                            {t('offer_ends')}: {new Date(course.offerEndDate!).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                                         </p>
                                    </div>
                                ) : course.price ? (
                                     <p className="text-3xl font-bold text-green-600">
                                        ৳{course.price.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                                     </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )
            })
          ) : (
            <p className="text-center text-gray-500">{t('no_courses')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
