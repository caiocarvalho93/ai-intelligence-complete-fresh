/**
 * GROK LEARNING API ROUTES
 * Expose the Grok Learning Database for development intelligence
 */

import express from 'express';
import { grokLearningDB } from '../services/grok-learning-database.js';

const router = express.Router();

/**
 * POST /api/grok-learning/session/start - Start a new development session
 */
router.post('/session/start', async (req, res) => {
  try {
    const { goal, developerName } = req.body;
    
    if (!goal) {
      return res.status(400).json({
        success: false,
        error: 'Session goal is required'
      });
    }

    const sessionId = await grokLearningDB.startDevelopmentSession(goal, developerName);
    
    res.json({
      success: true,
      sessionId,
      message: 'Development session started',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start development session',
      details: error.message
    });
  }
});

/**
 * POST /api/grok-learning/task/log - Log a development task
 */
router.post('/task/log', async (req, res) => {
  try {
    const { sessionId, taskData } = req.body;
    
    if (!sessionId || !taskData) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and task data are required'
      });
    }

    const taskId = await grokLearningDB.logDevelopmentTask(sessionId, taskData);
    
    res.json({
      success: true,
      taskId,
      message: 'Development task logged',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to log development task',
      details: error.message
    });
  }
});

/**
 * POST /api/grok-learning/mistake/record - Record a mistake and solution
 */
router.post('/mistake/record', async (req, res) => {
  try {
    const mistakeData = req.body;
    
    if (!mistakeData.description || !mistakeData.solution) {
      return res.status(400).json({
        success: false,
        error: 'Mistake description and solution are required'
      });
    }

    await grokLearningDB.recordMistakeAndSolution(mistakeData);
    
    res.json({
      success: true,
      message: 'Mistake and solution recorded',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record mistake and solution',
      details: error.message
    });
  }
});

/**
 * POST /api/grok-learning/knowledge/update - Update software component knowledge
 */
router.post('/knowledge/update', async (req, res) => {
  try {
    const componentData = req.body;
    
    if (!componentData.name) {
      return res.status(400).json({
        success: false,
        error: 'Component name is required'
      });
    }

    await grokLearningDB.updateSoftwareKnowledge(componentData);
    
    res.json({
      success: true,
      message: 'Software knowledge updated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update software knowledge',
      details: error.message
    });
  }
});

/**
 * GET /api/grok-learning/knowledge/:component - Get component knowledge
 */
router.get('/knowledge/:component', async (req, res) => {
  try {
    const { component } = req.params;
    const knowledge = await grokLearningDB.getComponentKnowledge(component);
    
    res.json({
      success: true,
      component,
      knowledge,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get component knowledge',
      details: error.message
    });
  }
});

/**
 * GET /api/grok-learning/summary - Get learning summary
 */
router.get('/summary', async (req, res) => {
  try {
    const summary = await grokLearningDB.getLearningSummary();
    
    res.json({
      success: true,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get learning summary',
      details: error.message
    });
  }
});

/**
 * POST /api/grok-learning/decision/log - Log Grok decision
 */
router.post('/decision/log', async (req, res) => {
  try {
    const decisionData = req.body;
    
    if (!decisionData.requestedAction || !decisionData.grokDecision) {
      return res.status(400).json({
        success: false,
        error: 'Requested action and Grok decision are required'
      });
    }

    const decisionId = await grokLearningDB.logGrokDecision(decisionData);
    
    res.json({
      success: true,
      decisionId,
      message: 'Grok decision logged',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to log Grok decision',
      details: error.message
    });
  }
});

/**
 * GET /api/grok-learning/health - Health check for learning system
 */
router.get('/health', async (req, res) => {
  try {
    const summary = await grokLearningDB.getLearningSummary();
    
    res.json({
      success: true,
      service: 'Grok Learning Database',
      status: 'OPERATIONAL',
      stats: summary?.stats || {},
      features: [
        'Development session tracking',
        'Task outcome logging',
        'Mistake and solution database',
        'Software component knowledge',
        'Grok decision history',
        'Performance metrics tracking'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Grok Learning Database health check failed',
      details: error.message
    });
  }
});

export default router;