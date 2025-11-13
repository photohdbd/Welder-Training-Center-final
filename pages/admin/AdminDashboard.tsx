import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const AdminDashboard: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return <p>Loading...</p>;

    const { students, trainers, notices, courses, galleryItems, videos, t } = context;

    const stats = [
        { title: t('total_students'), count: students.length, color: 'text-blue-600' },
        { title: t('total_trainers'), count: trainers.length, color: 'text-green-600' },
        { title: t('total_courses'), count: courses.length, color: 'text-indigo-600' },
        { title: t('total_videos'), count: videos.length, color: 'text-red-600' },
        { title: t('gallery_photos'), count: galleryItems.length, color: 'text-pink-600' },
        { title: t('total_notices'), count: notices.length, color: 'text-purple-600' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('dashboard')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <div key={stat.title} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold text-gray-700">{stat.title}</h2>
                        <p className={`text-5xl font-bold mt-2 ${stat.color}`}>{stat.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;