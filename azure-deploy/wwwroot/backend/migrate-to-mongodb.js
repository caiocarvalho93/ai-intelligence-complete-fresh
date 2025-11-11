#!/usr/bin/env node

/**
 * PostgreSQL to MongoDB Migration Script
 * Migrates all data from Railway PostgreSQL to MongoDB Atlas
 */

import dotenv from 'dotenv';
import { initializeMongoDB } from './mongodb-setup.js';
import { migrateFromPostgreSQL } from './mongodb-operations.js';
import { initializePool, getArticles, getGameScores, getGameSubmissions } from './database.js';

dotenv.config();

async function migrateData() {
  console.log("🚀 Starting PostgreSQL to MongoDB migration...");
  console.log("=" .repeat(60));

  try {
    // Initialize MongoDB connection
    console.log("1️⃣ Connecting to MongoDB Atlas...");
    const mongoConnected = await initializeMongoDB();
    if (!mongoConnected) {
      throw new Error("Failed to connect to MongoDB");
    }

    // Initialize PostgreSQL connection
    console.log("2️⃣ Connecting to PostgreSQL (Railway)...");
    const pgConnected = await initializePool();
    if (!pgConnected) {
      throw new Error("Failed to connect to PostgreSQL");
    }

    // Extract data from PostgreSQL
    console.log("3️⃣ Extracting data from PostgreSQL...");
    
    const postgresData = {
      articles: [],
      gameScores: {},
      gameSubmissions: []
    };

    // Get all articles
    console.log("   📰 Extracting articles...");
    postgresData.articles = await getArticles(null, 10000); // Get all articles
    console.log(`   ✅ Found ${postgresData.articles.length} articles`);

    // Get game scores
    console.log("   🎮 Extracting game scores...");
    postgresData.gameScores = await getGameScores();
    console.log(`   ✅ Found ${Object.keys(postgresData.gameScores).length} country scores`);

    // Get game submissions
    console.log("   📝 Extracting game submissions...");
    postgresData.gameSubmissions = await getGameSubmissions(5000);
    console.log(`   ✅ Found ${postgresData.gameSubmissions.length} submissions`);

    // Migrate to MongoDB
    console.log("4️⃣ Migrating data to MongoDB...");
    const migrationResult = await migrateFromPostgreSQL(postgresData);

    if (migrationResult.success) {
      console.log("✅ Migration completed successfully!");
      console.log(`📊 Total records migrated: ${migrationResult.migrated}`);
    } else {
      throw new Error("Migration failed");
    }

    // Verify migration
    console.log("5️⃣ Verifying migration...");
    const { getArticlesMongo, getGameScoresMongo } = await import('./mongodb-operations.js');
    
    const mongoArticles = await getArticlesMongo(null, 100);
    const mongoScores = await getGameScoresMongo();
    
    console.log(`   📰 MongoDB articles: ${mongoArticles.length}`);
    console.log(`   🎮 MongoDB scores: ${Object.keys(mongoScores).length} countries`);

    console.log("=" .repeat(60));
    console.log("🎉 MIGRATION COMPLETE!");
    console.log("Next steps:");
    console.log("1. Update your server.js to use MongoDB operations");
    console.log("2. Deploy to Azure App Service");
    console.log("3. Update environment variables in Azure");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export { migrateData };