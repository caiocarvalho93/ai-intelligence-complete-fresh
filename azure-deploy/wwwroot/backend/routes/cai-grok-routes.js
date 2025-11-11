import express from 'express';
import { 
  requestApprovalFromCaiGrokBrain,
  getCaiGrokAnalytics 
} from '../services/cai-grok-brain.js';

const router = express.Router();

// CAI Grok routes
router.get('/status', (req, res) => {
  res.json({ status: 'CAI Grok routes active' });
});

router.post('/analyze', async (req, res) => {
  try {
    const result = await requestApprovalFromCaiGrokBrain(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const analytics = await getCaiGrokAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;