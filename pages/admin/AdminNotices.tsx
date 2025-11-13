import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { Notice } from '../../types';

const AdminNotices: React.FC = () => {
    const context = useContext(AppContext);
    const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({title_bn: '', title_en: '', date: '', content_bn: '', content_en: ''});
    const [isEditing, setIsEditing] = useState(false);

    if (!context) return <p>Loading...</p>;
    const { notices, addNotice, updateNotice, deleteNotice, t } = context;

    const handleEdit = (notice: Notice) => {
        setCurrentNotice(notice);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setCurrentNotice({title_bn: '', title_en: '', date: '', content_bn: '', content_en: ''});
        setIsEditing(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { title_bn, title_en, date, content_bn, content_en } = currentNotice;
        if (!title_bn || !title_en || !date || !content_bn || !content_en) return;

        if (isEditing && currentNotice.id) {
            updateNotice(currentNotice as Notice);
        } else {
            addNotice({ title_bn, title_en, date, content_bn, content_en });
        }
        handleCancel();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentNotice({ ...currentNotice, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('notices_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? t('notices_edit') : t('notices_add_new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">{t('notices_title_bn')}</label>
                            <input type="text" name="title_bn" value={currentNotice.title_bn || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                        </div>
                         <div>
                            <label className="block text-gray-700">{t('notices_title_en')}</label>
                            <input type="text" name="title_en" value={currentNotice.title_en || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">{t('notices_date')}</label>
                        <input type="date" name="date" value={currentNotice.date || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">{t('notices_content_bn')}</label>
                            <textarea name="content_bn" value={currentNotice.content_bn || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows={5} required />
                        </div>
                         <div>
                            <label className="block text-gray-700">{t('notices_content_en')}</label>
                            <textarea name="content_en" value={currentNotice.content_en || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows={5} required />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{isEditing ? t('update') : t('add')}</button>
                        {isEditing && <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">{t('cancel')}</button>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">{t('notices_all')}</h2>
                 <div className="space-y-4">
                    {notices.map(notice => (
                        <div key={notice.id} className="p-4 border rounded-md flex justify-between items-start">
                           <div>
                                <h3 className="font-bold text-lg">{notice.title_bn} / {notice.title_en}</h3>
                                <p className="text-sm text-gray-500">{notice.date}</p>
                                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{notice.content_bn}</p>
                           </div>
                           <div className="flex gap-2 flex-shrink-0 ml-4">
                               <button onClick={() => handleEdit(notice)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">{t('edit')}</button>
                               <button onClick={() => deleteNotice(notice.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">{t('delete')}</button>
                           </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default AdminNotices;