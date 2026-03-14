const db = require('../db');

const Group = {
    // 1. Create a new Study Group
    create: async (creatorId, title, courseCode, isPrivate = false) => {
        const query = `
            INSERT INTO study_groups (creator_id, title, course_code)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        // Transaction to create group AND add creator as first member
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            
            const { rows: groupRows } = await client.query(query, [creatorId, title, courseCode]);
            const newGroup = groupRows[0];
            
            // Add creator to group_members automatically
            await client.query(
                `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
                [newGroup.id, creatorId]
            );
            
            await client.query('COMMIT');
            return newGroup;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // 2. Get All Public Discovery Groups
    getAllPublic: async () => {
        const query = `
            SELECT sg.*, u.name as creator_name, 
            (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = sg.id) as member_count
            FROM study_groups sg
            LEFT JOIN users u ON sg.creator_id = u.id
            ORDER BY sg.created_at DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    },

    // 3. Get User's Active Groups
    getUserGroups: async (userId) => {
        const query = `
            SELECT sg.*
            FROM study_groups sg
            JOIN group_members gm ON sg.id = gm.group_id
            WHERE gm.user_id = $1
            ORDER BY gm.joined_at DESC;
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    },

    // 4. Request to Join logic (Piggybacking on the friendships table for simplicity)
    // We repurpose "friendships" to also handle Group Requests where addressee is the creator
    requestToJoin: async (requesterId, groupId) => {
        // Technically this should be a 'group_requests' table, but we will adapt `notifications`
        // We will insert a system action notification pointing to the Creator
        
        // 1. Find the Creator
        const { rows: groupRows } = await db.query('SELECT creator_id, title FROM study_groups WHERE id = $1', [groupId]);
        if (!groupRows.length) throw new Error('Group not found');
        const creatorId = groupRows[0].creator_id;
        
        // 2. Check if already a member
        const { rows: memberRows } = await db.query('SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2', [groupId, requesterId]);
        if (memberRows.length > 0) throw new Error('Already a member');

        // 3. Dispatch Join Request Notification (Stored in JSON format for easy parsing)
        const requestPayload = JSON.stringify({
            action: 'JOIN_REQUEST',
            groupId,
            requesterId,
            groupTitle: groupRows[0].title
        });

        const notifyQuery = `
            INSERT INTO notifications (user_id, type, message)
            VALUES ($1, 'system', $2)
            RETURNING *;
        `;
        const { rows } = await db.query(notifyQuery, [creatorId, requestPayload]);
        return rows[0];
    },

    // 5. Approve Request
    approveRequest: async (groupId, requestedUserId) => {
        const query = `
            INSERT INTO group_members (group_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING *;
        `;
        const { rows } = await db.query(query, [groupId, requestedUserId]);
        return rows[0];
    }
};

module.exports = Group;
