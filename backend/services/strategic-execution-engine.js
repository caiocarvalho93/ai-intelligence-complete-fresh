// Strategic Execution Engine - Where Kiro meets Cai-Grok Brain
// This is the enforcement layer that makes every action go through the brain

import { 
  requestApprovalFromCaiGrokBrain, 
  logCaiGrokDecision 
} from './cai-grok-brain.js';

/**
 * Strategic Task Executor - The core execution loop with Cai-Grok oversight
 * Every major system change flows through this intelligence gateway
 */
export async function executeStrategicTask(taskDefinition) {
  const {
    action,
    description,
    businessGoal,
    technicalContext,
    constraints,
    longTermRisks,
    successCriteria,
    executor // The actual function to execute
  } = taskDefinition;

  console.log(`🧠 Strategic Task: ${action}`);
  console.log(`📋 Description: ${description}`);

  let caiGrokDecision = null;
  let executionResult = null;

  try {
    // Step 1: Get approval from Cai-Grok Brain
    console.log("🔍 Requesting Cai-Grok Brain approval...");
    
    const approval = await requestApprovalFromCaiGrokBrain({
      requestedAction: `${action}: ${description}`,
      businessGoal,
      technicalContext,
      constraints,
      longTermRisks,
      successCriteria
    });

    caiGrokDecision = approval.details;

    // Step 2: Enforce Cai-Grok Brain ruling
    if (approval.status === "revise") {
      console.log("⚠️ Cai-Grok Brain requires revision:");
      console.log("📝 Required changes:", approval.details.required_changes);
      console.log("⚠️ Warnings:", approval.details.warnings);
      console.log("🚀 Strategic upgrades:", approval.details.strategic_upgrades);

      return {
        executed: false,
        status: "revision_required",
        caiGrokFeedback: approval.details,
        message: "Cai-Grok Brain blocked execution - revision required",
        nextSteps: approval.details.required_changes
      };
    }

    if (approval.status === "high_risk") {
      console.log("🚨 Cai-Grok Brain flagged HIGH RISK - manual review required");
      
      return {
        executed: false,
        status: "high_risk_blocked",
        caiGrokFeedback: approval.details,
        message: `High risk action blocked (risk score: ${approval.details.risk_score})`,
        requiresManualApproval: true
      };
    }

    // Step 3: Execute with Cai-Grok Brain approval
    console.log("✅ Cai-Grok Brain APPROVED - executing with strategic guidance");
    console.log(`📊 Risk Score: ${approval.details.risk_score}/100`);
    console.log(`🏰 Moat Value: ${approval.details.moat_value}`);
    console.log(`⚡ Urgency: ${approval.details.urgency_score}/100`);

    if (approval.details.strategic_upgrades.length > 0) {
      console.log("🚀 Strategic upgrades suggested:");
      approval.details.strategic_upgrades.forEach((upgrade, i) => {
        console.log(`   ${i + 1}. ${upgrade}`);
      });
    }

    // Execute the actual task
    if (executor && typeof executor === 'function') {
      console.log("⚙️ Executing approved task...");
      executionResult = await executor();
      console.log("✅ Task execution completed");
    } else {
      console.log("📋 Task approved but no executor provided");
      executionResult = { success: true, message: "Approved by Cai-Grok Brain" };
    }

    return {
      executed: true,
      status: "success",
      caiGrokFeedback: approval.details,
      executionResult,
      message: "Task completed with Cai-Grok Brain oversight",
      strategicValue: {
        riskScore: approval.details.risk_score,
        moatValue: approval.details.moat_value,
        urgencyScore: approval.details.urgency_score,
        strategicUpgrades: approval.details.strategic_upgrades
      }
    };

  } catch (error) {
    console.error("❌ Strategic execution failed:", error.message);

    return {
      executed: false,
      status: "execution_failed",
      error: error.message,
      caiGrokFeedback: caiGrokDecision,
      message: "Task execution failed despite Cai-Grok approval"
    };

  } finally {
    // Always log the decision for audit trail
    if (caiGrokDecision) {
      await logCaiGrokDecision(
        `${action}: ${description}`,
        caiGrokDecision,
        executionResult
      );
    }
  }
}

/**
 * Database Operation with Strategic Oversight
 * All database changes go through Cai-Grok Brain
 */
export async function executeStrategicDatabaseOperation(operation) {
  return await executeStrategicTask({
    action: "Database Operation",
    description: operation.description,
    businessGoal: operation.businessGoal || "Maintain data integrity and optimize performance",
    technicalContext: {
      services: ["postgresql-database", "data-migration-service"],
      databases: operation.affectedTables || ["unknown"],
      infra: {
        database_type: "PostgreSQL",
        environment: process.env.NODE_ENV || "development"
      }
    },
    constraints: [
      "Cannot lose existing data",
      "Must maintain ACID compliance",
      "Minimize downtime during migration",
      "Respect PostgreSQL 500MB limit"
    ],
    longTermRisks: [
      "Data corruption during migration",
      "Performance degradation with scale",
      "Schema changes breaking existing code",
      "Backup/recovery complexity"
    ],
    successCriteria: [
      "Data integrity maintained 100%",
      "Query performance improved or maintained",
      "Zero data loss during operation",
      "Backward compatibility preserved"
    ],
    executor: operation.executor
  });
}

/**
 * API Integration with Strategic Oversight
 * All external API integrations reviewed by Cai-Grok Brain
 */
export async function executeStrategicAPIIntegration(integration) {
  return await executeStrategicTask({
    action: "API Integration",
    description: integration.description,
    businessGoal: integration.businessGoal || "Enhance platform capabilities through external services",
    technicalContext: {
      services: ["api-integration-layer", "external-service-proxy"],
      apis: integration.externalAPIs || ["unknown-api"],
      infra: {
        rate_limits: integration.rateLimits || "unknown",
        authentication: integration.authType || "unknown"
      }
    },
    constraints: [
      "API rate limits must be respected",
      "API keys must never be exposed to frontend",
      "Graceful degradation when API is unavailable",
      "Cost control for paid APIs"
    ],
    longTermRisks: [
      "Vendor lock-in to external service",
      "API deprecation breaking functionality",
      "Cost explosion with scale",
      "Data privacy compliance issues"
    ],
    successCriteria: [
      "Reliable integration with fallback handling",
      "Cost-effective usage within budget",
      "Enhanced user experience",
      "Maintainable and testable code"
    ],
    executor: integration.executor
  });
}

/**
 * Feature Development with Strategic Oversight
 * All new features reviewed by Cai-Grok Brain for strategic value
 */
export async function executeStrategicFeatureDevelopment(feature) {
  return await executeStrategicTask({
    action: "Feature Development",
    description: feature.description,
    businessGoal: feature.businessGoal || "Increase user engagement and platform value",
    technicalContext: {
      services: feature.affectedServices || ["frontend", "backend"],
      components: feature.newComponents || [],
      infra: {
        deployment_impact: feature.deploymentImpact || "low",
        performance_impact: feature.performanceImpact || "minimal"
      }
    },
    constraints: [
      "Must maintain existing functionality",
      "Performance impact must be minimal",
      "UI/UX must remain intuitive",
      "Mobile responsiveness required"
    ],
    longTermRisks: [
      "Feature bloat reducing core value proposition",
      "Technical debt from rushed implementation",
      "User confusion from complex interfaces",
      "Maintenance burden increasing over time"
    ],
    successCriteria: [
      "Clear user value proposition",
      "Measurable improvement in key metrics",
      "Positive user feedback and adoption",
      "Maintainable and extensible code"
    ],
    executor: feature.executor
  });
}

/**
 * Infrastructure Change with Strategic Oversight
 * All infrastructure changes reviewed for long-term impact
 */
export async function executeStrategicInfrastructureChange(change) {
  return await executeStrategicTask({
    action: "Infrastructure Change",
    description: change.description,
    businessGoal: change.businessGoal || "Improve system reliability and performance",
    technicalContext: {
      services: change.affectedServices || ["all-services"],
      infrastructure: change.infrastructureComponents || [],
      infra: {
        deployment_platform: "Railway",
        database: "PostgreSQL",
        environment: process.env.NODE_ENV || "development"
      }
    },
    constraints: [
      "Zero downtime deployment preferred",
      "Cost must remain within budget",
      "Must not break existing integrations",
      "Rollback plan must be available"
    ],
    longTermRisks: [
      "Vendor lock-in to specific platform",
      "Increased operational complexity",
      "Cost escalation with scale",
      "Security vulnerabilities"
    ],
    successCriteria: [
      "Improved system reliability",
      "Better performance metrics",
      "Reduced operational overhead",
      "Enhanced security posture"
    ],
    executor: change.executor
  });
}

/**
 * Emergency Override - For critical situations that need immediate action
 * Still logs to Cai-Grok Brain but doesn't block execution
 */
export async function executeEmergencyOverride(task) {
  console.log("🚨 EMERGENCY OVERRIDE - Bypassing Cai-Grok Brain approval");
  console.log(`⚡ Emergency Task: ${task.action}`);
  console.log(`📋 Reason: ${task.emergencyReason}`);

  let executionResult = null;

  try {
    // Execute immediately
    if (task.executor && typeof task.executor === 'function') {
      executionResult = await task.executor();
    }

    // Log to Cai-Grok Brain after the fact
    const emergencyDecision = {
      decision: "emergency_override",
      rationale: `Emergency override executed: ${task.emergencyReason}`,
      required_changes: [],
      warnings: ["Emergency override bypassed strategic review"],
      strategic_upgrades: ["Review emergency procedures", "Implement better monitoring"],
      moat_value: "unknown",
      risk_score: 90, // High risk for emergency overrides
      urgency_score: 100
    };

    await logCaiGrokDecision(
      `EMERGENCY: ${task.action}`,
      emergencyDecision,
      executionResult
    );

    return {
      executed: true,
      status: "emergency_override",
      executionResult,
      message: "Emergency task completed - strategic review bypassed",
      warning: "This action bypassed Cai-Grok Brain approval"
    };

  } catch (error) {
    console.error("❌ Emergency execution failed:", error.message);
    return {
      executed: false,
      status: "emergency_failed",
      error: error.message,
      message: "Emergency task failed"
    };
  }
}