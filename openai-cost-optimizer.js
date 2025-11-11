// 🚀 OPENAI COST OPTIMIZER - MINIMIZE SPENDING TO MAXIMUM
const fs = require('fs');

class OpenAICostOptimizer {
  constructor() {
    this.maxDailySpend = 5.00; // Maximum $5 per day
    this.currentSpend = 0;
    this.requestCount = 0;
    this.costLog = [];
    this.emergencyStop = false;
  }

  // Calculate cost BEFORE making API call
  calculateCost(prompt, maxTokens = 1000) {
    const inputTokens = Math.ceil(prompt.length / 4); // Rough estimate
    const outputTokens = maxTokens;
    
    // GPT-4 pricing (as of 2024)
    const inputCost = (inputTokens / 1000) * 0.03; // $0.03 per 1K input tokens
    const outputCost = (outputTokens / 1000) * 0.06; // $0.06 per 1K output tokens
    
    return inputCost + outputCost;
  }

  // Check if we can afford this request
  canAfford(estimatedCost) {
    if (this.emergencyStop) {
      console.log("🚨 EMERGENCY STOP: API calls disabled to prevent overspending");
      return false;
    }
    
    if (this.currentSpend + estimatedCost > this.maxDailySpend) {
      console.log(`🚨 COST LIMIT REACHED: Would exceed daily limit of $${this.maxDailySpend}`);
      this.emergencyStop = true;
      return false;
    }
    
    return true;
  }

  // Log actual cost after API call
  logCost(actualCost, tokensUsed) {
    this.currentSpend += actualCost;
    this.requestCount++;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      cost: actualCost,
      totalSpend: this.currentSpend,
      tokensUsed,
      requestNumber: this.requestCount
    };
    
    this.costLog.push(logEntry);
    
    console.log(`💰 API Cost: $${actualCost.toFixed(4)} | Total: $${this.currentSpend.toFixed(2)} | Remaining: $${(this.maxDailySpend - this.currentSpend).toFixed(2)}`);
    
    // Save to file for tracking
    fs.writeFileSync('openai-cost-log.json', JSON.stringify(this.costLog, null, 2));
    
    // Warning at 80% of budget
    if (this.currentSpend > this.maxDailySpend * 0.8) {
      console.log("⚠️ WARNING: 80% of daily budget used!");
    }
  }

  // Get cost-optimized parameters
  getOptimizedParams(prompt) {
    const estimatedCost = this.calculateCost(prompt);
    
    if (!this.canAfford(estimatedCost)) {
      return null; // Don't make the call
    }
    
    return {
      model: "gpt-3.5-turbo", // Cheaper than GPT-4
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500, // Limit output to reduce cost
      temperature: 0.3, // Lower temperature for more focused responses
      top_p: 0.8, // Reduce randomness to get more direct answers
    };
  }

  // Emergency cost-saving mode
  enableEmergencyMode() {
    this.emergencyStop = true;
    console.log("🚨 EMERGENCY MODE: All API calls disabled to prevent overspending");
  }

  // Reset daily budget (call this once per day)
  resetDailyBudget() {
    this.currentSpend = 0;
    this.requestCount = 0;
    this.emergencyStop = false;
    console.log("✅ Daily budget reset");
  }

  // Get current status
  getStatus() {
    return {
      currentSpend: this.currentSpend,
      remainingBudget: this.maxDailySpend - this.currentSpend,
      requestCount: this.requestCount,
      emergencyStop: this.emergencyStop,
      percentUsed: (this.currentSpend / this.maxDailySpend) * 100
    };
  }
}

module.exports = { OpenAICostOptimizer };