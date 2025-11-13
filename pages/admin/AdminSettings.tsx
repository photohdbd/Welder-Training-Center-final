
import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { SiteSettings, Feature, WhyChooseUsItem } from '../../types';

// Reusable Image Input Component
const ImageInput: React.FC<{
    label: string;
    value: string;
    onValueChange: (newValue: string) => void;
    t: (key: any) => string;
}> = ({ label, value, onValueChange, t }) => {
    const [inputType, setInputType] = useState<'upload' | 'url'>('url');

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
                {value && <img src={value} alt="Preview" className="h-20 mt-2 rounded shadow-sm" />}
            </div>
        </div>
    )
}


const AdminSettings: React.FC = () => {
    const context = useContext(AppContext);
    const [settings, setSettings] = useState<SiteSettings>(context?.siteSettings || {} as SiteSettings);
    const [message, setMessage] = useState('');

    if (!context) return <p>Loading...</p>;
    const { t } = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value,
        });
    };

    const handleItemChange = (
        listName: 'features' | 'whyChooseUs', 
        index: number, 
        field: keyof Feature | keyof WhyChooseUsItem, 
        value: string
    ) => {
        const newList = [...settings[listName]];
        // @ts-ignore
        newList[index][field] = value;
        setSettings({ ...settings, [listName]: newList });
    };

    const addItem = (listName: 'features' | 'whyChooseUs') => {
        const newItem = { id: Date.now().toString(), icon: '🆕', title_bn: '', title_en: '', description_bn: '', description_en: '' };
        setSettings({ ...settings, [listName]: [...settings[listName], newItem] });
    };

    const deleteItem = (listName: 'features' | 'whyChooseUs', id: string) => {
        const newList = settings[listName].filter(item => item.id !== id);
        setSettings({ ...settings, [listName]: newList });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        context.updateSiteSettings(settings);
        setMessage(t('settings_success_message'));
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('settings_title')}</h1>
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    {/* General Settings */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('settings_general')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_site_name_bn')}</label>
                                <input type="text" name="name_bn" value={settings.name_bn} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_site_name_en')}</label>
                                <input type="text" name="name_en" value={settings.name_en} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                            <ImageInput label={t('settings_logo_image')} value={settings.logoUrl} onValueChange={(v) => setSettings({...settings, logoUrl: v})} t={t} />
                            <ImageInput label={t('settings_favicon_image')} value={settings.faviconUrl} onValueChange={(v) => setSettings({...settings, faviconUrl: v})} t={t} />
                            <ImageInput label={t('settings_signature_image')} value={settings.signatureUrl} onValueChange={(v) => setSettings({...settings, signatureUrl: v})} t={t} />

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold">{t('settings_description_bn')}</label>
                                    <textarea name="description_bn" value={settings.description_bn} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows={3}></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold">{t('settings_description_en')}</label>
                                    <textarea name="description_en" value={settings.description_en} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows={3}></textarea>
                                </div>
                            </div>
                             <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_address_bn')}</label>
                                <input type="text" name="address_bn" value={settings.address_bn} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                             <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_address_en')}</label>
                                <input type="text" name="address_en" value={settings.address_en} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_phone')}</label>
                                <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                             <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_email_label')}</label>
                                <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                             <div>
                                <label className="block text-gray-700 font-semibold">{t('settings_whatsapp')}</label>
                                <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-gray-700 font-semibold">{t('settings_google_map_url')}</label>
                                <input type="url" name="googleMapUrl" value={settings.googleMapUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full p-2 border rounded mt-1" />
                            </div>
                             <div className="md:col-span-2">
                                <ImageInput 
                                    label={t('settings_why_choose_us_image')} 
                                    value={settings.whyChooseUsImageUrl} 
                                    onValueChange={(v) => setSettings({...settings, whyChooseUsImageUrl: v})} 
                                    t={t} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Settings */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('settings_features_section')}</h2>
                        <div className="space-y-4">
                            {settings.features.map((feature, index) => (
                                <div key={feature.id} className="border p-4 rounded-md space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <input value={feature.icon} onChange={(e) => handleItemChange('features', index, 'icon', e.target.value)} placeholder={t('settings_icon_placeholder')} className="p-2 border rounded" />
                                        <input value={feature.title_bn} onChange={(e) => handleItemChange('features', index, 'title_bn', e.target.value)} placeholder={t('settings_title_bn_placeholder')} className="p-2 border rounded" />
                                        <input value={feature.title_en} onChange={(e) => handleItemChange('features', index, 'title_en', e.target.value)} placeholder={t('settings_title_en_placeholder')} className="p-2 border rounded" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                       <textarea value={feature.description_bn} onChange={(e) => handleItemChange('features', index, 'description_bn', e.target.value)} placeholder={t('settings_desc_bn_placeholder')} className="p-2 border rounded" rows={2} />
                                       <textarea value={feature.description_en} onChange={(e) => handleItemChange('features', index, 'description_en', e.target.value)} placeholder={t('settings_desc_en_placeholder')} className="p-2 border rounded" rows={2} />
                                    </div>
                                    <button type="button" onClick={() => deleteItem('features', feature.id)} className="bg-red-500 text-white px-3 py-2 rounded text-sm">{t('delete')}</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addItem('features')} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">{t('settings_add_feature')}</button>
                    </div>

                     {/* Why Choose Us Settings */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('settings_why_choose_us_section')}</h2>
                         <div className="space-y-4">
                            {settings.whyChooseUs.map((item, index) => (
                                <div key={item.id} className="border p-4 rounded-md space-y-2">
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <input value={item.icon} onChange={(e) => handleItemChange('whyChooseUs', index, 'icon', e.target.value)} placeholder={t('settings_icon_placeholder')} className="p-2 border rounded" />
                                        <input value={item.title_bn} onChange={(e) => handleItemChange('whyChooseUs', index, 'title_bn', e.target.value)} placeholder={t('settings_title_bn_placeholder')} className="p-2 border rounded" />
                                        <input value={item.title_en} onChange={(e) => handleItemChange('whyChooseUs', index, 'title_en', e.target.value)} placeholder={t('settings_title_en_placeholder')} className="p-2 border rounded" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                       <textarea value={item.description_bn} onChange={(e) => handleItemChange('whyChooseUs', index, 'description_bn', e.target.value)} placeholder={t('settings_desc_bn_placeholder')} className="p-2 border rounded" rows={2} />
                                       <textarea value={item.description_en} onChange={(e) => handleItemChange('whyChooseUs', index, 'description_en', e.target.value)} placeholder={t('settings_desc_en_placeholder')} className="p-2 border rounded" rows={2} />
                                    </div>
                                    <button type="button" onClick={() => deleteItem('whyChooseUs', item.id)} className="bg-red-500 text-white px-3 py-2 rounded text-sm">{t('delete')}</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addItem('whyChooseUs')} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">{t('settings_add_reason')}</button>
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-bold">{t('settings_save_all')}</button>
                         {message && <p className="text-green-600 mt-4 inline-block ml-4">{message}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
