const express = require('express');
const authMiddleware = require('../middleware/auth');
const Group = require('../models/Group');

const router = express.Router();

// @route   POST /groups
// @desc    Create a new study group
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { title, courseCode, isPrivate } = req.body;
        if (!title || !courseCode) {
            return res.status(400).json({ message: 'Title and Course Code required' });
        }
        
        const newGroup = await Group.create(req.user.id, title, courseCode, isPrivate);
        res.status(201).json(newGroup);
    } catch (err) {
        next(err);
    }
});

// @route   GET /groups
// @desc    Get all public study groups for discovery
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const groups = await Group.getAllPublic();
        res.json(groups);
    } catch (err) {
        next(err);
    }
});

// @route   GET /groups/me
// @desc    Get user's active study groups
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const groups = await Group.getUserGroups(req.user.id);
        res.json(groups);
    } catch (err) {
        next(err);
    }
});

// @route   POST /groups/:id/request
// @desc    Send a request to join a study group
router.post('/:id/request', authMiddleware, async (req, res, next) => {
    try {
        const result = await Group.requestToJoin(req.user.id, req.params.id);
        res.status(200).json({ message: 'Join request sent successfully', details: result });
    } catch (err) {
        if (err.message === 'Already a member' || err.message === 'Group not found') {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
});

// @route   POST /groups/:id/approve
// @desc    Approve a join request (Creator only)
router.post('/:id/approve', authMiddleware, async (req, res, next) => {
    try {
        const { requestedUserId } = req.body;
        
        // Approve the user
        const newMember = await Group.approveRequest(req.params.id, requestedUserId);
        
        // Note: Realistically, you should mark the system notification as 'read' or 'handled' here.
        
        res.status(200).json({ message: 'User approved', member: newMember });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
