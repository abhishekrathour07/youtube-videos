import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import videoRoutes from './routes/videos.js';
import noteRoutes from './routes/notes.js';
import eventLogRoutes from './routes/eventLogs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors());

app.use('/videos', videoRoutes);
app.use('/notes', noteRoutes);
app.use('/event-logs', eventLogRoutes);

app.get("/", (req, res) => {
    res.json({ 
        message: "YouTube Video Management API is running!", 
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});


app.listen(PORT, () => {
    console.log("Server is started at port " + PORT);
});

export default app;
