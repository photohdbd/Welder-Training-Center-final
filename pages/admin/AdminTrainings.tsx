
import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { TrainingItem } from '../../types';

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
                {value && <img src={value} alt="Preview" className="h-24 w-24 object-cover rounded-full mt-2 shadow-sm" />}
            </div>
        </div>
    )
}

const AdminTrainings: React.FC = () => {
    const context = useContext(AppContext);
    const [currentItem, setCurrentItem] = useState<Partial<TrainingItem>>({});
    const [isEditing, setIsEditing] = useState(false);

    if (!context) return <p>Loading...</p>;
    const { trainingItems, addTrainingItem, updateTrainingItem, deleteTrainingItem, lang, t } = context;

    const handleEdit = (item: TrainingItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setCurrentItem({});
        setIsEditing(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { name_bn, name_en, imageUrl } = currentItem;
        if (!name_bn || !name_en || !imageUrl) return;

        if (isEditing && currentItem.id) {
            updateTrainingItem(currentItem as TrainingItem);
        } else {
            addTrainingItem({ name_bn, name_en, imageUrl });
        }
        handleCancel();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('trainings_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? t('trainings_edit') : t('trainings_add_new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name_bn" value={currentItem.name_bn || ''} onChange={handleChange} placeholder={t('trainings_name_bn')} className="p-2 border rounded" required />
                        <input type="text" name="name_en" value={currentItem.name_en || ''} onChange={handleChange} placeholder={t('trainings_name_en')} className="p-2 border rounded" required />
                    </div>
                    <div>
                         <ImageInput 
                            label={t('trainings_image')} 
                            value={currentItem.imageUrl || ''} 
                            onValueChange={(v) => setCurrentItem({...currentItem, imageUrl: v})} 
                            t={t} 
                        />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{isEditing ? t('update') : t('add')}</button>
                        {isEditing && <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">{t('cancel')}</button>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">{t('trainings_all')}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {trainingItems.map(item => {
                        const name = lang === 'bn' ? item.name_bn : item.name_en;
                        return (
                            <div key={item.id} className="border rounded-lg p-4 text-center shadow-sm">
                                <img src={item.imageUrl} alt={name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-700">{name}</h3>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm w-full">{t('edit')}</button>
                                    <button onClick={() => deleteTrainingItem(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm w-full">{t('delete')}</button>
                                </div>
                            </div>
                        )
                    })}
                 </div>
            </div>
        </div>
    );
};

export default AdminTrainings;
