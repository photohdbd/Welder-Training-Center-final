import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ImageSlider: React.FC = () => {
  const context = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = context?.slides || [];
  const lang = context?.lang || 'bn';

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, slides.length]);

  if (slides.length === 0) {
    return <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center">No images available.</div>;
  }

  return (
    <div className="relative w-full h-64 md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => {
        const caption = lang === 'bn' ? slide.caption_bn : slide.caption_en;
        return (
            <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            >
            <img src={slide.imageUrl} alt={caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center px-4">{caption}</h2>
            </div>
            </div>
        )
      })}
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;