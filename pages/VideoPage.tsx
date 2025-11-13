import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Video } from '../types';

const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const VideoPage: React.FC = () => {
  const context = useContext(AppContext);
  const videos = context?.videos || [];
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (!context) return null;
  const { lang, t } = context;

  const openVideo = (video: Video) => {
      setSelectedVideo(video);
  };

  const closeVideo = () => {
      setSelectedVideo(null);
  };
  
  const selectedVideoId = selectedVideo ? getYoutubeVideoId(selectedVideo.youtubeUrl) : null;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">{t('our_videos')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.length > 0 ? (
            videos.map(video => {
              const title = lang === 'bn' ? video.title_bn : video.title_en;
              const videoId = getYoutubeVideoId(video.youtubeUrl);
              if (!videoId) return null;
              
              return (
                <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer transform hover:-translate-y-1 transition-transform" onClick={() => openVideo(video)}>
                    <div className="relative">
                        <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={title} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                        </div>
                    </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 truncate" title={title}>{title}</h2>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">{t('no_videos')}</p>
          )}
        </div>
      </div>
      
      {selectedVideo && selectedVideoId && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={closeVideo}
            aria-modal="true"
            role="dialog"
          >
            <div 
              className="bg-black rounded-lg w-full max-w-4xl aspect-video relative"
              onClick={e => e.stopPropagation()}
            >
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`} 
                title={lang === 'bn' ? selectedVideo.title_bn : selectedVideo.title_en}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
              <button 
                  onClick={closeVideo} 
                  className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-white text-gray-800 rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-gray-200 transition-colors"
                  aria-label={t('close')}
              >
                &times;
              </button>
            </div>
          </div>
      )}
    </div>
  );
};

export default VideoPage;