import React, { useContext, useState, FormEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { Video } from '../../types';

const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


const AdminVideos: React.FC = () => {
    const context = useContext(AppContext);
    const [currentItem, setCurrentItem] = useState<Partial<Video>>({});
    const [isEditing, setIsEditing] = useState(false);

    if (!context) return <p>Loading...</p>;
    const { videos, addVideo, updateVideo, deleteVideo, t } = context;

    const handleEdit = (video: Video) => {
        setCurrentItem(video);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setCurrentItem({});
        setIsEditing(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { title_bn, title_en, youtubeUrl } = currentItem;
        if (!title_bn || !title_en || !youtubeUrl) return;

        if (isEditing && currentItem.id) {
            updateVideo(currentItem as Video);
        } else {
            addVideo({ title_bn, title_en, youtubeUrl });
        }
        handleCancel();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('videos_title')}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? t('videos_edit') : t('videos_add_new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title_bn" value={currentItem.title_bn || ''} onChange={handleChange} placeholder={t('videos_title_bn')} className="p-2 border rounded" required />
                        <input type="text" name="title_en" value={currentItem.title_en || ''} onChange={handleChange} placeholder={t('videos_title_en')} className="p-2 border rounded" required />
                    </div>
                    <div>
                        <input type="url" name="youtubeUrl" value={currentItem.youtubeUrl || ''} onChange={handleChange} placeholder={t('videos_youtube_url')} className="w-full p-2 border rounded" required />
                    </div>
                    
                    <div className="flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{isEditing ? t('update') : t('add')}</button>
                        {isEditing && <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">{t('cancel')}</button>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4">{t('videos_all')}</h2>
                 <div className="space-y-4">
                    {videos.map(video => {
                        const videoId = getYoutubeVideoId(video.youtubeUrl);
                        return (
                            <div key={video.id} className="p-4 border rounded-md flex flex-col md:flex-row justify-between items-start gap-4">
                               {videoId && <img src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt={video.title_bn} className="w-full md:w-40 h-auto object-cover rounded"/>}
                               <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{video.title_bn} / {video.title_en}</h3>
                                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">{video.youtubeUrl}</a>
                               </div>
                               <div className="flex gap-2 flex-shrink-0">
                                   <button onClick={() => handleEdit(video)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">{t('edit')}</button>
                                   <button onClick={() => deleteVideo(video.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">{t('delete')}</button>
                               </div>
                            </div>
                        )
                    })}
                 </div>
            </div>
        </div>
    );
};

export default AdminVideos;