// 🚀 REVOLUTIONARY TRANSLATION INJECTOR - BROWSER EXTENSION SIMULATION
// This script gets injected into external websites to provide translation

(function() {
  'use strict';
  
  // Check if already injected
  if (window.revolutionaryTranslatorInjected) return;
  window.revolutionaryTranslatorInjected = true;
  
  // Get user's preferred language from localStorage
  const targetLanguage = localStorage.getItem('externalBrowsingLanguage') || 'en';
  const translationEnabled = localStorage.getItem('enableExternalTranslation') === 'true';
  
  if (!translationEnabled || targetLanguage === 'en') return;
  
  // API configuration
  const API_BASE = 'https://website-project-ai-production.up.railway.app';
  
  // Language names for display
  const languageNames = {
    'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
    'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
    'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'th': 'Thai',
    'vi': 'Vietnamese', 'tr': 'Turkish', 'pl': 'Polish', 'nl': 'Dutch',
    'sv': 'Swedish', 'da': 'Danish', 'no': 'Norwegian', 'fi': 'Finnish'
  };
  
  // Create floating translation controls
  function createTranslationUI() {
    // Main floating button
    const floatingButton = document.createElement('div');
    floatingButton.id = 'revolutionary-translator-btn';
    floatingButton.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>🌍</span>
        <span>Translate to ${languageNames[targetLanguage]}</span>
      </div>
    `;
    
    floatingButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff1493, #ff69b4);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      cursor: pointer;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 4px 20px rgba(255, 20, 147, 0.4);
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      user-select: none;
    `;
    
    // Hover effects
    floatingButton.addEventListener('mouseenter', () => {
      floatingButton.style.transform = 'scale(1.05) translateY(-2px)';
      floatingButton.style.boxShadow = '0 8px 30px rgba(255, 20, 147, 0.6)';
    });
    
    floatingButton.addEventListener('mouseleave', () => {
      floatingButton.style.transform = 'scale(1) translateY(0)';
      floatingButton.style.boxShadow = '0 4px 20px rgba(255, 20, 147, 0.4)';
    });
    
    // Click handler
    floatingButton.addEventListener('click', translatePage);
    
    document.body.appendChild(floatingButton);
    
    // Create status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'revolutionary-translator-status';
    statusIndicator.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      z-index: 999998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      display: none;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(statusIndicator);
  }
  
  // Show status message
  function showStatus(message, type = 'info', duration = 3000) {
    const statusIndicator = document.getElementById('revolutionary-translator-status');
    if (!statusIndicator) return;
    
    const colors = {
      info: '#4a90e2',
      success: '#7ed321',
      error: '#d0021b',
      warning: '#f5a623'
    };
    
    statusIndicator.textContent = message;
    statusIndicator.style.background = colors[type] || colors.info;
    statusIndicator.style.display = 'block';
    
    setTimeout(() => {
      statusIndicator.style.display = 'none';
    }, duration);
  }
  
  // Get all translatable text nodes
  function getTextNodes() {
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.nodeValue.trim();
          if (text.length === 0) return NodeFilter.FILTER_REJECT;
          
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          // Skip script, style, and other non-content elements
          const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'];
          if (skipTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          
          // Skip very short text (likely not meaningful content)
          if (text.length < 3) return NodeFilter.FILTER_REJECT;
          
          // Skip text that's mostly numbers or symbols
          if (!/[a-zA-Z]/.test(text)) return NodeFilter.FILTER_REJECT;
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    return textNodes;
  }
  
  // Main translation function
  async function translatePage() {
    const button = document.getElementById('revolutionary-translator-btn');
    if (!button) return;
    
    // Disable button during translation
    button.style.opacity = '0.6';
    button.style.pointerEvents = 'none';
    button.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="animation: spin 1s linear infinite;">⚡</span>
        <span>Translating...</span>
      </div>
    `;
    
    // Add spinning animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    showStatus('🚀 Starting revolutionary translation...', 'info');
    
    try {
      const textNodes = getTextNodes();
      console.log(`Found ${textNodes.length} text nodes to translate`);
      
      if (textNodes.length === 0) {
        showStatus('No translatable content found', 'warning');
        return;
      }
      
      // Translate in batches to avoid overwhelming the API
      const batchSize = 15;
      let translatedCount = 0;
      
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize);
        const texts = batch.map(node => node.nodeValue.trim());
        
        showStatus(`Translating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(textNodes.length/batchSize)}...`, 'info');
        
        try {
          const response = await fetch(`${API_BASE}/api/translate/batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              texts,
              targetLanguage: targetLanguage,
              sourceLanguage: 'en'
            })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success && data.results) {
            batch.forEach((node, index) => {
              const result = data.results[index];
              if (result && result.success && result.translation) {
                node.nodeValue = result.translation;
                translatedCount++;
              }
            });
          }
          
          // Small delay between batches to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error('Batch translation failed:', error);
          showStatus(`Batch ${Math.floor(i/batchSize) + 1} failed: ${error.message}`, 'error');
        }
      }
      
      // Success!
      showStatus(`✅ Successfully translated ${translatedCount} text elements!`, 'success', 5000);
      
      // Update button to show completion
      button.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>✅</span>
          <span>Translated to ${languageNames[targetLanguage]}</span>
        </div>
      `;
      
      // Add option to translate again
      setTimeout(() => {
        button.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>🔄</span>
            <span>Translate Again</span>
          </div>
        `;
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
      }, 3000);
      
    } catch (error) {
      console.error('Translation failed:', error);
      showStatus(`❌ Translation failed: ${error.message}`, 'error');
      
      // Reset button
      button.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🌍</span>
          <span>Translate to ${languageNames[targetLanguage]}</span>
        </div>
      `;
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
    }
  }
  
  // Initialize when DOM is ready
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createTranslationUI);
    } else {
      createTranslationUI();
    }
    
    // Show welcome message
    setTimeout(() => {
      showStatus(`🚀 Revolutionary translator ready! Language: ${languageNames[targetLanguage]}`, 'success', 4000);
    }, 1000);
  }
  
  // Start the revolution!
  initialize();
  
})();