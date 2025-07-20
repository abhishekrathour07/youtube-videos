import { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const NotesSection = ({ video }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    if (video?.youtubeId) {
      fetchNotes();
    }
  }, [video]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await notesAPI.getNotes(video.youtubeId);
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      let response;
      if (editingNote) {
        response = await notesAPI.updateNote(editingNote._id, formData);
      } else {
        response = await notesAPI.createNote({
          ...formData,
          videoId: video.youtubeId
        });
      }

      if (response.data.success) {
        setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
        setShowForm(false);
        setEditingNote(null);
        fetchNotes();
        toast.success(editingNote ? 'Note updated successfully!' : 'Note created successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error.response?.data?.message || 'Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await notesAPI.deleteNote(noteId);
      if (response.data.success) {
        fetchNotes();
        toast.success('Note deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const cancelForm = () => {
    setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
    setShowForm(false);
    setEditingNote(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'improvement': return 'bg-blue-100 text-blue-800';
      case 'ideas': return 'bg-purple-100 text-purple-800';
      case 'feedback': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!video) {
    return null;
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Notes</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Note</span>
        </button>
      </div>

      {/* Note Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">
            {editingNote ? 'Edit Note' : 'Add New Note'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your ideas and notes here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">General</option>
                  <option value="improvement">Improvement</option>
                  <option value="ideas">Ideas</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingNote ? 'Update Note' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No notes yet. Add your first note to start organizing your video improvement ideas!
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{note.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                    {note.priority} priority
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(note.createdAt))} ago
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesSection;
