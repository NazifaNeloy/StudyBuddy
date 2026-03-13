const db = require('../db');

const User = {
    create: async ({ name, email, password_hash, google_id, bio, daily_goal_hours }) => {
        const query = `
      INSERT INTO users (name, email, password_hash, google_id, bio, daily_goal_hours)
      VALUES ($1, $2, $3, $4, $5, $6)
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
    }
};

module.exports = User;
