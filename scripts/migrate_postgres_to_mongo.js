#!/usr/bin/env node
/**
 * Postgres → MongoDB migration (single-run, idempotent).
 * Usage:
 *   node scripts/migrate_postgres_to_mongo.js --pg "<DATABASE_URL>" --mongo "<MONGODB_URI>"
 *
 * Do not change collection/table names here unless they already exist in your project.
 * Kiro: replace the TODO sections with the exact SQL and field mappings already used in code.
 */

const { Client: PG } = require('pg');
const { MongoClient } = require('mongodb');

function arg(name, fallback = '') {
  const idx = process.argv.indexOf(name);
  return idx > -1 ? process.argv[idx + 1] : process.env[name.replace(/^--/, '').toUpperCase()] || fallback;
}

const pgUrl = arg('--pg');
const mongoUrl = arg('--mongo');

if (!pgUrl || !mongoUrl) {
  console.error('Missing --pg or --mongo');
  process.exit(1);
}

(async () => {
  const pg = new PG({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
  const mongo = new MongoClient(mongoUrl);

  try {
    console.log('Connecting to Postgres…');
    await pg.connect();
    console.log('Connecting to MongoDB…');
    await mongo.connect();

    // Kiro: set to your actual DB name
    const dbName = (new URL(mongoUrl)).pathname.replace(/^\//, '') || 'ai_intelligence_network';
    const mdb = mongo.db(dbName);

    // Collections (must match what backend expects)
    const articlesCol = mdb.collection('articles');
    const jobsCol     = mdb.collection('jobs');
    const usersCol    = mdb.collection('users');
    const gameScoresCol = mdb.collection('game_scores');

    // 1) Articles
    console.log('Migrating articles…');
    // Based on existing backend code - using actual query from complete-azure-server.js
    const articles = await pg.query(`
      SELECT * FROM articles ORDER BY published_at DESC LIMIT 10000
    `);

    for (const row of articles.rows) {
      // Map fields exactly as Mongo schema expects (based on backend code)
      const doc = {
        _pg_id: row.id,
        id: row.id,
        title: row.title,
        source: row.source,
        url: row.url,
        author: row.author,
        description: row.description,
        content: row.content,
        summary: row.summary,
        published_at: new Date(row.published_at),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at || row.created_at),
        country: row.country,
        category: row.category,
        relevance: row.relevance,
        migratedAt: new Date(),
      };
      await articlesCol.updateOne(
        { $or: [ { _pg_id: row.id }, { url: row.url } ] }, // duplicate guard
        { $set: doc },
        { upsert: true }
      );
    }
    console.log(`Articles migrated: ${articles.rowCount}`);

    // 2) Game Scores
    console.log('Migrating game scores…');
    // Based on existing backend code - using actual query from complete-azure-server.js
    const gameScores = await pg.query(`
      SELECT * FROM game_scores
    `);

    for (const row of gameScores.rows) {
      const doc = {
        _pg_id: row.country, // using country as ID like in backend
        country: row.country,
        score: row.score || 0,
        total_submissions: row.total_submissions || 0,
        last_submission_at: row.last_submission_at,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        migratedAt: new Date(),
      };
      await gameScoresCol.updateOne(
        { $or: [ { _pg_id: row.country }, { country: row.country } ] },
        { $set: doc },
        { upsert: true }
      );
    }
    console.log(`Game scores migrated: ${gameScores.rowCount}`);

    // 3) Jobs (if table exists)
    console.log('Checking for jobs table…');
    try {
      const jobs = await pg.query(`
        SELECT id, title, company, location, link, source, posted_at, salary_min, salary_max, created_at
        FROM jobs
        ORDER BY posted_at DESC LIMIT 5000
      `);

      for (const row of jobs.rows) {
        const doc = {
          _pg_id: row.id,
          id: row.id,
          title: row.title,
          company: row.company,
          location: row.location,
          link: row.link,
          source: row.source,
          postedAt: row.posted_at ? new Date(row.posted_at) : null,
          salaryMin: row.salary_min,
          salaryMax: row.salary_max,
          created_at: new Date(row.created_at),
          migratedAt: new Date(),
        };
        await jobsCol.updateOne(
          { $or: [ { _pg_id: row.id }, { link: row.link } ] },
          { $set: doc },
          { upsert: true }
        );
      }
      console.log(`Jobs migrated: ${jobs.rowCount}`);
    } catch (e) {
      console.log('Jobs table not found or empty, skipping...');
    }

    // 4) Users (if table exists)
    console.log('Checking for users table…');
    try {
      const users = await pg.query(`
        SELECT id, email, name, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
      `);

      for (const row of users.rows) {
        const doc = {
          _pg_id: row.id,
          id: row.id,
          email: row.email,
          name: row.name,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at || row.created_at),
          migratedAt: new Date(),
        };
        await usersCol.updateOne(
          { $or: [ { _pg_id: row.id }, { email: row.email } ] },
          { $set: doc },
          { upsert: true }
        );
      }
      console.log(`Users migrated: ${users.rowCount}`);
    } catch (e) {
      console.log('Users table not found or empty, skipping...');
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err?.message || err);
    process.exitCode = 1;
  } finally {
    try { await mongo.close(); } catch {}
    try { await pg.end(); } catch {}
  }
})();