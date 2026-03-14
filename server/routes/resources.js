const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { activeUsers } = require('../sockets/notificationHandler');

// 1. Configure Multer Storage Location and Filenames
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/')); // Save to server/uploads/
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /resources/upload
// @desc    Upload a shared resource file inside a study room
// @access  Private
router.post('/upload', authMiddleware, upload.single('resourceFile'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({ success: false, message: 'room_id is required.' });
        }

        // 1. Construct the public URL the frontend will use to access the file
        // `req.file.filename` is the auto-generated unique name from Multer
        const fileUrl = `${process.env.SERVER_URL || 'http://localhost:5001'}/uploads/${req.file.filename}`;
        
        // 2. Save metadata to Database
        const query = `
            INSERT INTO resources (user_id, room_id, file_url, file_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const { rows } = await db.query(query, [req.user.id, roomId, fileUrl, req.file.originalname]);
        const newResource = rows[0];

        // 3. GAMIFICATION: Award points for sharing a resource!
        const updatedUser = await User.addPoints(req.user.id, 10);
        
        // 4. Create and emit notification
        const io = req.app.get('io'); // Fetch the socket.io instance from Express
        const notif = await User.createNotification(
            req.user.id,
            'points_earned',
            `You earned 10 points for sharing a resource! Total: ${updatedUser.points}`
        );
        
        const globalSocketId = activeUsers.get(req.user.id);
        if (globalSocketId && io) {
            io.to(globalSocketId).emit('new_notification', notif);
        }

        res.status(201).json({
            success: true,
            resource: newResource
        });

    } catch (err) {
        console.error(err);
        next(err); // Pass async errors to the global error handler
    }
});

module.exports = router;
