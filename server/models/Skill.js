const db = require('../db');

const Skill = {
    findAll: async () => {
        const { rows } = await db.query('SELECT * FROM skills ORDER BY name ASC');
        return rows;
    },

    create: async (name, category) => {
        const { rows } = await db.query(
            'INSERT INTO skills (name, category) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET category = $2 RETURNING *',
            [name, category]
        );
        return rows[0];
    },

    addUserSkill: async (userId, skillId, type) => {
        const { rows } = await db.query(
            'INSERT INTO user_skills (user_id, skill_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *',
            [userId, skillId, type]
        );
        return rows[0];
    },

    getUserSkills: async (userId) => {
        const query = `
      SELECT s.*, us.type 
      FROM skills s 
      JOIN user_skills us ON s.id = us.skill_id 
      WHERE us.user_id = $1
    `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }
};

module.exports = Skill;
