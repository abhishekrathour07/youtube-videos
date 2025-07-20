import { useState } from 'react';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';

const VideoSearch = ({ onVideoFound }) => {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoId.trim()) {
      toast.error('Please enter a YouTube video ID or URL');
      return;
    }

    setLoading(true);
    try {
      const extractedId = extractVideoId(videoId.trim());
      const response = await videoAPI.getVideo(extractedId);
      
      if (response.data.success) {
        onVideoFound(response.data.data);
        toast.success('Video loaded successfully!');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Load Your YouTube Video</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter YouTube video ID or URL (e.g., dQw4w9WgXcQ)"
            className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white/80"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Load Video</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>You can paste a full YouTube URL or just the video ID. Make sure the video is unlisted and you have access to <it className="text-red-600">Full videos not sorts videos</it></span>
        </p>
      </form>
    </div>
  );
};

export default VideoSearch;
