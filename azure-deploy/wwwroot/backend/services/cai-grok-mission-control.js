// Cai-Grok Mission Control - NASA-Grade Engineering Control Center
// This is the deterministic executive intelligence core with full audit trail

import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-4-latest";

// NASA-grade decision contract schema
const DECISION_CONTRACT_SCHEMA = {
  type: "object",
  required: ["actor", "request_id", "timestamp", "requested_action", "business_context", "technical_context", "safety_context", "urgency"],
  properties: {
    actor: { type: "string" },
    request_id: { type: "string" },
    timestamp: { type: "string", format: "date-time" },
    requested_action: { type: "string" },
    business_context: { type: "object" },
    technical_context: { type: "object" },
    safety_context: { type: "object" },
    urgency: { type: "string", enum: ["low", "medium", "high", "critical"] },
    reasoning_mode: { type: "string", enum: ["strategic", "crisis", "innovation", "investor"] },
    human_override_token: { type: "string" }
  }
};

// Expected Grok output format (enforced)
const GROK_OUTPUT_SCHEMA = {
  type: "object",
  required: ["decision", "rationale", "risk_score", "moat_value", "urgency_score"],
  properties: {
    decision: { type: "string", enum: ["approve", "revise", "reject"] },
    rationale: { type: "string" },
    required_changes: { type: "array", items: { type: "string" } },
    strategic_upgrades: { type: "array", items: { type: "string" } },
    moat_value: { type: "string", enum: ["low", "medium", "high"] },
    risk_score: { type: "number", minimum: 0, maximum: 100 },
    urgency_score: { type: "number", minimum: 0, maximum: 100 },
    cost_estimate_usd: { type: "number", minimum: 0 },
    estimated_execution_steps: { type: "array", items: { type: "string" } },
    simulated_outcome_summary: { type: "string" },
    references: { type: "array", items: { type: "string" } }
  }
};

/**
 * NASA-Grade Cai-Grok Brain with deterministic contracts
 */
export class CaiGrokMissionControl {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.isOnline = !!this.apiKey;
    this.requestCount = 0;
    this.totalCost = 0;
    this.startTime = Date.now();
  }

  /**
   * Validate decision request against NASA-grade contract
   */
  validateDecisionRequest(request) {
    const errors = [];
    
    // Check required fields
    DECISION_CONTRACT_SCHEMA.required.forEach(field => {
      if (!request[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate urgency enum
    if (request.urgency && !DECISION_CONTRACT_SCHEMA.properties.urgency.enum.includes(request.urgency)) {
      errors.push(`Invalid urgency level: ${request.urgency}`);
    }

    // Validate reasoning mode if provided
    if (request.reasoning_mode && !DECISION_CONTRACT_SCHEMA.properties.reasoning_mode.enum.includes(request.reasoning_mode)) {
      errors.push(`Invalid reasoning mode: ${request.reasoning_mode}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate Grok response against expected schema
   */
  validateGrokResponse(response) {
    const errors = [];
    
    // Check required fields
    GROK_OUTPUT_SCHEMA.required.forEach(field => {
      if (response[field] === undefined || response[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate decision enum
    if (response.decision && !GROK_OUTPUT_SCHEMA.properties.decision.enum.includes(response.decision)) {
      errors.push(`Invalid decision: ${response.decision}`);
    }

    // Validate risk score range
    if (typeof response.risk_score === 'number' && (response.risk_score < 0 || response.risk_score > 100)) {
      errors.push(`Risk score out of range: ${response.risk_score}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate cryptographic signature for audit trail
   */
  generateAuditSignature(data) {
    const secret = process.env.AUDIT_SECRET || 'default-secret-change-in-production';
    return crypto.createHmac('sha256', secret).update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Get system prompt based on reasoning mode
   */
  getSystemPrompt(reasoningMode = 'strategic') {
    const basePrompt = [
      "You are the Cai-Grok Brain - the deterministic executive intelligence core of Caio's platform.",
      "You are NASA-grade: every decision must be precise, auditable, and strategically optimal.",
      "",
      "Core Mission:",
      "- Maximize long-term platform survivability and market dominance",
      "- Detect and prevent technical debt, vendor lock-in, and scaling bottlenecks", 
      "- Build defensible moats through unique capabilities and data advantages",
      "- Optimize for revenue growth, user retention, and competitive differentiation",
      "",
      "Decision Framework:",
      "- Architecture: Will this scale to millions of users?",
      "- Business: Does this drive revenue or competitive advantage?",
      "- Risk: What could go wrong and how do we mitigate?",
      "- Moat: Does this make us harder to replicate?",
      "- Cost: What are the financial implications?",
      ""
    ];

    const modeSpecificPrompts = {
      strategic: [
        "STRATEGIC MODE: Focus on long-term competitive positioning and business value.",
        "Prioritize decisions that build lasting advantages and market leadership."
      ],
      crisis: [
        "CRISIS MODE: Focus on immediate containment and system stability.",
        "Prioritize rapid resolution while maintaining data integrity and user trust."
      ],
      innovation: [
        "INNOVATION MODE: Focus on disruptive opportunities and breakthrough features.",
        "Prioritize bold moves that could create new market categories."
      ],
      investor: [
        "INVESTOR MODE: Focus on metrics and narratives that demonstrate growth potential.",
        "Prioritize decisions that strengthen fundraising and valuation arguments."
      ]
    };

    const outputFormat = [
      "",
      "CRITICAL: You MUST respond with valid JSON matching this exact schema:",
      JSON.stringify(GROK_OUTPUT_SCHEMA, null, 2),
      "",
      "If you cannot provide a complete response, return decision='reject' with rationale explaining why."
    ];

    return [
      ...basePrompt,
      ...modeSpecificPrompts[reasoningMode],
      ...outputFormat
    ].join(" ");
  }

  /**
   * Execute strategic decision with full NASA-grade oversight
   */
  async executeStrategicDecision(decisionRequest) {
    const startTime = Date.now();
    const requestId = decisionRequest.request_id || uuidv4();
    
    // Step 1: Validate input contract
    const validation = this.validateDecisionRequest(decisionRequest);
    if (!validation.valid) {
      throw new Error(`Invalid decision request: ${validation.errors.join(', ')}`);
    }

    // Step 2: Prepare audit record
    const auditRecord = {
      id: uuidv4(),
      request_id: requestId,
      actor: decisionRequest.actor,
      timestamp: new Date().toISOString(),
      request_payload: decisionRequest,
      status: 'processing',
      created_at: new Date().toISOString()
    };

    try {
      // Step 3: Call Grok API with enhanced context
      const grokResponse = await this.callGrokAPI(decisionRequest);
      
      // Step 4: Validate Grok response
      const responseValidation = this.validateGrokResponse(grokResponse);
      if (!responseValidation.valid) {
        throw new Error(`Invalid Grok response: ${responseValidation.errors.join(', ')}`);
      }

      // Step 5: Apply safety checks
      const safetyCheck = this.applySafetyChecks(grokResponse, decisionRequest);
      
      // Step 6: Update audit record
      auditRecord.grok_response = grokResponse;
      auditRecord.decision_text = grokResponse.decision;
      auditRecord.risk_score = grokResponse.risk_score;
      auditRecord.moat_value = grokResponse.moat_value;
      auditRecord.status = safetyCheck.allowed ? 'approved' : 'blocked';
      auditRecord.processing_time_ms = Date.now() - startTime;
      auditRecord.signature = this.generateAuditSignature(auditRecord);

      // Step 7: Store audit record
      await this.storeAuditRecord(auditRecord);

      // Step 8: Update telemetry
      this.updateTelemetry(grokResponse, Date.now() - startTime);

      return {
        success: true,
        request_id: requestId,
        decision: grokResponse,
        safety_check: safetyCheck,
        audit_record: auditRecord,
        processing_time_ms: Date.now() - startTime
      };

    } catch (error) {
      // Error handling with audit trail
      auditRecord.status = 'error';
      auditRecord.error_message = error.message;
      auditRecord.processing_time_ms = Date.now() - startTime;
      auditRecord.signature = this.generateAuditSignature(auditRecord);
      
      await this.storeAuditRecord(auditRecord);
      
      throw error;
    }
  }

  /**
   * Call Grok API with enhanced context and search
   */
  async callGrokAPI(decisionRequest) {
    if (!this.isOnline) {
      return this.getOfflineFallback();
    }

    const systemPrompt = this.getSystemPrompt(decisionRequest.reasoning_mode);
    
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user", 
        content: JSON.stringify(decisionRequest, null, 2)
      }
    ];

    const requestBody = {
      model: GROK_MODEL,
      messages,
      search_parameters: {
        mode: "auto" // Enable live search for real-time context
      },
      temperature: 0.1, // Low temperature for deterministic responses
      max_tokens: 2000
    };

    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Grok API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Parse and validate JSON response
    let parsedResponse;
    try {
      const content = data.choices[0].message.content;
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Grok returned invalid JSON: ${parseError.message}`);
    }

    return parsedResponse;
  }

  /**
   * Apply NASA-grade safety checks
   */
  applySafetyChecks(grokResponse, decisionRequest) {
    const checks = [];
    let allowed = true;
    let requiresHumanReview = false;

    // Risk threshold check
    if (grokResponse.risk_score >= 80) {
      checks.push("HIGH_RISK_DETECTED");
      requiresHumanReview = true;
      if (grokResponse.risk_score >= 95) {
        allowed = false;
        checks.push("CRITICAL_RISK_BLOCKED");
      }
    }

    // Cost threshold check
    if (grokResponse.cost_estimate_usd > 1000) {
      checks.push("HIGH_COST_DETECTED");
      requiresHumanReview = true;
    }

    // Critical urgency check
    if (decisionRequest.urgency === 'critical' && grokResponse.decision === 'reject') {
      checks.push("CRITICAL_URGENCY_REJECTED");
      requiresHumanReview = true;
    }

    // Human override token check
    if (decisionRequest.human_override_token && this.validateOverrideToken(decisionRequest.human_override_token)) {
      allowed = true;
      requiresHumanReview = false;
      checks.push("HUMAN_OVERRIDE_APPLIED");
    }

    return {
      allowed,
      requiresHumanReview,
      checks,
      reasoning: checks.length > 0 ? `Safety checks triggered: ${checks.join(', ')}` : "All safety checks passed"
    };
  }

  /**
   * Validate human override token
   */
  validateOverrideToken(token) {
    // In production, this would validate against a secure token store
    // For now, accept a specific format: "OVERRIDE_CAIO_" + timestamp within last hour
    if (!token.startsWith('OVERRIDE_CAIO_')) return false;
    
    const timestamp = parseInt(token.split('_')[2]);
    const hourAgo = Date.now() - (60 * 60 * 1000);
    
    return timestamp > hourAgo;
  }

  /**
   * Get offline fallback response
   */
  getOfflineFallback() {
    return {
      decision: "revise",
      rationale: "Cai-Grok Brain offline - manual review required for strategic decisions",
      required_changes: ["Manual strategic review required - Grok API unavailable"],
      strategic_upgrades: ["Implement offline decision capabilities", "Add local AI fallback"],
      moat_value: "unknown",
      risk_score: 75,
      urgency_score: 25,
      cost_estimate_usd: 0,
      estimated_execution_steps: ["Wait for Grok API restoration", "Manual review process"],
      simulated_outcome_summary: "Cannot simulate - offline mode",
      references: []
    };
  }

  /**
   * Store audit record in database
   */
  async storeAuditRecord(auditRecord) {
    try {
      const { storeAuditRecord } = await import('../database.js');
      await storeAuditRecord(auditRecord);
    } catch (error) {
      console.error('Failed to store audit record:', error.message);
      // Don't throw - audit failure shouldn't block decisions
    }
  }

  /**
   * Update telemetry metrics
   */
  updateTelemetry(grokResponse, processingTimeMs) {
    this.requestCount++;
    this.totalCost += grokResponse.cost_estimate_usd || 0;
    
    // Store metrics for Prometheus/Grafana
    const metrics = {
      timestamp: new Date().toISOString(),
      request_count: this.requestCount,
      processing_time_ms: processingTimeMs,
      decision_type: grokResponse.decision,
      risk_score: grokResponse.risk_score,
      moat_value: grokResponse.moat_value,
      cost_usd: grokResponse.cost_estimate_usd || 0,
      total_cost_usd: this.totalCost
    };

    // In production, send to metrics collector
    console.log('📊 Cai-Grok Telemetry:', metrics);
  }

  /**
   * Get mission control status
   */
  getMissionControlStatus() {
    const uptimeMs = Date.now() - this.startTime;
    
    return {
      status: this.isOnline ? "OPERATIONAL" : "OFFLINE",
      uptime_ms: uptimeMs,
      uptime_hours: Math.round(uptimeMs / (1000 * 60 * 60) * 100) / 100,
      total_requests: this.requestCount,
      total_cost_usd: this.totalCost,
      avg_cost_per_request: this.requestCount > 0 ? this.totalCost / this.requestCount : 0,
      api_key_configured: !!this.apiKey,
      model: GROK_MODEL,
      capabilities: [
        "Strategic decision oversight",
        "Risk assessment and scoring",
        "Moat value analysis", 
        "Business impact evaluation",
        "Technical debt detection",
        "Competitive advantage optimization",
        "NASA-grade audit trail",
        "Deterministic contracts",
        "Safety circuit breakers",
        "Human override system"
      ]
    };
  }
}

// Singleton instance
export const missionControl = new CaiGrokMissionControl();

// Legacy compatibility exports
export async function askCaiGrokBrain(payload) {
  // Convert legacy payload to NASA-grade contract
  const decisionRequest = {
    actor: payload.actor || "Legacy System",
    request_id: uuidv4(),
    timestamp: new Date().toISOString(),
    requested_action: payload.requested_action || "Legacy Action",
    business_context: {
      goal: payload.business_goal,
      success_criteria: payload.what_success_looks_like
    },
    technical_context: payload.technical_context || {},
    safety_context: {
      constraints: payload.constraints_we_know_about,
      risks: payload.long_term_risks_we_fear
    },
    urgency: "medium",
    reasoning_mode: "strategic"
  };

  const result = await missionControl.executeStrategicDecision(decisionRequest);
  return result.decision;
}