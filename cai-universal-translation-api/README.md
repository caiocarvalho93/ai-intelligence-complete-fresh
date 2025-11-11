# CAI Universal Translation API

🌍 **ONE LOVE** - Universal Translation System powered by AI Intelligence Network

A comprehensive translation API that provides seamless multilingual support for web applications with 70+ languages, real-time translation, and intelligent caching.

## 🚀 Features

- **70+ Languages Support** - Complete global coverage
- **Real-time Translation** - Instant text translation
- **Smart Caching** - Optimized performance with translation cache
- **Batch Translation** - Process multiple texts efficiently  
- **React Components** - Ready-to-use UI components
- **Node.js SDK** - Server-side integration
- **Python Package** - Python application support
- **REST API** - Universal HTTP interface

## 🎯 Quick Start

### React Integration
```jsx
import { LanguageProvider, UniversalLanguageButton } from 'cai-universal-translation';

function App() {
  return (
    <LanguageProvider>
      <UniversalLanguageButton />
      <YourContent />
    </LanguageProvider>
  );
}
```

### Node.js Usage
```javascript
const { CAITranslation } = require('cai-universal-translation');

const translator = new CAITranslation();
const result = await translator.translate('Hello World', 'es');
console.log(result); // "Hola Mundo"
```

### Python Usage
```python
from cai_translation import CAITranslator

translator = CAITranslator()
result = translator.translate("Hello World", "es")
print(result)  # "Hola Mundo"
```

## 📦 Installation

```bash
# React Package
npm install cai-universal-translation

# Node.js Package  
npm install cai-translation-node

# Python Package
pip install cai-translation
```

## 🌐 Supported Languages

English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Turkish, Polish, Dutch, Swedish, Danish, Norwegian, Finnish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Slovak, Slovenian, Estonian, Latvian, Lithuanian, Maltese, Greek, Welsh, Irish, Basque, Catalan, Galician, Thai, Vietnamese, Indonesian, Malay, Filipino, Hebrew, Persian, Urdu, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Nepali, Sinhala, Myanmar, Khmer, Lao, Georgian, Armenian, Azerbaijani, Kazakh, Kyrgyz, Uzbek, Mongolian, Amharic, Swahili, Zulu, Afrikaans, Xhosa, Yoruba, Igbo, Hausa, Somali, Kinyarwanda, Luganda, Shona, Chichewa, Malagasy, and regional variants.

## 🔧 API Endpoints

### Single Translation
```
POST /api/translate
{
  "text": "Hello World",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

### Batch Translation
```
POST /api/translate/batch
{
  "texts": ["Hello", "World"],
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

## 📚 Documentation

- [Quick Start Guide](./docs/QUICK_START.md)
- [API Reference](./docs/API.md)
- [React Components](./docs/REACT.md)
- [Node.js SDK](./docs/NODEJS.md)
- [Python Package](./docs/PYTHON.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🌟 Support

- GitHub Issues: [Report bugs](https://github.com/caiocarvalho93/cai_universal-translation-api/issues)
- Email: support@cai-intelligence.com
- Discord: [Join our community](https://discord.gg/cai-intelligence)

---

**Made with ❤️ by CAI Intelligence Network**

*ONE LOVE - Connecting the world through language*