
import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { Course } from '../../types';

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

const AdminCourses: React.FC = () => {
    const context = useContext(AppContext);
    const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
    const [isEditing, setIsEditing] = useState(false);

    if (!context) return <p>Loading...</p>;
    const { courses, addCourse, updateCourse, deleteCourse, t } = context;

    const handleEdit = (course: Course) => {
        setCurrentCourse(course);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setCurrentCourse({});
        setIsEditing(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { name_bn, name_en, shortDescription_bn, shortDescription_en, imageUrl, details_bn, details_en } = currentCourse;
        if (!name_bn || !name_en || !shortDescription_bn || !shortDescription_en || !imageUrl || !details_bn || !details_en) return;

        // Ensure numeric fields are numbers or undefined
        const courseData: Omit<Course, 'id'> = {
            name_bn, name_en, shortDescription_bn, shortDescription_en, imageUrl, details_bn, details_en,
            price: currentCourse.price ? Number(currentCourse.price) : undefined,
            offerPrice: currentCourse.offerPrice ? Number(currentCourse.offerPrice) : undefined,
            offerEndDate: currentCourse.offerEndDate || undefined,
        };

        if (isEditing && currentCourse.id) {
            updateCourse({ ...courseData, id: currentCourse.id });
        } else {
            addCourse(courseData);
        }
        handleCancel();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentCourse({ ...currentCourse, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('courses_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? t('courses_edit') : t('courses_add_new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name_bn" value={currentCourse.name_bn || ''} onChange={handleChange} placeholder={t('courses_name_bn')} className="p-2 border rounded" required />
                        <input type="text" name="name_en" value={currentCourse.name_en || ''} onChange={handleChange} placeholder={t('courses_name_en')} className="p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="shortDescription_bn" value={currentCourse.shortDescription_bn || ''} onChange={handleChange} placeholder={t('courses_short_desc_bn')} className="p-2 border rounded" required />
                        <input type="text" name="shortDescription_en" value={currentCourse.shortDescription_en || ''} onChange={handleChange} placeholder={t('courses_short_desc_en')} className="p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold">{t('courses_price')}</label>
                            <input type="number" name="price" value={currentCourse.price || ''} onChange={handleChange} placeholder="e.g., 15000" className="w-full p-2 border rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold">{t('courses_offer_price')}</label>
                            <input type="number" name="offerPrice" value={currentCourse.offerPrice || ''} onChange={handleChange} placeholder="e.g., 12000" className="w-full p-2 border rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold">{t('courses_offer_end_date')}</label>
                            <input type="date" name="offerEndDate" value={currentCourse.offerEndDate || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                        </div>
                    </div>
                    <div>
                        <ImageInput 
                            label={t('courses_image')}
                            value={currentCourse.imageUrl || ''}
                            onValueChange={(v) => setCurrentCourse({...currentCourse, imageUrl: v})}
                            t={t}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <textarea name="details_bn" value={currentCourse.details_bn || ''} onChange={handleChange} placeholder={t('courses_details_bn')} className="w-full p-2 border rounded" rows={5} required />
                        <textarea name="details_en" value={currentCourse.details_en || ''} onChange={handleChange} placeholder={t('courses_details_en')} className="w-full p-2 border rounded" rows={5} required />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{isEditing ? t('update') : t('add')}</button>
                        {isEditing && <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">{t('cancel')}</button>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">{t('courses_all')}</h2>
                 <div className="space-y-4">
                    {courses.map(course => (
                        <div key={course.id} className="p-4 border rounded-md flex flex-col md:flex-row justify-between items-start gap-4">
                           <img src={course.imageUrl} alt={course.name_bn} className="w-full md:w-40 h-auto object-cover rounded"/>
                           <div className="flex-grow">
                                <h3 className="font-bold text-lg">{course.name_bn} / {course.name_en}</h3>
                                <p className="text-gray-600">{course.shortDescription_bn}</p>
                                <div className="text-sm mt-2">
                                    {course.price && <p>Price: {course.price}</p>}
                                    {course.offerPrice && <p>Offer: {course.offerPrice} (until {course.offerEndDate})</p>}
                                </div>
                           </div>
                           <div className="flex gap-2 flex-shrink-0">
                               <button onClick={() => handleEdit(course)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">{t('edit')}</button>
                               <button onClick={() => deleteCourse(course.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">{t('delete')}</button>
                           </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default AdminCourses;