/**
 * GROK LEARNING DATABASE - Software Development Intelligence System
 * This system tracks every development move, mistake, and solution
 * to make Grok Brain progressively smarter about our software
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class GrokLearningDatabase {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    this.initializeTables();
  }

  /**
   * Initialize Grok Learning Tables
   */
  async initializeTables() {
    try {
      const client = await this.pool.connect();

      // Development Sessions Table - Track each development session
      await client.query(`
        CREATE TABLE IF NOT EXISTS grok_dev_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          developer_name VARCHAR(255) DEFAULT 'Caio',
          start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end_time TIMESTAMP,
          session_goal TEXT,
          session_outcome TEXT,
          total_tasks INTEGER DEFAULT 0,
          successful_tasks INTEGER DEFAULT 0,
          failed_tasks INTEGER DEFAULT 0,
          lessons_learned TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Development Tasks Table - Track individual tasks and their outcomes
      await client.query(`
        CREATE TABLE IF NOT EXISTS grok_dev_tasks (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) REFERENCES grok_dev_sessions(session_id),
          task_number INTEGER,
          task_description TEXT NOT NULL,
          task_type VARCHAR(100), -- 'fix_bug', 'add_feature', 'optimize', 'debug', etc.
          component_affected VARCHAR(255), -- Which file/component was changed
          problem_encountered TEXT,
          solution_applied TEXT,
          code_changes_summary TEXT,
          success BOOLEAN DEFAULT FALSE,
          time_spent_minutes INTEGER,
          grok_decision JSONB, -- Store Grok's strategic decision
          user_feedback TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Software Architecture Knowledge - Track our software structure
      await client.query(`
        CREATE TABLE IF NOT EXISTS grok_software_knowledge (
          id SERIAL PRIMARY KEY,
          component_name VARCHAR(255) NOT NULL,
          component_type VARCHAR(100), -- 'frontend', 'backend', 'database', 'api', etc.
          file_path TEXT,
          purpose TEXT,
          dependencies TEXT[],
          common_issues TEXT[],
          best_practices TEXT[],
          performance_notes TEXT,
          security_considerations TEXT,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          update_count INTEGER DEFAULT 1
        );
      `);

      // Mistakes and Solutions Database - Learn from every mistake
      await client.query(`
        CREATE TABLE IF NOT EXISTS grok_mistakes_solutions (
          id SERIAL PRIMARY KEY,
          mistake_category VARCHAR(100), -- 'api_integration', 'state_management', 'styling', etc.
          mistake_description TEXT NOT NULL,
          error_message TEXT,
          root_cause TEXT,
          solution_description TEXT NOT NULL,
          code_before TEXT,
          code_after TEXT,
          prevention_strategy TEXT,
          occurrence_count INTEGER DEFAULT 1,
          last_occurred TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          confidence_score INTEGER DEFAULT 50, -- How confident we are in this solution
          tags TEXT[]
        );
      `);

      // Grok Decision History - Track all Grok brain decisions
      await client.query(`
        CREATE TABLE IF NOT EXISTS grok_decision_history (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255),
          task_id INTEGER REFERENCES grok_dev_tasks(id),
          requested_action TEXT NOT NULL,
          business_context JSONB,
          technical_context JSONB,
          grok_decision VARCHAR(50), -- 'approve', 'revise', 'reject', etc.
          grok_rationale TEXT,
          required_changes TEXT[],
          strategic_upgrades TEXT[],
          moat_value VARCHAR(20),
          risk_score INTEGER,
          urgency_score INTEGER,
          actual_outcome TEXT, -- What actually happened
          outcome_success BOOLEAN,
          learning_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Performance Metrics - Track system performance over time
      await client.query(`
        CREATE TABLE IF NOT EXISTS grok_performance_metrics (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255),
          metric_type VARCHAR(100), -- 'api_response_time', 'page_load', 'database_query', etc.
          component_name VARCHAR(255),
          metric_value DECIMAL,
          metric_unit VARCHAR(50), -- 'ms', 'seconds', 'mb', etc.
          baseline_value DECIMAL,
          improvement_percentage DECIMAL,
          measurement_context TEXT,
          measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_grok_dev_sessions_session_id ON grok_dev_sessions(session_id);
        CREATE INDEX IF NOT EXISTS idx_grok_dev_tasks_session_id ON grok_dev_tasks(session_id);
        CREATE INDEX IF NOT EXISTS idx_grok_dev_tasks_component ON grok_dev_tasks(component_affected);
        CREATE INDEX IF NOT EXISTS idx_grok_software_knowledge_component ON grok_software_knowledge(component_name);
        CREATE INDEX IF NOT EXISTS idx_grok_mistakes_category ON grok_mistakes_solutions(mistake_category);
        CREATE INDEX IF NOT EXISTS idx_grok_decision_history_session ON grok_decision_history(session_id);
        CREATE INDEX IF NOT EXISTS idx_grok_performance_metrics_type ON grok_performance_metrics(metric_type);
      `);

      client.release();
      console.log('✅ Grok Learning Database initialized successfully');

      // Initialize with current software knowledge
      await this.initializeSoftwareKnowledge();

    } catch (error) {
      console.error('❌ Failed to initialize Grok Learning Database:', error);
    }
  }

  /**
   * Start a new development session
   */
  async startDevelopmentSession(goal, developerName = 'Caio') {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const client = await this.pool.connect();
      await client.query(`
        INSERT INTO grok_dev_sessions (session_id, developer_name, session_goal)
        VALUES ($1, $2, $3)
      `, [sessionId, developerName, goal]);
      client.release();

      console.log(`🧠 Grok Learning: Started session ${sessionId} - Goal: ${goal}`);
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to start development session:', error);
      return null;
    }
  }

  /**
   * Log a development task
   */
  async logDevelopmentTask(sessionId, taskData) {
    try {
      const {
        taskNumber,
        description,
        type,
        componentAffected,
        problemEncountered,
        solutionApplied,
        codeChangesSummary,
        success,
        timeSpentMinutes,
        grokDecision,
        userFeedback
      } = taskData;

      const client = await this.pool.connect();
      const result = await client.query(`
        INSERT INTO grok_dev_tasks (
          session_id, task_number, task_description, task_type, component_affected,
          problem_encountered, solution_applied, code_changes_summary, success,
          time_spent_minutes, grok_decision, user_feedback
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `, [
        sessionId, taskNumber, description, type, componentAffected,
        problemEncountered, solutionApplied, codeChangesSummary, success,
        timeSpentMinutes, JSON.stringify(grokDecision), userFeedback
      ]);
      client.release();

      console.log(`🧠 Grok Learning: Logged task ${taskNumber} - ${success ? 'SUCCESS' : 'FAILED'}`);
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Failed to log development task:', error);
      return null;
    }
  }

  /**
   * Record a mistake and its solution
   */
  async recordMistakeAndSolution(mistakeData) {
    try {
      const {
        category,
        description,
        errorMessage,
        rootCause,
        solution,
        codeBefore,
        codeAfter,
        preventionStrategy,
        tags = []
      } = mistakeData;

      const client = await this.pool.connect();
      
      // Check if this mistake already exists
      const existing = await client.query(`
        SELECT id, occurrence_count FROM grok_mistakes_solutions 
        WHERE mistake_description = $1 AND mistake_category = $2
      `, [description, category]);

      if (existing.rows.length > 0) {
        // Update existing mistake
        await client.query(`
          UPDATE grok_mistakes_solutions 
          SET occurrence_count = occurrence_count + 1, 
              last_occurred = CURRENT_TIMESTAMP,
              solution_description = $1,
              prevention_strategy = $2
          WHERE id = $3
        `, [solution, preventionStrategy, existing.rows[0].id]);
        
        console.log(`🧠 Grok Learning: Updated existing mistake (occurrence #${existing.rows[0].occurrence_count + 1})`);
      } else {
        // Insert new mistake
        await client.query(`
          INSERT INTO grok_mistakes_solutions (
            mistake_category, mistake_description, error_message, root_cause,
            solution_description, code_before, code_after, prevention_strategy, tags
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [category, description, errorMessage, rootCause, solution, codeBefore, codeAfter, preventionStrategy, tags]);
        
        console.log(`🧠 Grok Learning: Recorded new mistake and solution`);
      }
      
      client.release();
    } catch (error) {
      console.error('❌ Failed to record mistake and solution:', error);
    }
  }

  /**
   * Update software component knowledge
   */
  async updateSoftwareKnowledge(componentData) {
    try {
      const {
        name,
        type,
        filePath,
        purpose,
        dependencies = [],
        commonIssues = [],
        bestPractices = [],
        performanceNotes,
        securityConsiderations
      } = componentData;

      const client = await this.pool.connect();
      
      // Upsert component knowledge
      await client.query(`
        INSERT INTO grok_software_knowledge (
          component_name, component_type, file_path, purpose, dependencies,
          common_issues, best_practices, performance_notes, security_considerations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (component_name) DO UPDATE SET
          component_type = EXCLUDED.component_type,
          file_path = EXCLUDED.file_path,
          purpose = EXCLUDED.purpose,
          dependencies = EXCLUDED.dependencies,
          common_issues = EXCLUDED.common_issues,
          best_practices = EXCLUDED.best_practices,
          performance_notes = EXCLUDED.performance_notes,
          security_considerations = EXCLUDED.security_considerations,
          last_updated = CURRENT_TIMESTAMP,
          update_count = grok_software_knowledge.update_count + 1
      `, [name, type, filePath, purpose, dependencies, commonIssues, bestPractices, performanceNotes, securityConsiderations]);
      
      client.release();
      console.log(`🧠 Grok Learning: Updated knowledge for ${name}`);
    } catch (error) {
      console.error('❌ Failed to update software knowledge:', error);
    }
  }

  /**
   * Log Grok decision and track its outcome
   */
  async logGrokDecision(decisionData) {
    try {
      const {
        sessionId,
        taskId,
        requestedAction,
        businessContext,
        technicalContext,
        grokDecision,
        grokRationale,
        requiredChanges = [],
        strategicUpgrades = [],
        moatValue,
        riskScore,
        urgencyScore
      } = decisionData;

      const client = await this.pool.connect();
      const result = await client.query(`
        INSERT INTO grok_decision_history (
          session_id, task_id, requested_action, business_context, technical_context,
          grok_decision, grok_rationale, required_changes, strategic_upgrades,
          moat_value, risk_score, urgency_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `, [
        sessionId, taskId, requestedAction, JSON.stringify(businessContext), JSON.stringify(technicalContext),
        grokDecision, grokRationale, requiredChanges, strategicUpgrades,
        moatValue, riskScore, urgencyScore
      ]);
      client.release();

      console.log(`🧠 Grok Learning: Logged decision ${grokDecision} for ${requestedAction}`);
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Failed to log Grok decision:', error);
      return null;
    }
  }

  /**
   * Get Grok's accumulated knowledge about a specific component
   */
  async getComponentKnowledge(componentName) {
    try {
      const client = await this.pool.connect();
      
      // Get component knowledge
      const knowledge = await client.query(`
        SELECT * FROM grok_software_knowledge WHERE component_name = $1
      `, [componentName]);

      // Get related tasks
      const tasks = await client.query(`
        SELECT task_description, problem_encountered, solution_applied, success
        FROM grok_dev_tasks WHERE component_affected = $1
        ORDER BY created_at DESC LIMIT 10
      `, [componentName]);

      // Get related mistakes
      const mistakes = await client.query(`
        SELECT mistake_description, solution_description, occurrence_count
        FROM grok_mistakes_solutions WHERE $1 = ANY(tags)
        ORDER BY occurrence_count DESC LIMIT 5
      `, [componentName]);

      client.release();

      return {
        knowledge: knowledge.rows[0] || null,
        recentTasks: tasks.rows,
        commonMistakes: mistakes.rows
      };
    } catch (error) {
      console.error('❌ Failed to get component knowledge:', error);
      return null;
    }
  }

  /**
   * Initialize with current software knowledge
   */
  async initializeSoftwareKnowledge() {
    const components = [
      {
        name: 'UniversalLanguageButton',
        type: 'frontend_component',
        filePath: 'frontend/src/components/UniversalLanguageButton.jsx',
        purpose: 'Global language selection and translation interface',
        dependencies: ['LanguageContext', 'framer-motion'],
        commonIssues: ['Flag not updating with language changes', 'Duplicate emoji definitions'],
        bestPractices: ['Single emoji definition', 'Proper useEffect for language changes', 'Debug logging'],
        performanceNotes: 'Lightweight component with efficient re-renders',
        securityConsiderations: 'No security risks - UI component only'
      },
      {
        name: 'JobSearchButton',
        type: 'frontend_component',
        filePath: 'frontend/src/components/JobSearchButton.jsx',
        purpose: 'Job search interface with Adzuna API integration',
        dependencies: ['Adzuna API', 'framer-motion'],
        commonIssues: ['API URL configuration', 'CORS issues', 'Rate limiting'],
        bestPractices: ['Full API URLs', 'Error handling', 'Loading states'],
        performanceNotes: 'Caching implemented for better performance',
        securityConsiderations: 'API key protection, input validation'
      },
      {
        name: 'TranslationService',
        type: 'backend_service',
        filePath: 'backend/services/translation-service.js',
        purpose: 'AI-powered translation with OpenAI and DeepSeek integration',
        dependencies: ['OpenAI API', 'DeepSeek API', 'PostgreSQL'],
        commonIssues: ['Rate limiting', 'API key configuration', 'Fallback handling'],
        bestPractices: ['Multiple AI providers', 'Caching', 'Graceful fallbacks'],
        performanceNotes: 'Database caching reduces API calls',
        securityConsiderations: 'API key protection, input sanitization'
      },
      {
        name: 'GrokBrain',
        type: 'backend_service',
        filePath: 'backend/services/cai-grok-brain.js',
        purpose: 'Strategic intelligence and decision-making system',
        dependencies: ['Grok API', 'PostgreSQL'],
        commonIssues: ['API connectivity', 'Decision logging', 'Strategic analysis'],
        bestPractices: ['Enhanced local intelligence', 'Decision tracking', 'Strategic heuristics'],
        performanceNotes: 'Intelligent fallback when API unavailable',
        securityConsiderations: 'Strategic decision audit trail'
      }
    ];

    for (const component of components) {
      await this.updateSoftwareKnowledge(component);
    }
  }

  /**
   * Get Grok's learning summary for better decision making
   */
  async getLearningSummary() {
    try {
      const client = await this.pool.connect();
      
      const summary = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM grok_dev_sessions) as total_sessions,
          (SELECT COUNT(*) FROM grok_dev_tasks) as total_tasks,
          (SELECT COUNT(*) FROM grok_dev_tasks WHERE success = true) as successful_tasks,
          (SELECT COUNT(*) FROM grok_mistakes_solutions) as unique_mistakes,
          (SELECT SUM(occurrence_count) FROM grok_mistakes_solutions) as total_mistake_occurrences,
          (SELECT COUNT(*) FROM grok_software_knowledge) as components_tracked,
          (SELECT COUNT(*) FROM grok_decision_history) as decisions_made
      `);

      const recentLessons = await client.query(`
        SELECT task_description, problem_encountered, solution_applied
        FROM grok_dev_tasks 
        WHERE success = true AND solution_applied IS NOT NULL
        ORDER BY created_at DESC LIMIT 5
      `);

      const topMistakes = await client.query(`
        SELECT mistake_category, mistake_description, occurrence_count, solution_description
        FROM grok_mistakes_solutions 
        ORDER BY occurrence_count DESC LIMIT 5
      `);

      client.release();

      return {
        stats: summary.rows[0],
        recentLessons: recentLessons.rows,
        topMistakes: topMistakes.rows
      };
    } catch (error) {
      console.error('❌ Failed to get learning summary:', error);
      return null;
    }
  }
}

// Export singleton instance
export const grokLearningDB = new GrokLearningDatabase();
export default GrokLearningDatabase;