import { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const CommentsSection = ({ video }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (video?.youtubeId) {
      fetchComments();
    }
  }, [video]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await videoAPI.getComments(video.youtubeId);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setAddingComment(true);
    try {
      const response = await videoAPI.addComment(video.youtubeId, newComment.trim());
      if (response.data.success) {
        setNewComment('');
        toast.success('Comment added successfully!');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setReplyingTo(commentId);
    try {
      const response = await videoAPI.replyToComment(video.youtubeId, commentId, text.trim());
      if (response.data.success) {
        setReplyText({ ...replyText, [commentId]: '' });
        toast.success('Reply added successfully!');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add reply');
    } finally {
      setReplyingTo(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await videoAPI.deleteComment(video.youtubeId, commentId);
      if (response.data.success) {
        toast.success('Comment deleted successfully!');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (!video) {
    return null;
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Comments</h3>
      </div>

      {/* Add new comment */}
      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a thoughtful comment..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white/80 resize-none"
          disabled={addingComment}
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={addingComment || !newComment.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {addingComment ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Comment</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No comments yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              {/* Main comment */}
              <div className="flex items-start space-x-3">
                <img
                  src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                  alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-800">
                      {comment.snippet.topLevelComment.snippet.authorDisplayName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.snippet.topLevelComment.snippet.publishedAt))} ago
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.snippet.topLevelComment.snippet.textDisplay}
                  </p>
                  
                  {/* Comment actions */}
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => {
                        const newReplyText = { ...replyText };
                        if (newReplyText[comment.snippet.topLevelComment.id]) {
                          delete newReplyText[comment.snippet.topLevelComment.id];
                        } else {
                          newReplyText[comment.snippet.topLevelComment.id] = '';
                        }
                        setReplyText(newReplyText);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.snippet.topLevelComment.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Reply form */}
                  {replyText[comment.snippet.topLevelComment.id] !== undefined && (
                    <div className="mt-3">
                      <textarea
                        value={replyText[comment.snippet.topLevelComment.id]}
                        onChange={(e) => setReplyText({
                          ...replyText,
                          [comment.snippet.topLevelComment.id]: e.target.value
                        })}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        disabled={replyingTo === comment.snippet.topLevelComment.id}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReply(comment.snippet.topLevelComment.id)}
                          disabled={replyingTo === comment.snippet.topLevelComment.id}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {replyingTo === comment.snippet.topLevelComment.id ? 'Replying...' : 'Reply'}
                        </button>
                        <button
                          onClick={() => {
                            const newReplyText = { ...replyText };
                            delete newReplyText[comment.snippet.topLevelComment.id];
                            setReplyText(newReplyText);
                          }}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.comments && (
                <div className="ml-11 mt-4 space-y-3">
                  {comment.replies.comments.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-3">
                      <img
                        src={reply.snippet.authorProfileImageUrl}
                        alt={reply.snippet.authorDisplayName}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800 text-sm">
                            {reply.snippet.authorDisplayName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.snippet.publishedAt))} ago
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {reply.snippet.textDisplay}
                        </p>
                        <button
                          onClick={() => handleDeleteComment(reply.id)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
