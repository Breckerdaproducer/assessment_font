const { Pool } = require('pg');
require('dotenv').config({ path: 'C:/Users/Brecker_da_Producer/Desktop/Node js/assessment/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function check() {
    try {
        const res = await pool.query(`
            SELECT a.id, a.title, COUNT(q.id) as question_count 
            FROM assessments a 
            LEFT JOIN questions q ON q.assessment_id = a.id 
            GROUP BY a.id, a.title
        `);
        console.log("Assessments and their question counts:");
        console.table(res.rows);

        const attempts = await pool.query(`
            SELECT aa.id, aa.assessment_id, aa.score, aa.total_questions, aa.percentage, aa.status 
            FROM assessment_attempts aa
        `);
        console.log("\nAssessment Attempts:");
        console.table(attempts.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
