import { getDB } from './mongodb-setup.js';

// ==================== ARTICLES OPERATIONS ====================

export async function storeArticlesMongo(country, articles) {
  const db = getDB();
  const collection = db.collection('articles');

  let storedCount = 0;
  let updatedCount = 0;
  let duplicateCount = 0;

  const normalizedCountry = typeof country === 'string' ? country.toUpperCase() : null;
  console.log(`📊 Storing ${articles.length} articles for ${normalizedCountry || 'UNKNOWN'} in MongoDB...`);

  for (const article of articles) {
    try {
      const articleCountry = (article.country || normalizedCountry || 'GLOBAL').toUpperCase();
      const publishedAt = article.publishedAt || article.published_at || null;
      const publishedDate = publishedAt ? new Date(publishedAt) : new Date();

      const safePublishedDate = Number.isNaN(publishedDate.getTime()) ? new Date() : publishedDate;

      const articleDoc = {
        id: article.id || `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: article.title,
        url: article.url,
        source: article.source,
        author: article.author,
        published_at: safePublishedDate,
        description: article.description,
        content: article.content || article.description,
        country: articleCountry,
        category: article.category || 'ai',
        rel_score: article.relScore || 0,
        ana_score: article.anaScore || 0,
        einstein_score: article.__einsteinScore || null,
        topic_category: article.__topicCategory?.category || null,
        provenance: article.provenance || 'api',
        search_query: article.searchQuery || null,
        sentiment_score: article.sentimentScore || null,
        word_count: article.wordCount || (article.description ? article.description.split(' ').length : 0),
        tags: article.tags || [],
        is_premium: article.isPremium || false,
        is_breaking: false,
        view_count: 0,
        share_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      const result = await collection.replaceOne(
        { url: article.url },
        articleDoc,
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        storedCount++;
      } else if (result.modifiedCount > 0) {
        updatedCount++;
      } else {
        duplicateCount++;
      }

    } catch (articleError) {
      console.warn(`⚠️ Failed to store article "${article.title}":`, articleError.message);
    }
  }

  // Update news sources
  await updateNewsSourcesMongo(articles);

  console.log(`✅ MongoDB Storage Complete for ${country}:`);
  console.log(`   📝 New articles: ${storedCount}`);
  console.log(`   🔄 Updated articles: ${updatedCount}`);
  console.log(`   🔁 Duplicates skipped: ${duplicateCount}`);

  return { storedCount, updatedCount, duplicateCount };
}

export async function getArticlesMongo(country = null, limit = 300) {
  const db = getDB();
  const collection = db.collection('articles');
  
  try {
    const query = country ? { country: country } : {};
    const articles = await collection
      .find(query)
      .sort({ published_at: -1 })
      .limit(limit)
      .toArray();

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      url: article.url,
      source: article.source,
      author: article.author,
      publishedAt: article.published_at,
      description: article.description,
      country: article.country,
      category: article.category,
      relScore: article.rel_score,
      anaScore: article.ana_score
    }));
  } catch (error) {
    console.error("❌ MongoDB read failed:", error.message);
    return [];
  }
}

async function updateNewsSourcesMongo(articles) {
  const db = getDB();
  const collection = db.collection('news_sources');
  
  for (const article of articles) {
    if (article.source) {
      try {
        await collection.updateOne(
          { name: article.source },
          {
            $inc: { article_count: 1 },
            $set: { 
              last_article_date: new Date(article.publishedAt),
              updated_at: new Date()
            },
            $setOnInsert: {
              domain: article.url ? new URL(article.url).hostname : null,
              credibility_score: 75,
              is_active: true,
              created_at: new Date()
            }
          },
          { upsert: true }
        );
      } catch (error) {
        console.warn(`⚠️ Failed to update news source ${article.source}:`, error.message);
      }
    }
  }
}

// ==================== GAME OPERATIONS ====================

export async function storeGameSubmissionMongo(submission) {
  const db = getDB();
  const collection = db.collection('game_submissions');
  
  try {
    const submissionDoc = {
      url: submission.url,
      country: submission.country,
      user_id: submission.userId || `user-${Date.now()}`,
      user_ip: submission.userIp,
      points: submission.points || 1,
      article_title: submission.articleTitle,
      article_source: submission.articleSource,
      quality_score: submission.qualityScore || 50,
      is_duplicate: false,
      moderator_approved: null,
      submission_method: 'web',
      submitted_at: new Date(),
      processed_at: new Date()
    };

    const result = await collection.insertOne(submissionDoc);
    
    // Update game scores
    await updateGameScoresMongo(submission.country, submission.points || 1);
    
    return {
      success: true,
      id: result.insertedId,
      points: submission.points || 1
    };
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return { success: false, error: 'URL already submitted' };
    }
    throw error;
  }
}

export async function updateGameScoresMongo(country, points) {
  const db = getDB();
  const collection = db.collection('game_scores');
  
  await collection.updateOne(
    { country: country },
    {
      $inc: { 
        score: points,
        total_submissions: 1,
        daily_score: points
      },
      $set: { 
        last_submission_at: new Date(),
        updated_at: new Date()
      },
      $setOnInsert: {
        unique_contributors: 1,
        rank_position: 0,
        rank_change: 0,
        weekly_score: points,
        monthly_score: points,
        streak_days: 1,
        achievements: [],
        created_at: new Date()
      }
    },
    { upsert: true }
  );
}

export async function getGameScoresMongo() {
  const db = getDB();
  const collection = db.collection('game_scores');
  
  try {
    const scores = await collection
      .find({})
      .sort({ score: -1 })
      .toArray();

    const result = {};
    scores.forEach(score => {
      result[score.country] = {
        score: score.score,
        totalSubmissions: score.total_submissions,
        lastSubmission: score.last_submission_at,
        dailyScore: score.daily_score || 0
      };
    });

    return result;
  } catch (error) {
    console.error("❌ Failed to get game scores:", error.message);
    return {};
  }
}

// ==================== JOB OPERATIONS ====================

export async function storeJobPostingsMongo(jobs, searchParams) {
  const db = getDB();
  const collection = db.collection('job_postings');

  if (!jobs || jobs.length === 0) {
    return { success: false, stored: 0, updated: 0 };
  }

  let stored = 0;
  let updated = 0;

  for (const job of jobs) {
    try {
      const now = new Date();
      const jobDoc = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary_min: job.salary_min ?? null,
        salary_max: job.salary_max ?? null,
        salary_display: job.salary_display || job.salary || null,
        description: job.description || job.metadata || null,
        url: job.url,
        source: job.source || 'adzuna',
        contract_type: job.contract_type || 'Not specified',
        category: job.category || 'General',
        country: (searchParams.country || 'us').toLowerCase(),
        search_keywords: searchParams.keywords,
        search_location: searchParams.location && searchParams.location.trim() ? searchParams.location.trim() : '',
        date_posted: job.date_posted ? new Date(job.date_posted) : job.created ? new Date(job.created) : now,
        is_active: true,
        quality_score: job.quality_score ?? job.qualityScore ?? 50,
        view_count: job.view_count ?? 0,
        click_count: job.click_count ?? 0,
      };

      const result = await collection.updateOne(
        { id: job.id },
        {
          $set: {
            ...jobDoc,
            updated_at: now,
            expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000)
          },
          $setOnInsert: {
            created_at: now
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        stored++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    } catch (error) {
      console.warn(`⚠️ Failed to store job ${job.id}:`, error.message);
    }
  }

  return { success: stored + updated > 0, stored, updated };
}

export async function getCachedJobPostingsMongo(searchParams, cacheDurationMs = 24 * 60 * 60 * 1000) {
  const db = getDB();
  const collection = db.collection('job_postings');

  try {
    const cacheExpiry = new Date(Date.now() - cacheDurationMs);
    const page = Number(searchParams.page || 0);
    const limit = Number(searchParams.pageSize || 10);

    const query = {
      search_keywords: searchParams.keywords,
      country: (searchParams.country || 'us').toLowerCase(),
      created_at: { $gte: cacheExpiry },
      is_active: true
    };

    if (searchParams.location && searchParams.location.trim()) {
      query.search_location = searchParams.location.trim();
    } else {
      query.$or = [
        { search_location: { $exists: false } },
        { search_location: null },
        { search_location: '' }
      ];
    }

    const totalCount = await collection.countDocuments(query);
    if (!totalCount) {
      return null;
    }

    const jobs = await collection
      .find(query)
      .sort({ quality_score: -1, created_at: -1 })
      .skip(page * limit)
      .limit(limit)
      .toArray();

    if (jobs.length === 0) {
      return null;
    }

    const oldestDoc = await collection
      .find(query)
      .sort({ created_at: 1 })
      .limit(1)
      .toArray();

    const cacheAgeMinutes = oldestDoc.length > 0
      ? Math.floor((Date.now() - oldestDoc[0].created_at.getTime()) / 60000)
      : 0;

    return {
      success: true,
      source: 'mongodb_cache',
      query: searchParams.keywords,
      location: searchParams.location,
      jobs: jobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary_display,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        metadata: job.description,
        url: job.url,
        source: job.source,
        contract_type: job.contract_type,
        category: job.category,
        date: job.date_posted ? new Date(job.date_posted).toISOString() : undefined,
        date_posted: job.date_posted,
        quality_score: job.quality_score
      })),
      count: jobs.length,
      total_results: totalCount,
      has_more: (page + 1) * limit < totalCount,
      page,
      cached: true,
      cache_age: cacheAgeMinutes
    };
  } catch (error) {
    console.error("❌ Failed to get cached jobs:", error.message);
    return null;
  }
}

export async function logJobSearchQueryMongo(searchParams, result, userInfo = {}) {
  const db = getDB();
  const collection = db.collection('job_search_queries');

  try {
    await collection.insertOne({
      user_id: userInfo.userId || null,
      user_ip: userInfo.userIp || null,
      keywords: searchParams.keywords,
      location: searchParams.location || null,
      country: (searchParams.country || 'us').toLowerCase(),
      page: searchParams.page || 0,
      results_count: result?.count || 0,
      cache_hit: Boolean(result?.cached),
      response_time_ms: result?.responseTime || 0,
      created_at: new Date()
    });
  } catch (error) {
    console.warn('⚠️ Failed to log MongoDB job search query:', error.message);
  }
}

export async function trackJobInteractionMongo(jobId, interactionType, userInfo = {}, metadata = {}) {
  const db = getDB();
  const interactions = db.collection('job_interactions');
  const postings = db.collection('job_postings');

  try {
    await interactions.insertOne({
      job_id: jobId,
      user_id: userInfo.userId || null,
      user_ip: userInfo.userIp || null,
      interaction_type: interactionType,
      metadata,
      created_at: new Date()
    });

    const incrementField = interactionType === 'click'
      ? { click_count: 1 }
      : interactionType === 'view'
        ? { view_count: 1 }
        : {};

    if (Object.keys(incrementField).length > 0) {
      await postings.updateOne(
        { id: jobId },
        {
          $inc: incrementField,
          $set: { updated_at: new Date() }
        }
      );
    }
  } catch (error) {
    console.warn('⚠️ Failed to track MongoDB job interaction:', error.message);
  }
}

export async function cleanupExpiredJobsMongo() {
  const db = getDB();
  const collection = db.collection('job_postings');

  try {
    const result = await collection.deleteMany({
      expires_at: { $lt: new Date() }
    });
    return result.deletedCount || 0;
  } catch (error) {
    console.warn('⚠️ Failed to cleanup MongoDB job postings:', error.message);
    return 0;
  }
}

// ==================== USER OPERATIONS ====================

export async function storeUserRatingMongo(rating) {
  const db = getDB();
  const collection = db.collection('user_ratings');
  
  const ratingDoc = {
    article_id: rating.articleId,
    user_id: rating.userId,
    user_ip: rating.userIp,
    rel_score: rating.relScore,
    ana_score: rating.anaScore,
    overall_rating: rating.overallRating,
    feedback_text: rating.feedbackText,
    is_helpful: null,
    created_at: new Date()
  };

  await collection.replaceOne(
    { article_id: rating.articleId, user_id: rating.userId },
    ratingDoc,
    { upsert: true }
  );

  return ratingDoc;
}

export async function getUserRatingsMongo(articleId) {
  const db = getDB();
  const collection = db.collection('user_ratings');
  
  try {
    const ratings = await collection.find({ article_id: articleId }).toArray();
    
    if (ratings.length === 0) {
      return { avgRelScore: 0, avgAnaScore: 0, totalRatings: 0 };
    }

    const avgRelScore = ratings.reduce((sum, r) => sum + r.rel_score, 0) / ratings.length;
    const avgAnaScore = ratings.reduce((sum, r) => sum + r.ana_score, 0) / ratings.length;

    return {
      avgRelScore: Math.round(avgRelScore),
      avgAnaScore: Math.round(avgAnaScore),
      totalRatings: ratings.length
    };
  } catch (error) {
    console.error("❌ Failed to get user ratings:", error.message);
    return { avgRelScore: 0, avgAnaScore: 0, totalRatings: 0 };
  }
}

// ==================== ANALYTICS OPERATIONS ====================

export async function trackUserInteractionMongo(interaction) {
  const db = getDB();
  const collection = db.collection('user_interactions');
  
  const interactionDoc = {
    user_id: interaction.userId,
    session_id: interaction.sessionId,
    user_ip: interaction.userIp,
    user_agent: interaction.userAgent,
    interaction_type: interaction.type,
    target_type: interaction.targetType,
    target_id: interaction.targetId,
    metadata: interaction.metadata || {},
    country_context: interaction.countryContext,
    referrer: interaction.referrer,
    duration_seconds: interaction.durationSeconds,
    created_at: new Date()
  };

  await collection.insertOne(interactionDoc);
}

export async function logApiUsageMongo(provider, endpoint, params, response, cost = 0) {
  const db = getDB();
  const collection = db.collection('api_usage_log');
  
  const logDoc = {
    api_provider: provider,
    endpoint: endpoint,
    query_params: params,
    response_status: response.status,
    response_size: JSON.stringify(response.data || {}).length,
    response_time_ms: response.responseTime || 0,
    cost_estimate: cost,
    articles_returned: response.articlesReturned || 0,
    error_message: response.error || null,
    rate_limited: response.rateLimited || false,
    created_at: new Date()
  };

  await collection.insertOne(logDoc);
}

// ==================== MIGRATION UTILITIES ====================

export async function migrateFromPostgreSQL(postgresData) {
  console.log("🔄 Starting PostgreSQL to MongoDB migration...");
  
  const db = getDB();
  let migrated = 0;
  
  // Migrate articles
  if (postgresData.articles && postgresData.articles.length > 0) {
    const collection = db.collection('articles');
    
    for (const article of postgresData.articles) {
      try {
        const mongoDoc = {
          id: article.id,
          title: article.title,
          url: article.url,
          source: article.source,
          author: article.author,
          published_at: new Date(article.published_at),
          description: article.description,
          content: article.content,
          country: article.country,
          category: article.category,
          rel_score: article.rel_score,
          ana_score: article.ana_score,
          created_at: new Date(article.created_at),
          updated_at: new Date()
        };

        await collection.replaceOne(
          { url: article.url },
          mongoDoc,
          { upsert: true }
        );
        
        migrated++;
      } catch (error) {
        console.warn(`⚠️ Failed to migrate article ${article.id}:`, error.message);
      }
    }
  }

  console.log(`✅ Migration complete: ${migrated} records migrated`);
  return { success: true, migrated };
}