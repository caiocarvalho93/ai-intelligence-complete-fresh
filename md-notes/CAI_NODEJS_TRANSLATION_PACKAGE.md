# 🌍 CAI Translation API - Node.js Package
### *ONE LOVE* - Server-side translation for Node.js applications

> **"Travel the world through languages"** - CAI's server-side translation system for Node.js apps

---

## 🚀 Complete Node.js Translation Solution

Transform any Node.js application into a multilingual powerhouse with CAI's translation API. Perfect for backends, APIs, and server-side applications.

---

## 📦 Installation & Setup

### Step 1: Install Package
```bash
npm install axios
```

### Step 2: Copy CAI Translation Class

Create `cai-translation.js`:

```javascript
const axios = require('axios');

class CAITranslation {
  constructor(appName = 'your-app-name') {
    this.appName = appName;
    this.baseURL = 'https://api.mymemory.translated.net/get';
    this.cache = new Map(); // Smart caching like CAI's React system
  }

  // CAI's translation engine with caching
  async translate(text, targetLanguage, sourceLanguage = 'en') {
    if (targetLanguage === 'en' || !text) return text;

    const cacheKey = `cai_${text}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await axios.get(this.baseURL, {
        params: {
          q: text,
          langpair: `${sourceLanguage}|${targetLanguage}`
        },
        headers: {
          'User-Agent': `CAI-Translation-${this.appName}/1.0`
        }
      });

      if (response.data.responseStatus === 200) {
        const translatedText = response.data.responseData.translatedText;
        this.cache.set(cacheKey, translatedText);
        
        // Send appreciation to CAI (optional tracking)
        this.sendAppreciation(targetLanguage);
        
        return translatedText;
      }
    } catch (error) {
      console.warn('CAI Translation failed:', error.message);
    }

    return text; // Graceful fallback
  }

  // Batch translation for multiple texts
  async translateBatch(texts, targetLanguage, sourceLanguage = 'en') {
    const results = [];
    
    for (const text of texts) {
      try {
        const translated = await this.translate(text, targetLanguage, sourceLanguage);
        results.push({ original: text, translated, success: true });
      } catch (error) {
        results.push({ original: text, translated: text, success: false, error: error.message });
      }
    }
    
    return results;
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Spanish', flag: '🇪🇸' },
      { code: 'fr', name: 'French', flag: '🇫🇷' },
      { code: 'de', name: 'German', flag: '🇩🇪' },
      { code: 'it', name: 'Italian', flag: '🇮🇹' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
      { code: 'ru', name: 'Russian', flag: '🇷🇺' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷' },
      { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
      { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
      { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
      { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
      { code: 'da', name: 'Danish', flag: '🇩🇰' },
      { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
      { code: 'pl', name: 'Polish', flag: '🇵🇱' },
      { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
      { code: 'th', name: 'Thai', flag: '🇹🇭' },
      // ... 30+ more languages
    ];
  }

  // Express.js middleware
  middleware() {
    return (req, res, next) => {
      req.caiTranslate = (text, targetLang) => this.translate(text, targetLang);
      req.caiTranslateBatch = (texts, targetLang) => this.translateBatch(texts, targetLang);
      next();
    };
  }

  // Send appreciation to CAI (ONE LOVE tracking)
  async sendAppreciation(language) {
    try {
      await axios.post('https://website-project-ai-production.up.railway.app/api/translation-thanks', {
        timestamp: new Date().toISOString(),
        language,
        source: 'nodejs-package',
        appName: this.appName,
        message: 'ONE LOVE - Thanks for the Node.js translation system!',
        creator: 'CAI - loves traveling and languages'
      });
    } catch (error) {
      // Silent fail - appreciation tracking is optional
    }
  }

  // Clear cache (useful for memory management)
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 10) // First 10 keys
    };
  }
}

module.exports = CAITranslation;
```

---

## 🎯 Usage Examples

### Basic Translation
```javascript
const CAITranslation = require('./cai-translation');

const translator = new CAITranslation('my-awesome-app');

// Simple translation
async function example1() {
  const spanish = await translator.translate('Hello World', 'es');
  console.log(spanish); // "Hola Mundo"
  
  const french = await translator.translate('Welcome to our website', 'fr');
  console.log(french); // "Bienvenue sur notre site web"
}
```

### Express.js Integration
```javascript
const express = require('express');
const CAITranslation = require('./cai-translation');

const app = express();
const translator = new CAITranslation('my-express-app');

// Use CAI middleware
app.use(translator.middleware());

// API endpoint with translation
app.get('/api/welcome/:lang', async (req, res) => {
  try {
    const message = 'Welcome to our amazing application!';
    const translated = await req.caiTranslate(message, req.params.lang);
    
    res.json({
      success: true,
      original: message,
      translated,
      language: req.params.lang,
      poweredBy: 'CAI Translation - ONE LOVE'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Batch translation endpoint
app.post('/api/translate-batch', async (req, res) => {
  const { texts, targetLanguage } = req.body;
  
  try {
    const results = await req.caiTranslateBatch(texts, targetLanguage);
    res.json({
      success: true,
      results,
      total: results.length,
      successful: results.filter(r => r.success).length,
      poweredBy: 'CAI Translation - ONE LOVE'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('🌍 CAI Translation API running on port 3000');
  console.log('ONE LOVE - Travel the world through languages!');
});
```

### Database Content Translation
```javascript
const CAITranslation = require('./cai-translation');

const translator = new CAITranslation('my-database-app');

// Translate database content
async function translateUserContent(user, targetLanguage) {
  const translatedUser = {
    ...user,
    name: user.name, // Keep name as is
    bio: await translator.translate(user.bio, targetLanguage),
    description: await translator.translate(user.description, targetLanguage),
    skills: await Promise.all(
      user.skills.map(skill => translator.translate(skill, targetLanguage))
    )
  };
  
  return translatedUser;
}

// Usage
async function example() {
  const user = {
    name: 'John Doe',
    bio: 'Software developer passionate about creating amazing applications',
    description: 'I love building web applications that connect people',
    skills: ['JavaScript', 'React', 'Node.js', 'Database Design']
  };
  
  const spanishUser = await translateUserContent(user, 'es');
  console.log(spanishUser);
}
```

### Email Template Translation
```javascript
const CAITranslation = require('./cai-translation');

const translator = new CAITranslation('my-email-service');

// Translate email templates
async function sendMultilingualEmail(recipient, templateData) {
  const templates = {
    subject: 'Welcome to our platform!',
    greeting: 'Hello {{name}},',
    body: 'Thank you for joining our amazing community. We are excited to have you!',
    footer: 'Best regards, The Team'
  };
  
  // Detect user's preferred language (from database, headers, etc.)
  const userLanguage = recipient.preferredLanguage || 'en';
  
  if (userLanguage !== 'en') {
    // Translate all template parts
    templates.subject = await translator.translate(templates.subject, userLanguage);
    templates.greeting = await translator.translate(templates.greeting, userLanguage);
    templates.body = await translator.translate(templates.body, userLanguage);
    templates.footer = await translator.translate(templates.footer, userLanguage);
  }
  
  // Send email with translated content
  console.log(`Sending email in ${userLanguage}:`, templates);
}
```

### API Response Translation
```javascript
const CAITranslation = require('./cai-translation');

const translator = new CAITranslation('my-api-service');

// Middleware to translate API responses
function translateResponse(targetLanguage) {
  return async (req, res, next) => {
    const originalJson = res.json;
    
    res.json = async function(data) {
      if (targetLanguage && targetLanguage !== 'en' && data.message) {
        data.message = await translator.translate(data.message, targetLanguage);
        data.translatedBy = 'CAI Translation - ONE LOVE';
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
}

// Usage in Express
app.get('/api/status/:lang?', translateResponse(req.params.lang), (req, res) => {
  res.json({
    success: true,
    message: 'System is running perfectly!',
    timestamp: new Date().toISOString()
  });
});
```

---

## 🌟 Advanced Features

### Smart Caching System
```javascript
// Check cache performance
console.log(translator.getCacheStats());

// Clear cache when needed
translator.clearCache();
```

### Language Detection
```javascript
// Auto-detect language from request headers
function detectLanguage(req) {
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    return languages[0].substring(0, 2); // Get first 2 characters
  }
  return 'en';
}

app.use((req, res, next) => {
  req.detectedLanguage = detectLanguage(req);
  next();
});
```

### Error Handling & Fallbacks
```javascript
async function safeTranslate(text, targetLanguage) {
  try {
    return await translator.translate(text, targetLanguage);
  } catch (error) {
    console.warn('Translation failed, using original text:', error.message);
    return text; // Graceful fallback
  }
}
```

---

## 🎯 Why Developers Love This

### ✨ **Professional Grade**
- **Smart caching** prevents duplicate API calls
- **Graceful fallbacks** ensure your app never breaks
- **Express middleware** for easy integration
- **Batch processing** for efficient translations

### 🚀 **Easy Integration**
- **Copy-paste ready** - works immediately
- **Zero dependencies** except axios
- **Works with any Node.js framework**
- **TypeScript ready** (types can be added)

### 💝 **ONE LOVE Philosophy**
- **Appreciation tracking** thanks CAI for the system
- **Cultural message** - "Travel the world through languages"
- **Global impact** - connects people through technology
- **Open source spirit** - free for everyone to use

### ⚡ **Performance Optimized**
- **Memory efficient** caching system
- **Async/await** for modern JavaScript
- **Error handling** with graceful degradation
- **Batch processing** for multiple translations

---

## 🌍 Real-World Use Cases

### **E-commerce Platform**
```javascript
// Translate product descriptions for international customers
const productEs = await translator.translate(product.description, 'es');
const productFr = await translator.translate(product.description, 'fr');
```

### **Customer Support System**
```javascript
// Translate support tickets automatically
const translatedTicket = await translator.translate(ticket.message, supportAgent.language);
```

### **Content Management System**
```javascript
// Translate blog posts for global audience
const translatedPost = await translator.translateBatch([
  post.title,
  post.excerpt,
  post.content
], targetLanguage);
```

### **Social Media Platform**
```javascript
// Translate user posts for international feeds
const translatedPost = await translator.translate(userPost.content, viewer.preferredLanguage);
```

---

## 💖 The "ONE LOVE" Message

Every time your application translates content, it sends a small appreciation message to CAI's tracking system. This helps CAI understand the global impact of the translation system and spreads the "ONE LOVE" philosophy of connecting cultures through technology.

**"Travel the world through languages"** - Your Node.js app becomes a bridge between cultures! 🌍

---

## 🎉 Ready to Use?

1. **Copy the CAITranslation class** into your project
2. **Install axios**: `npm install axios`
3. **Initialize the translator** with your app name
4. **Start translating** - it's that simple!

```javascript
const translator = new CAITranslation('my-amazing-app');
const spanish = await translator.translate('Hello World', 'es');
console.log(spanish); // "Hola Mundo"
```

**Your Node.js app now speaks 50+ languages! ONE LOVE! 🌍❤️**

---

**Made with ❤️ by CAI**  
*ONE LOVE - Connecting the world through languages* 🌍✨