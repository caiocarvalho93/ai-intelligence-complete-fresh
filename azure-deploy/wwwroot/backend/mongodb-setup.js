import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let db = null;
let activeDbName = null;

function maskConnectionString(uri) {
  if (!uri) return uri;
  return uri.replace(/:\S+@/, ':****@');
}

function deriveDatabaseName(uri) {
  if (!uri) return null;

  try {
    const protocolSplit = uri.split('://');
    const afterProtocol = protocolSplit[1] || protocolSplit[0];
    const pathStart = afterProtocol.indexOf('/');

    if (pathStart === -1) {
      return null;
    }

    const path = afterProtocol.substring(pathStart + 1);
    if (!path) {
      return null;
    }

    const [dbName] = path.split('?');
    return dbName || null;
  } catch (error) {
    console.warn('⚠️ Unable to derive MongoDB database name from URI:', error.message);
    return null;
  }
}

function buildMongoUriFromParts() {
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!username || !password) {
    return null;
  }

  const host = process.env.MONGODB_HOST || 'cai-newsdb.zrddgt8.mongodb.net';
  const dbName = process.env.MONGODB_DB_NAME ? `/${process.env.MONGODB_DB_NAME}` : '';
  const params = process.env.MONGODB_OPTIONS || '?retryWrites=true&w=majority&appName=cai-newsdb';

  const encodedPassword = encodeURIComponent(password);
  const normalizedParams = params.startsWith('?') ? params : `?${params}`;

  return `mongodb+srv://${encodeURIComponent(username)}:${encodedPassword}@${host}${dbName}${normalizedParams}`;
}

// MongoDB connection setup for Azure deployment
export async function initializeMongoDB() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGODB_CONNECTION_STRING ||
      buildMongoUriFromParts();

    if (!mongoUri) {
      console.error("❌ MongoDB: No MONGODB_URI configured!");
      console.log("💡 To fix: Add MONGODB_URI in Azure App Service → Configuration");
      console.log(
        "💡 Example: mongodb+srv://caitripping_db_user:<password>@cai-newsdb.zrddgt8.mongodb.net/?appName=cai-newsdb"
      );
      return false;
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    console.log(`   URI: ${maskConnectionString(mongoUri)}`);

    const maxPoolSize = Number.parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10);
    const serverSelectionTimeout = Number.parseInt(
      process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000',
      10
    );
    const socketTimeout = Number.parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000', 10);

    client = new MongoClient(mongoUri, {
      maxPoolSize: Number.isNaN(maxPoolSize) ? 10 : maxPoolSize,
      serverSelectionTimeoutMS: Number.isNaN(serverSelectionTimeout) ? 5000 : serverSelectionTimeout,
      socketTimeoutMS: Number.isNaN(socketTimeout) ? 45000 : socketTimeout,
      appName: process.env.MONGODB_APP_NAME || 'cai-news-service',
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    const configuredDbName = process.env.MONGODB_DB_NAME;
    const derivedDbName = configuredDbName || deriveDatabaseName(mongoUri) || 'cai-newsdb';
    db = client.db(derivedDbName);
    activeDbName = db.databaseName;

    console.log(`✅ MongoDB: Connected successfully to Atlas (db: ${activeDbName})`);

    // Test connection
    await db.command({ ping: 1 });
    console.log("📊 MongoDB: Ping successful");

    // Initialize collections and indexes
    await createCollections();
    await createIndexes();
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return false;
  }
}

// Create all necessary collections
async function createCollections() {
  console.log("🏗️ Creating MongoDB collections...");
  
  const collections = [
    'articles',
    'news_sources',
    'user_ratings',
    'user_interactions',
    'game_scores',
    'game_submissions',
    'job_postings',
    'job_search_queries',
    'ai_job_impact_cards',
    'api_usage_log',
    'system_metrics',
    'translations',
    'audit_records'
  ];

  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName);
      console.log(`✅ Created collection: ${collectionName}`);
    } catch (error) {
      if (error.code === 48) {
        console.log(`📋 Collection ${collectionName} already exists`);
      } else {
        console.warn(`⚠️ Failed to create ${collectionName}:`, error.message);
      }
    }
  }
}

// Create indexes for performance
async function createIndexes() {
  console.log("📊 Creating MongoDB indexes...");
  
  try {
    // Articles indexes
    await db.collection('articles').createIndexes([
      { key: { country: 1, published_at: -1 } },
      { key: { published_at: -1 } },
      { key: { category: 1 } },
      { key: { url: 1 }, unique: true },
      { key: { rel_score: -1, ana_score: -1 } },
      { key: { tags: 1 } },
      { key: { source: 1 } },
      { key: { title: "text", description: "text", content: "text" } }
    ]);

    // Game scores indexes
    await db.collection('game_scores').createIndexes([
      { key: { country: 1 }, unique: true },
      { key: { score: -1 } },
      { key: { daily_score: -1 } }
    ]);

    // Game submissions indexes
    await db.collection('game_submissions').createIndexes([
      { key: { country: 1 } },
      { key: { user_id: 1 } },
      { key: { submitted_at: -1 } },
      { key: { url: 1 }, unique: true }
    ]);

    // Job postings indexes
    await db.collection('job_postings').createIndexes([
      { key: { search_keywords: 1 } },
      { key: { country: 1 } },
      { key: { expires_at: 1 } },
      { key: { is_active: 1 } },
      { key: { title: "text", description: "text" } }
    ]);

    // User interactions indexes
    await db.collection('user_interactions').createIndexes([
      { key: { user_id: 1 } },
      { key: { interaction_type: 1 } },
      { key: { created_at: -1 } }
    ]);

    console.log("✅ All indexes created successfully");
  } catch (error) {
    console.error("❌ Failed to create indexes:", error.message);
  }
}

// Get database instance
export function getDB() {
  if (!db) {
    throw new Error('MongoDB not initialized. Call initializeMongoDB() first.');
  }
  return db;
}

// Close connection
export async function closeMongoDB() {
  if (client) {
    await client.close();
    console.log("🔒 MongoDB connection closed");
    client = null;
    db = null;
    activeDbName = null;
  }
}

// Health check
export async function mongoHealthCheck() {
  try {
    if (!db) return { status: 'disconnected' };

    await db.command({ ping: 1 });
    const stats = await db.stats();

    return {
      status: 'connected',
      database: activeDbName || db.databaseName,
      collections: stats.collections,
      dataSize: Math.round(stats.dataSize / 1024 / 1024) + 'MB',
      storageSize: Math.round(stats.storageSize / 1024 / 1024) + 'MB'
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}