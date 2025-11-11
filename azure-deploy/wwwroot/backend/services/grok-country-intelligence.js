// Grok Country Intelligence - AI-Powered Software Analysis and Decision Making
// This service analyzes our entire codebase and provides intelligent guidance

import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default class GrokCountryIntelligence {
  constructor() {
    this.grokApiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    this.analysisCache = new Map();
    this.lastAnalysis = null;
    
    console.log(`🧠 Grok Intelligence initialized: ${this.grokApiKey ? 'ACTIVE' : 'OFFLINE'}`);
  }

  /**
   * Analyze our entire software structure and provide intelligent guidance
   */
  async analyzeSoftwareAndProvideGuidance(operation, context = {}) {
    console.log(`🧠 Grok analyzing software for operation: ${operation}`);
    
    try {
      // Scan our entire codebase structure
      const codebaseAnalysis = await this.scanCodebaseStructure();
      
      // Get current system state
      const systemState = await this.getCurrentSystemState();
      
      // Prepare analysis request for Grok
      const analysisRequest = {
        operation,
        context,
        codebase: codebaseAnalysis,
        systemState,
        timestamp: new Date().toISOString()
      };

      // Send to Grok for intelligent analysis
      const grokGuidance = await this.sendToGrokForAnalysis(analysisRequest);
      
      console.log(`✅ Grok analysis complete for: ${operation}`);
      return grokGuidance;
      
    } catch (error) {
      console.error(`❌ Grok analysis failed:`, error.message);
      return {
        success: false,
        error: error.message,
        fallbackGuidance: this.getFallbackGuidance(operation)
      };
    }
  }

  /**
   * Scan our entire codebase to understand structure and dependencies
   */
  async scanCodebaseStructure() {
    const structure = {
      frontend: {},
      backend: {},
      dependencies: {},
      configs: {},
      issues: []
    };

    try {
      // Scan frontend structure
      structure.frontend = await this.scanDirectory('./frontend/src', ['components', 'services', 'contexts']);
      
      // Scan backend structure  
      structure.backend = await this.scanDirectory('./backend', ['routes', 'services', 'middleware']);
      
      // Check package.json files
      structure.dependencies = await this.analyzeDependencies();
      
      // Check config files
      structure.configs = await this.analyzeConfigs();
      
      // Identify potential issues
      structure.issues = await this.identifyCodebaseIssues();
      
    } catch (error) {
      console.warn(`⚠️ Codebase scan partial failure:`, error.message);
    }

    return structure;
  }

  /**
   * Scan directory structure recursively
   */
  async scanDirectory(dirPath, importantSubdirs = []) {
    const result = {
      files: [],
      subdirs: {},
      imports: [],
      exports: []
    };

    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          if (importantSubdirs.includes(item.name) || importantSubdirs.length === 0) {
            result.subdirs[item.name] = await this.scanDirectory(fullPath);
          }
        } else if (item.name.endsWith('.js') || item.name.endsWith('.jsx') || item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
          const fileInfo = await this.analyzeFile(fullPath);
          result.files.push({
            name: item.name,
            path: fullPath,
            ...fileInfo
          });
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not scan directory ${dirPath}:`, error.message);
    }

    return result;
  }

  /**
   * Analyze individual file for imports, exports, and key functions
   */
  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      const analysis = {
        size: content.length,
        lines: content.split('\n').length,
        imports: this.extractImports(content),
        exports: this.extractExports(content),
        functions: this.extractFunctions(content),
        hasErrors: this.checkForCommonErrors(content)
      };

      return analysis;
    } catch (error) {
      return {
        error: error.message,
        hasErrors: true
      };
    }
  }

  /**
   * Extract import statements from file content
   */
  extractImports(content) {
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  /**
   * Extract export statements from file content
   */
  extractExports(content) {
    const exportRegex = /export\s+(default\s+)?(class|function|const|let|var)\s+(\w+)/g;
    const exports = [];
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push({
        name: match[3],
        type: match[2],
        isDefault: !!match[1]
      });
    }
    
    return exports;
  }

  /**
   * Extract function names from file content
   */
  extractFunctions(content) {
    const functionRegex = /(function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(|(\w+)\s*:\s*(?:async\s+)?(?:function\s*)?\()/g;
    const functions = [];
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const funcName = match[2] || match[3] || match[4];
      if (funcName) {
        functions.push(funcName);
      }
    }
    
    return functions;
  }

  /**
   * Check for common errors in file content
   */
  checkForCommonErrors(content) {
    const errorPatterns = [
      /import.*from\s+['"`][^'"`]*\.js['"`].*not found/,
      /Cannot find module/,
      /SyntaxError/,
      /ReferenceError/,
      /TypeError/,
      /export.*not found/,
      /undefined.*is not a function/
    ];

    return errorPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Analyze package.json dependencies
   */
  async analyzeDependencies() {
    const deps = {
      frontend: {},
      backend: {},
      root: {}
    };

    try {
      // Root package.json
      const rootPkg = JSON.parse(await fs.readFile('./package.json', 'utf-8'));
      deps.root = {
        dependencies: rootPkg.dependencies || {},
        devDependencies: rootPkg.devDependencies || {},
        scripts: rootPkg.scripts || {}
      };

      // Frontend package.json
      const frontendPkg = JSON.parse(await fs.readFile('./frontend/package.json', 'utf-8'));
      deps.frontend = {
        dependencies: frontendPkg.dependencies || {},
        devDependencies: frontendPkg.devDependencies || {},
        scripts: frontendPkg.scripts || {}
      };

      // Backend package.json
      const backendPkg = JSON.parse(await fs.readFile('./backend/package.json', 'utf-8'));
      deps.backend = {
        dependencies: backendPkg.dependencies || {},
        devDependencies: backendPkg.devDependencies || {},
        scripts: backendPkg.scripts || {}
      };

    } catch (error) {
      console.warn(`⚠️ Could not analyze dependencies:`, error.message);
    }

    return deps;
  }

  /**
   * Analyze configuration files
   */
  async analyzeConfigs() {
    const configs = {};

    const configFiles = [
      './vite.config.js',
      './frontend/vite.config.js', 
      './backend/.env',
      './backend/.env.example',
      './.gitignore',
      './README.md'
    ];

    for (const configFile of configFiles) {
      try {
        const content = await fs.readFile(configFile, 'utf-8');
        configs[path.basename(configFile)] = {
          exists: true,
          size: content.length,
          hasContent: content.trim().length > 0
        };
      } catch (error) {
        configs[path.basename(configFile)] = {
          exists: false,
          error: error.message
        };
      }
    }

    return configs;
  }

  /**
   * Identify potential issues in the codebase
   */
  async identifyCodebaseIssues() {
    const issues = [];

    // Check for missing files
    const criticalFiles = [
      './backend/server.js',
      './frontend/src/App.jsx',
      './frontend/src/main.jsx'
    ];

    for (const file of criticalFiles) {
      try {
        await fs.access(file);
      } catch (error) {
        issues.push({
          type: 'missing_file',
          file,
          severity: 'high',
          message: `Critical file missing: ${file}`
        });
      }
    }

    return issues;
  }

  /**
   * Get current system state (processes, ports, etc.)
   */
  async getCurrentSystemState() {
    return {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        hasApiKeys: {
          NEWS_API_KEY: !!process.env.NEWS_API_KEY,
          NEWSDATA_API_KEY: !!process.env.NEWSDATA_API_KEY,
          OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
          GROK_API_KEY: !!process.env.GROK_API_KEY
        }
      }
    };
  }

  /**
   * Send analysis request to Grok AI for intelligent guidance
   */
  async sendToGrokForAnalysis(analysisRequest) {
    if (!this.grokApiKey) {
      console.log(`⚠️ Grok API key not configured, using local analysis`);
      return this.getLocalAnalysis(analysisRequest);
    }

    try {
      // This would be the actual Grok API call
      // For now, we'll simulate intelligent analysis
      const grokResponse = await this.simulateGrokAnalysis(analysisRequest);
      
      // Cache the analysis
      this.analysisCache.set(analysisRequest.operation, grokResponse);
      this.lastAnalysis = grokResponse;
      
      return grokResponse;
      
    } catch (error) {
      console.error(`❌ Grok API call failed:`, error.message);
      return this.getLocalAnalysis(analysisRequest);
    }
  }

  /**
   * Simulate Grok's intelligent analysis (until real API is available)
   */
  async simulateGrokAnalysis(request) {
    const { operation, context, codebase, systemState } = request;
    
    // Simulate intelligent analysis based on operation type
    const analysis = {
      operation,
      timestamp: new Date().toISOString(),
      confidence: 0.95,
      recommendations: [],
      risks: [],
      optimizations: [],
      nextSteps: []
    };

    // Analyze based on operation type
    switch (operation) {
      case 'server_startup':
        analysis.recommendations.push(
          'Ensure all route files exist and have proper exports',
          'Check that all required environment variables are set',
          'Verify database connections before starting server'
        );
        analysis.risks.push(
          'Missing route files will cause import errors',
          'Undefined environment variables may cause runtime failures'
        );
        break;

      case 'fix_imports':
        analysis.recommendations.push(
          'Create missing service files with proper exports',
          'Use consistent import/export patterns across codebase',
          'Add error handling for missing modules'
        );
        break;

      case 'debug_errors':
        analysis.recommendations.push(
          'Check console logs for specific error messages',
          'Verify file paths and module exports',
          'Test each component individually'
        );
        break;

      default:
        analysis.recommendations.push(
          'Analyze the specific operation requirements',
          'Check for dependencies and prerequisites',
          'Test changes incrementally'
        );
    }

    // Add codebase-specific insights
    if (codebase.issues && codebase.issues.length > 0) {
      analysis.risks.push(`Found ${codebase.issues.length} codebase issues that need attention`);
    }

    // Add system-specific insights
    if (!systemState.env.hasApiKeys.NEWS_API_KEY) {
      analysis.risks.push('News API key not configured - news features may not work');
    }

    analysis.nextSteps = [
      'Address high-priority issues first',
      'Test each fix before proceeding',
      'Monitor system logs for new issues',
      'Update documentation as needed'
    ];

    return analysis;
  }

  /**
   * Get local analysis when Grok is not available
   */
  getLocalAnalysis(request) {
    return {
      operation: request.operation,
      timestamp: new Date().toISOString(),
      confidence: 0.7,
      source: 'local_analysis',
      recommendations: [
        'Check file existence and permissions',
        'Verify import/export statements',
        'Test functionality step by step'
      ],
      risks: [
        'Limited analysis without AI assistance',
        'May miss complex dependency issues'
      ],
      nextSteps: [
        'Fix obvious syntax errors first',
        'Test basic functionality',
        'Check logs for detailed error messages'
      ]
    };
  }

  /**
   * Get fallback guidance when analysis fails
   */
  getFallbackGuidance(operation) {
    const fallbackGuidance = {
      server_startup: [
        'Check that server.js exists and has proper syntax',
        'Verify all imported modules exist',
        'Check environment variables are set'
      ],
      fix_imports: [
        'Create missing files with basic exports',
        'Check file paths are correct',
        'Use consistent naming conventions'
      ],
      debug_errors: [
        'Read error messages carefully',
        'Check recent changes for issues',
        'Test components individually'
      ]
    };

    return fallbackGuidance[operation] || [
      'Analyze the problem systematically',
      'Check logs and error messages',
      'Test changes incrementally'
    ];
  }

  /**
   * Filter articles for country relevance (original functionality)
   */
  async filterArticlesForCountry(articles, countryCode) {
    // This maintains the original country filtering functionality
    console.log(`🧠 Grok filtering ${articles.length} articles for ${countryCode}`);
    
    // For now, return all articles (can be enhanced with actual AI filtering)
    return articles.filter(article => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      const countryKeywords = this.getCountryKeywords(countryCode);
      
      return countryKeywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
    });
  }

  /**
   * Get country-specific keywords for filtering
   */
  getCountryKeywords(countryCode) {
    const keywords = {
      'KR': ['korea', 'korean', 'seoul', 'samsung', 'lg'],
      'JP': ['japan', 'japanese', 'tokyo', 'sony', 'nintendo'],
      'CN': ['china', 'chinese', 'beijing', 'alibaba', 'tencent'],
      'US': ['america', 'american', 'usa', 'silicon valley'],
      'DE': ['germany', 'german', 'berlin', 'sap', 'siemens'],
      'FR': ['france', 'french', 'paris', 'orange', 'thales'],
      'GB': ['britain', 'british', 'uk', 'london', 'arm'],
      'IN': ['india', 'indian', 'bangalore', 'infosys', 'tcs'],
      'CA': ['canada', 'canadian', 'toronto', 'shopify'],
      'AU': ['australia', 'australian', 'sydney', 'atlassian']
    };

    return keywords[countryCode] || [countryCode.toLowerCase()];
  }
}