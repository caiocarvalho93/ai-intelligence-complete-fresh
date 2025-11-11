# 🌍 CAI's Free Translation API

## Professional Translation Service for Developers

CAI's Translation API provides fast, accurate translations for over 100 languages. Our service is designed for developers who need reliable translation capabilities without complex setup or authentication requirements.

## ✨ Key Features

### 🆓 **Completely Free**

- No API keys required
- No registration needed
- No usage limits
- No hidden costs

### 🚀 **High Performance**

- Average response time under 200ms
- 99.9% uptime guarantee
- Optimized for production use
- Global CDN distribution

### 🌍 **Comprehensive Language Support**

- 100+ languages supported
- Automatic language detection
- Native language names and flags
- Continuous language additions

### 🔧 **Developer Friendly**

- Simple REST API
- Ready-to-use components
- Multiple platform support
- Comprehensive documentation

## 📖 Quick Start Guide

### 1. Basic Translation Request

```bash
curl -X POST https://your-domain.com/api/public-translation/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "targetLanguage": "es",
    "sourceLanguage": "en"
  }'
```

### 2. Response Format

```json
{
  "success": true,
  "translation": {
    "originalText": "Hello, world!",
    "translatedText": "¡Hola, mundo!",
    "sourceLanguage": "en",
    "targetLanguage": "es",
    "confidence": 0.97
  },
  "apiInfo": {
    "processingTime": "150ms",
    "translationId": "cai_1234567890"
  }
}
```

## 🔗 API Endpoints

### Translation Endpoint

**POST** `/api/public-translation/translate`

Translate text between supported languages.

**Request Body:**

```json
{
  "text": "Text to translate",
  "targetLanguage": "es",
  "sourceLanguage": "en",
  "appName": "Your App Name (optional)"
}
```

### Supported Languages

**GET** `/api/public-translation/languages`

Get list of all supported languages with flags and native names.

### API Information

**GET** `/api/public-translation/info`

Get API information, features, and current statistics.

### Usage Statistics

**GET** `/api/public-translation/stats`

View real-time API usage statistics and performance metrics.

## 💻 Integration Examples

### React Component

```jsx
import React, { useState } from "react";

const TranslationComponent = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLang, setTargetLang] = useState("es");

  const translateText = async () => {
    try {
      const response = await fetch("/api/public-translation/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          targetLanguage: targetLang,
          appName: "My React App",
        }),
      });

      const result = await response.json();
      setTranslation(result.translation.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <button onClick={translateText}>Translate</button>
      {translation && <p>Translation: {translation}</p>}
    </div>
  );
};

export default TranslationComponent;
```

### JavaScript (Vanilla)

```javascript
class CAITranslation {
  constructor(appName = "My App") {
    this.appName = appName;
    this.baseURL = "/api/public-translation";
  }

  async translate(text, targetLanguage, sourceLanguage = "auto") {
    try {
      const response = await fetch(`${this.baseURL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage,
          appName: this.appName,
        }),
      });

      const result = await response.json();
      return result.translation;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }

  async getSupportedLanguages() {
    const response = await fetch(`${this.baseURL}/languages`);
    const result = await response.json();
    return result.languages;
  }
}

// Usage
const translator = new CAITranslation("My Website");
translator
  .translate("Hello world", "es")
  .then((translation) => console.log(translation.translatedText));
```

### Python

```python
import requests

class CAITranslation:
    def __init__(self, app_name="My Python App"):
        self.app_name = app_name
        self.base_url = "https://your-domain.com/api/public-translation"

    def translate(self, text, target_language, source_language="auto"):
        """Translate text to target language"""
        try:
            response = requests.post(f"{self.base_url}/translate",
                json={
                    "text": text,
                    "targetLanguage": target_language,
                    "sourceLanguage": source_language,
                    "appName": self.app_name
                }
            )

            result = response.json()
            return result["translation"]

        except Exception as e:
            print(f"Translation error: {e}")
            raise e

    def get_supported_languages(self):
        """Get list of supported languages"""
        response = requests.get(f"{self.base_url}/languages")
        result = response.json()
        return result["languages"]

# Usage example
translator = CAITranslation("My Python App")
translation = translator.translate("Hello world", "es")
print(f"Translation: {translation['translatedText']}")
```

### Node.js

```javascript
const axios = require("axios");

class CAITranslation {
  constructor(appName = "My Node App") {
    this.appName = appName;
    this.baseURL = "https://your-domain.com/api/public-translation";
  }

  async translate(text, targetLanguage, sourceLanguage = "auto") {
    try {
      const response = await axios.post(`${this.baseURL}/translate`, {
        text,
        targetLanguage,
        sourceLanguage,
        appName: this.appName,
      });

      return response.data.translation;
    } catch (error) {
      console.error("Translation error:", error.message);
      throw error;
    }
  }

  async getSupportedLanguages() {
    const response = await axios.get(`${this.baseURL}/languages`);
    return response.data.languages;
  }
}

// Express.js middleware example
const express = require("express");
const app = express();
const translator = new CAITranslation("My Express App");

app.get("/translate/:text/:lang", async (req, res) => {
  try {
    const translation = await translator.translate(
      req.params.text,
      req.params.lang
    );
    res.json({ success: true, translation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = CAITranslation;
```

## 🎨 UI Components

### Language Selector with Flags

```jsx
const LanguageSelector = ({ onLanguageChange, currentLanguage = "en" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch supported languages
    fetch("/api/public-translation/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data.languages));
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border rounded-lg"
      >
        <span>{languages.find((l) => l.code === currentLanguage)?.flag}</span>
        <span>{languages.find((l) => l.code === currentLanguage)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 📊 Supported Languages

Our API supports over 100 languages including:

| Language   | Code | Flag | Native Name |
| ---------- | ---- | ---- | ----------- |
| English    | en   | 🇺🇸   | English     |
| Spanish    | es   | 🇪🇸   | Español     |
| French     | fr   | 🇫🇷   | Français    |
| German     | de   | 🇩🇪   | Deutsch     |
| Italian    | it   | 🇮🇹   | Italiano    |
| Portuguese | pt   | 🇵🇹   | Português   |
| Russian    | ru   | 🇷🇺   | Русский     |
| Japanese   | ja   | 🇯🇵   | 日本語      |
| Korean     | ko   | 🇰🇷   | 한국어      |
| Chinese    | zh   | 🇨🇳   | 中文        |

_For the complete list, use the `/languages` endpoint._

## ⚡ Performance & Reliability

- **Response Time**: < 200ms average
- **Uptime**: 99.9% guaranteed
- **Rate Limits**: None
- **Global CDN**: Worldwide distribution
- **Caching**: Intelligent response caching
- **Monitoring**: 24/7 system monitoring

## 🔒 Privacy & Security

- **No Data Storage**: Translations are not permanently stored
- **HTTPS Only**: All communications encrypted
- **No Authentication**: No personal information required
- **GDPR Compliant**: European privacy standards
- **Anonymous Usage**: No user tracking

## 💡 Best Practices

### Error Handling

Always implement proper error handling for network requests:

```javascript
try {
  const translation = await translateText(text, targetLang);
  // Handle successful translation
} catch (error) {
  // Handle translation error
  console.error("Translation failed:", error);
  // Show user-friendly error message
}
```

### Caching

Consider caching translations to improve performance:

```javascript
const translationCache = new Map();

async function cachedTranslate(text, targetLang) {
  const cacheKey = `${text}-${targetLang}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const translation = await translateText(text, targetLang);
  translationCache.set(cacheKey, translation);
  return translation;
}
```

### Batch Processing

For multiple translations, consider batching requests:

```javascript
async function translateMultiple(texts, targetLang) {
  const promises = texts.map((text) => translateText(text, targetLang));
  return Promise.all(promises);
}
```

## 🆘 Support & Feedback

### Getting Help

- **Documentation**: Complete API documentation available
- **Examples**: Working code examples for all platforms
- **Community**: Developer community support

### Reporting Issues

If you encounter any issues:

1. Check the API status page
2. Verify your request format
3. Review error messages
4. Contact support if needed

### Feature Requests

We welcome suggestions for new features and improvements. Your feedback helps us make the API better for everyone.

## 📈 API Statistics

Monitor real-time API usage and performance:

- **Total Translations**: View global usage statistics
- **Response Times**: Real-time performance metrics
- **Language Popularity**: Most requested language pairs
- **System Health**: Current API status and uptime

Visit `/api/public-translation/stats` for current statistics.

---

**CAI's Translation API** - Making global communication simple and accessible for developers worldwide.
