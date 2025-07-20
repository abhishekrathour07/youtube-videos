# YouTube Video Management Dashboard

A modern, full-stack web application for managing YouTube videos with advanced features for content creators and video managers.

![YouTube Studio](https://img.shields.io/badge/YouTube-Studio-red?style=for-the-badge&logo=youtube)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Express](https://img.shields.io/badge/Express-Backend-green?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎥 Video Management
- **Video Loading**: Load any YouTube video using video ID or full URL
- **Video Details**: View comprehensive video information including statistics
- **Video Editing**: Update video title and description directly from the dashboard
- **Real-time Statistics**: View counts, likes, comments, and privacy status
- **Thumbnail Preview**: High-quality video thumbnail with hover effects

### 💬 Comment Management
- **View Comments**: Browse all comments on your videos
- **Add Comments**: Post new comments directly from the dashboard
- **Reply to Comments**: Respond to existing comments with threaded replies
- **Comment Analytics**: Track engagement and community interaction

### 📝 Notes System
- **Personal Notes**: Add private notes for each video
- **Note Management**: Create, edit, and delete notes
- **Timestamped Notes**: Keep track of when notes were created/updated
- **Rich Text Support**: Format your notes with line breaks and special characters

### 📊 Analytics & Logging
- **Event Logging**: Track all user actions and video interactions
- **Activity History**: View detailed logs of all dashboard activities
- **Performance Metrics**: Monitor video performance over time
- **User Behavior**: Understand how you interact with your content

### 🔐 Authentication
- **YouTube OAuth**: Secure authentication with YouTube Data API v3
- **Token Management**: Automatic token refresh for uninterrupted access
- **Privacy Protection**: Secure handling of user credentials and data

## 🏗️ Technical Architecture

### Frontend (React + Vite)
```
test/
├── src/
│   ├── components/
│   │   ├── VideoSearch.jsx      # Video loading interface
│   │   ├── VideoDetails.jsx     # Video information & editing
│   │   ├── CommentsSection.jsx  # Comment management
│   │   └── NotesSection.jsx     # Personal notes
│   ├── services/
│   │   └── api.js              # API communication layer
│   ├── App.jsx                 # Main application component
│   └── main.jsx               # Application entry point
├── package.json
└── vite.config.js
```

### Backend (Express + MongoDB)
```
backend/
├── models/
│   ├── Video.js        # Video data model
│   ├── Note.js         # Notes data model
│   └── EventLog.js     # Activity logging model
├── routes/
│   ├── videos.js       # Video API endpoints
│   ├── notes.js        # Notes API endpoints
│   └── eventLogs.js    # Logging API endpoints
├── services/
│   └── youtubeService.js # YouTube API integration
├── middleware/
│   └── eventLogger.js   # Activity logging middleware
├── config/
│   └── db.js           # Database configuration
├── server.js           # Express server setup
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- YouTube Data API v3 credentials from Google Cloud Console

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Full stack test"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../test
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # YouTube API Credentials
   YOUTUBE_API_KEY=your_youtube_api_key
   YOUTUBE_CLIENT_ID=your_oauth_client_id
   YOUTUBE_CLIENT_SECRET=your_oauth_client_secret
   YOUTUBE_ACCESS_TOKEN=your_access_token
   YOUTUBE_REFRESH_TOKEN=your_refresh_token
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   Create `.env` file in the test directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### YouTube API Setup

1. **Google Cloud Console Setup**
   - Create a new project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5000/auth/youtube/callback` to redirect URIs

2. **Get OAuth Tokens**
   ```bash
   cd backend
   node get-youtube-tokens.js
   ```
   - Open http://localhost:5000 in your browser
   - Follow the authorization flow
   - Copy the tokens to your `.env` file

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Development Server**
   ```bash
   cd test
   npm run dev
   ```

3. **Access the Application**
   - Open http://localhost:3000 in your browser
   - Enter a YouTube video ID or URL to get started

## 🎨 UI/UX Features

### Modern Design Elements
- **Glass Morphism**: Translucent backgrounds with backdrop blur effects
- **Gradient Accents**: Beautiful color gradients throughout the interface
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Animations**: Smooth hover effects and transitions
- **Icon Integration**: Heroicons for consistent visual language

### User Experience
- **Intuitive Navigation**: Clear visual hierarchy and logical flow
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages and notifications
- **Toast Notifications**: Real-time feedback for user actions
- **Progressive Enhancement**: Graceful degradation for slower connections

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Stacked components with optimized touch targets

## 🔧 API Endpoints

### Video Management
- `GET /api/videos/:id` - Get video details
- `PUT /api/videos/:id` - Update video information
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comments` - Add new comment

### Notes Management
- `GET /api/notes/:videoId` - Get notes for a video
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note

### Activity Logging
- `GET /api/event-logs` - Get activity logs
- `POST /api/event-logs` - Create log entry

## 🛠️ Development Tools

### Frontend Dependencies
- **React 19.1.0**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Hot Toast**: Toast notifications
- **Date-fns**: Date formatting utilities
- **Heroicons**: SVG icon library

### Backend Dependencies
- **Express**: Web application framework
- **Mongoose**: MongoDB object modeling
- **Google APIs**: YouTube Data API integration
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variable management

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify
2. Set build command: `npm run build`
3. Set build directory: `dist`
4. Configure environment variables

### Backend Deployment (Heroku/Render)
1. Create new app on Heroku or Render
2. Connect your repository
3. Configure environment variables
4. Deploy from main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- YouTube Data API v3 for video management capabilities
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for flexible data storage
- All open-source contributors who made this project possible

---

**Built with ❤️ for content creators and video managers**
