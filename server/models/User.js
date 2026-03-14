const db = require('../db');

const User = {
    create: async ({ name, email, password_hash, google_id, bio, daily_goal_hours }) => {
        const query = `
      INSERT INTO users (name, email, password_hash, google_id, bio, daily_goal_hours, onboarding_complete)
      VALUES ($1, $2, $3, $4, $5, $6, FALSE)
      RETURNING *;
    `;
        const values = [name, email, password_hash, google_id, bio, daily_goal_hours];
        const { rows } = await db.query(query, values);
        return rows[0];
    },

    findById: async (id) => {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    },

    findByEmail: async (email) => {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return rows[0];
    },

    updatePoints: async (id, points) => {
        const { rows } = await db.query(
            'UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points',
            [points, id]
        );
        return rows[0];
    },

    completeOnboarding: async (userId, possessedSkills, skillsToLearn) => {
        // We begin a transaction because we perform multiple operations
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Mark onboarding as complete and return updated user
            const updateQuery = `
                UPDATE users 
                SET onboarding_complete = TRUE 
                WHERE id = $1 
                RETURNING *;
            `;
            const { rows: userRows } = await client.query(updateQuery, [userId]);
            const user = userRows[0];

            // 2. Helper function to ensure skills exist and link them to user
            const processSkills = async (skills, type) => {
                if (!skills || skills.length === 0) return;
                
                for (const skillName of skills) {
                    // Check if skill exists, else create it
                    let skillId;
                    const { rows: existingSkill } = await client.query('SELECT id FROM skills WHERE name = $1', [skillName.toLowerCase()]);
                    
                    if (existingSkill.length > 0) {
                        skillId = existingSkill[0].id;
                    } else {
                        const { rows: newSkill } = await client.query('INSERT INTO skills (name) VALUES ($1) RETURNING id', [skillName.toLowerCase()]);
                        skillId = newSkill[0].id;
                    }

                    // Insert into user_skills junction table (ON CONFLICT DO NOTHING implies we don't care if it already exists)
                    // The primary key handles uniqueness
                    try {
                        await client.query(
                            'INSERT INTO user_skills (user_id, skill_id, type) VALUES ($1, $2, $3) ON CONFLICT (user_id, skill_id, type) DO NOTHING',
                            [userId, skillId, type]
                        );
                    } catch (e) {
                         console.error("Error inserting user_skills:", e);
                    }
                }
            };

            await processSkills(possessedSkills, 'possess');
            await processSkills(skillsToLearn, 'wish_to_learn');

            await client.query('COMMIT');
            return user;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    findMatches: async (userId) => {
        const query = `
            SELECT DISTINCT u.id, u.name, u.bio, u.email 
            FROM users u
            JOIN user_skills us ON u.id = us.user_id
            WHERE us.type = 'possess' AND us.skill_id IN (
                SELECT skill_id FROM user_skills WHERE user_id = $1 AND type = 'wish_to_learn'
            ) AND u.id != $1;
        `;
        const { rows } = await db.query(query, [userId]);
        
        // Let's also fetch the skills they possess so we can show them on the UI cards
        for (let user of rows) {
            const skillsQuery = `
                SELECT s.name 
                FROM skills s
                JOIN user_skills us ON s.id = us.skill_id
                WHERE us.user_id = $1 AND us.type = 'possess'
            `;
            const { rows: skillRows } = await db.query(skillsQuery, [user.id]);
            user.skills = skillRows.map(row => row.name);
        }

        return rows;
    },

    addPoints: async (userId, amount) => {
        const query = `
            UPDATE users 
            SET points = points + $2 
            WHERE id = $1 
            RETURNING id, name, points;
        `;
        const { rows } = await db.query(query, [userId, amount]);
        return rows[0];
    },

    createNotification: async (userId, type, message) => {
        const query = `
            INSERT INTO notifications (user_id, type, message)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const { rows } = await db.query(query, [userId, type, message]);
        return rows[0];
    },

    getUnreadNotifications: async (userId) => {
        const query = `
            SELECT * FROM notifications 
            WHERE user_id = $1 AND is_read = false 
            ORDER BY created_at DESC;
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    },

    markNotificationRead: async (notificationId, userId) => {
        // userId check ensures users can only mark their own as read
        const query = `
            UPDATE notifications 
            SET is_read = true 
            WHERE id = $1 AND user_id = $2
            RETURNING *;
        `;
        const { rows } = await db.query(query, [notificationId, userId]);
        return rows[0];
    }
};

module.exports = User;
