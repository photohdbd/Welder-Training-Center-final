
import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { GalleryItem } from '../../types';


// Reusable Image Input Component
const ImageInput: React.FC<{
    label: string;
    value: string;
    onValueChange: (newValue: string) => void;
    t: (key: any) => string;
}> = ({ label, value, onValueChange, t }) => {
    const [inputType, setInputType] = useState<'upload' | 'url'>('upload');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    onValueChange(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div>
            <label className="block text-gray-700 font-semibold">{label}</label>
            <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center">
                    <input type="radio" name={`${label}-type`} checked={inputType === 'upload'} onChange={() => setInputType('upload')} className="mr-2"/> {t('upload_from_device')}
                </label>
                <label className="flex items-center">
                    <input type="radio" name={`${label}-type`} checked={inputType === 'url'} onChange={() => setInputType('url')} className="mr-2"/> {t('or_enter_image_url')}
                </label>
            </div>
             <div className="mt-2">
                {inputType === 'upload' ? (
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                ) : (
                    <input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={t('image_url_placeholder')} className="w-full p-2 border rounded"/>
                )}
                {value && <img src={value} alt="Preview" className="h-24 mt-2 rounded shadow-sm" />}
            </div>
        </div>
    )
}

const AdminGallery: React.FC = () => {
    const context = useContext(AppContext);
    const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id'>>({ imageUrl: '', description_bn: '', description_en: '' });

    if (!context) return <p>Loading...</p>;

    const { galleryItems, addGalleryItem, deleteGalleryItem, lang, t } = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newItem.imageUrl && newItem.description_bn && newItem.description_en) {
            addGalleryItem(newItem);
            setNewItem({ imageUrl: '', description_bn: '', description_en: '' });
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('gallery_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('gallery_add_new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ImageInput 
                        label={t('gallery_image')}
                        value={newItem.imageUrl}
                        onValueChange={(v) => setNewItem({...newItem, imageUrl: v})}
                        t={t}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">{t('gallery_desc_bn')}</label>
                            <input type="text" name="description_bn" value={newItem.description_bn} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder={t('gallery_desc_bn')} required />
                        </div>
                        <div>
                            <label className="block text-gray-700">{t('gallery_desc_en')}</label>
                            <input type="text" name="description_en" value={newItem.description_en} onChange={handleChange} className="w-full p-2 border rounded mt-1" placeholder={t('gallery_desc_en')} required />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{t('add')}</button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">{t('gallery_all')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map(item => {
                        const description = lang === 'bn' ? item.description_bn : item.description_en;
                        return (
                            <div key={item.id} className="relative rounded-lg overflow-hidden group shadow-md">
                                <img src={item.imageUrl} alt={description} className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                                    <p className="text-white text-sm">{description}</p>
                                </div>
                                <button onClick={() => deleteGalleryItem(item.id)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title={t('delete')}>
                                    &times;
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;