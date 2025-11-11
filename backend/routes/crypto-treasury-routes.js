import express from 'express';
const router = express.Router();

// Placeholder route
router.get('/status', (req, res) => {
  res.json({ status: 'Crypto Treasury routes active' });
});

export default router;