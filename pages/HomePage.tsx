
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ImageSlider from '../components/ImageSlider';

// Custom hook for detecting when an element is on screen
const useOnScreen = (options: IntersectionObserverInit) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

const isOfferValid = (offerEndDate?: string) => {
    if (!offerEndDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only, not time
    const endDate = new Date(offerEndDate);
    return endDate >= today;
}


const HomePage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { siteSettings, courses, galleryItems, trainingItems, lang, t } = context;

    const siteName = lang === 'bn' ? siteSettings.name_bn : siteSettings.name_en;
    const siteDescription = lang === 'bn' ? siteSettings.description_bn : siteSettings.description_en;
    const siteAddress = lang === 'bn' ? siteSettings.address_bn : siteSettings.address_en;
    
    const observerOptions = { threshold: 0.1 };
    const [trainingRef, isTrainingVisible] = useOnScreen(observerOptions);
    const [coursesRef, isCoursesVisible] = useOnScreen(observerOptions);
    const [featuresRef, isFeaturesVisible] = useOnScreen(observerOptions);
    const [galleryRef, isGalleryVisible] = useOnScreen(observerOptions);
    const [whyChooseUsRef, isWhyChooseUsVisible] = useOnScreen(observerOptions);
    const [contactRef, isContactVisible] = useOnScreen(observerOptions);

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <ImageSlider />

            {/* Intro Section - Moved from slider overlay */}
            <section className="bg-white text-center py-12 md:py-16 px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">{siteName}</h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{siteDescription}</p>
                <div className="space-x-4">
                    <Link to="/courses" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 text-lg">{t('view_courses')}</Link>
                    <Link to="/certificate-verification" className="inline-block bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition duration-300 text-lg">{t('verify_certificate')}</Link>
                </div>
            </section>

            {/* Training List Section */}
            <section ref={trainingRef} className={`py-16 bg-gray-50 fade-in-section ${isTrainingVisible ? 'is-visible' : ''}`}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{t('our_trainings')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                        {trainingItems.map(item => (
                            <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center">
                                <img src={item.imageUrl} alt={lang === 'bn' ? item.name_bn : item.name_en} className="w-32 h-32 object-cover rounded-full mb-4"/>
                                <h3 className="font-semibold text-gray-700">{lang === 'bn' ? item.name_bn : item.name_en}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Courses Section */}
            <section ref={coursesRef} className={`py-16 bg-white fade-in-section ${isCoursesVisible ? 'is-visible' : ''}`}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{t('our_courses')}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.slice(0, 3).map(course => {
                            const name = lang === 'bn' ? course.name_bn : course.name_en;
                            const shortDescription = lang === 'bn' ? course.shortDescription_bn : course.shortDescription_en;
                            const showOffer = course.offerPrice && isOfferValid(course.offerEndDate);
                            return (
                                <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                    <img src={course.imageUrl} alt={name} className="w-full h-56 object-cover" loading="lazy" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
                                        <p className="text-gray-600 mb-4 flex-grow">{shortDescription}</p>
                                        <div className="mt-auto">
                                            {showOffer ? (
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-2xl font-bold text-green-600">৳{course.offerPrice?.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</p>
                                                    <p className="text-lg line-through text-gray-500">৳{course.price?.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</p>
                                                </div>
                                            ) : course.price ? (
                                                <p className="text-2xl font-bold text-green-600">৳{course.price.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}</p>
                                            ) : null}
                                             <Link to="/courses" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">{t('read_more')} →</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/courses" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 text-lg">{t('all_courses')}</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className={`py-16 bg-gray-50 fade-in-section ${isFeaturesVisible ? 'is-visible' : ''}`}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{t('our_features')}</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {siteSettings.features.map(feature => {
                            const title = lang === 'bn' ? feature.title_bn : feature.title_en;
                            const description = lang === 'bn' ? feature.description_bn : feature.description_en;
                            return (
                                 <div key={feature.id} className="p-6">
                                    <div className="text-5xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                                    <p className="text-gray-600">{description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            
            {/* Gallery Section */}
            <section ref={galleryRef} className={`py-16 bg-white fade-in-section ${isGalleryVisible ? 'is-visible' : ''}`}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{t('our_gallery')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryItems.slice(0, 4).map(item => (
                            <div key={item.id} className="overflow-hidden rounded-lg shadow-md">
                                <img src={item.imageUrl} alt={lang === 'bn' ? item.description_bn : item.description_en} className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300" loading="lazy" />
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                         <Link to="/gallery" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 text-lg">{t('all_photos')}</Link>
                    </div>
                </div>
            </section>
            
            {/* Why Choose Us Section */}
            <section ref={whyChooseUsRef} className={`py-16 bg-gray-50 fade-in-section ${isWhyChooseUsVisible ? 'is-visible' : ''}`}>
                 <div className="container mx-auto px-4">
                     <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{t('why_choose_us')}</h2>
                     <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <img src={siteSettings.whyChooseUsImageUrl} alt="Welder working" className="rounded-lg shadow-xl" loading="lazy" />
                        </div>
                        <div className="space-y-6">
                            {siteSettings.whyChooseUs.map(item => {
                                const title = lang === 'bn' ? item.title_bn : item.title_en;
                                const description = lang === 'bn' ? item.description_bn : item.description_en;
                                return (
                                    <div key={item.id} className="flex items-start">
                                        <div className="text-3xl mr-4">{item.icon}</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                                            <p className="text-gray-600">{description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                     </div>
                </div>
            </section>

             {/* Contact Section */}
            <section ref={contactRef} className={`py-16 bg-blue-700 text-white fade-in-section ${isContactVisible ? 'is-visible' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t('contact_us')}</h2>
                        <p className="max-w-2xl mx-auto">{t('contact_intro')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left space-y-8">
                            <div className="bg-blue-800/50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">{t('address')}</h3>
                                <p>{siteAddress}</p>
                            </div>
                            <div className="bg-blue-800/50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">{t('phone')}</h3>
                                <p>{siteSettings.phone}</p>
                            </div>
                            <div className="bg-blue-800/50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">{t('email')}</h3>
                                <p>{siteSettings.email}</p>
                            </div>
                        </div>
                        <div className="h-full">
                            <iframe 
                                src={siteSettings.googleMapUrl} 
                                width="100%" 
                                height="100%" 
                                style={{border:0, minHeight: '400px'}} 
                                allowFullScreen={true} 
                                loading="lazy"
                                className="rounded-lg shadow-xl"
                                title="Google Map Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;