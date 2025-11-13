import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-white">
        <path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.82-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42s2.42 3.62 2.42 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.82s-.39-.12-.56.12c-.17.25-.64.82-.79.99s-.29.17-.54.06c-.25-.12-1.06-.39-2.02-1.25c-.75-.67-1.25-1.5-1.4-1.75s-.02-.38.1-.51c.11-.11.25-.29.38-.43s.17-.25.25-.42c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31s-.86.84-.86 2.05c0 1.21.88 2.37 1 2.54s1.75 2.67 4.23 3.74c.59.25 1.05.4 1.41.51.61.2 1.17.18 1.62.11.5-.08 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18c-.06-.12-.23-.18-.48-.3z"></path>
    </svg>
);

const WhatsAppButton: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { siteSettings, lang } = context;

    const openWhatsApp = () => {
        window.open(`https://wa.me/${siteSettings.whatsappNumber}`, '_blank');
    };
    
    const ariaLabel = lang === 'bn' ? "WhatsApp-এ যোগাযোগ করুন" : "Contact us on WhatsApp";

    return (
        <button
            onClick={openWhatsApp}
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-50"
            aria-label={ariaLabel}
        >
            <WhatsAppIcon />
        </button>
    );
};

export default WhatsAppButton;