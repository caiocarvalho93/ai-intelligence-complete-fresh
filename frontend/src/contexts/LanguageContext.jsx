// 🌍 Language Context - Global translation state management
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Available languages list - 70+ languages supported (MOVED OUTSIDE COMPONENT)
const availableLanguages = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "br",
    "ru",
    "ja",
    "ko",
    "zh",
    "ar",
    "hi",
    "tr",
    "pl",
    "nl",
    "sv",
    "da",
    "no",
    "fi",
    "cs",
    "hu",
    "ro",
    "bg",
    "hr",
    "sk",
    "sl",
    "et",
    "lv",
    "lt",
    "mt",
    "el",
    "cy",
    "ga",
    "eu",
    "ca",
    "gl",
    // Additional popular languages
    "th",
    "vi",
    "id",
    "ms",
    "tl",
    "he",
    "fa",
    "ur",
    "bn",
    "ta",
    "te",
    "mr",
    "gu",
    "kn",
    "ml",
    "pa",
    "ne",
    "si",
    "my",
    "km",
    "lo",
    "ka",
    "hy",
    "az",
    "kk",
    "ky",
    "uz",
    "mn",
    "am",
    "sw",
    "zu",
    "af",
    "xh",
    "yo",
    "ig",
    "ha",
    "so",
    "rw",
    "lg",
    "sn",
    "ny",
    "mg",
    // Latin American countries
    "es-AR", // Argentina Spanish
    "es-CL", // Chile Spanish
    "es-UY", // Uruguay Spanish
    "es-MX", // Mexico Spanish
    "es-CO", // Colombia Spanish
];

export function LanguageProvider({ children }) {
  // Initialize with saved language immediately to prevent race condition
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      // ATOMIC CLEANUP: Remove conflicting localStorage keys from other translation systems
      const conflictingKeys = [
        'universalTranslatorLang',
        'universalTranslatorActive', 
        'universalTranslatorScript'
      ];
      
      conflictingKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          console.log('🚨 ATOMIC CLEANUP: Removing conflicting key:', key);
          localStorage.removeItem(key);
        }
      });

      // Clean up globalLang_ prefixed keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('globalLang_')) {
          console.log('🚨 ATOMIC CLEANUP: Removing globalLang key:', key);
          localStorage.removeItem(key);
        }
      });

      const saved = localStorage.getItem("selectedLanguage");
      console.log("🌍 Initializing with saved language:", saved);
      return (saved && availableLanguages.includes(saved)) ? saved : "en";
    } catch (error) {
      console.warn("🌍 Failed to load saved language:", error);
      return "en";
    }
  });
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  // ATOMIC CLEANUP: Remove conflicting global variables and DOM elements
  useEffect(() => {
    const conflictingGlobals = [
      'globalLangController',
      'universalTranslator',
      'autoTranslationInjector'
    ];
    
    conflictingGlobals.forEach(global => {
      if (window[global]) {
        console.log('🚨 ATOMIC CLEANUP: Removing conflicting global:', global);
        delete window[global];
      }
    });

    // Remove conflicting DOM elements
    const conflictingElements = [
      'global-language-box',
      'global-chrome-indicator',
      'universal-translator-indicator',
      'google_translate_element'
    ];

    conflictingElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log('🚨 ATOMIC CLEANUP: Removing conflicting DOM element:', id);
        element.remove();
      }
    });

    // Remove any injected translation scripts
    const scripts = document.querySelectorAll('script[id*="translate"], script[id*="language"]');
    scripts.forEach(script => {
      if (script.id !== 'main-language-context') {
        console.log('🚨 ATOMIC CLEANUP: Removing conflicting script:', script.id);
        script.remove();
      }
    });
  }, []);

  // Debug currentLanguage changes
  useEffect(() => {
    console.log("🌍 CurrentLanguage state changed to:", currentLanguage);
  }, [currentLanguage]);

  // Get API base URL - RESTORED TO ORIGINAL
  const getApiBase = () => {
    if (
      import.meta.env.PROD ||
      window.location.hostname.includes("vercel.app")
    ) {
      return "https://website-project-ai-production.up.railway.app";
    }
    return "http://localhost:3000";
  };

  // Translate text with caching
  const translateText = async (text, targetLanguage = currentLanguage) => {
    // CRITICAL: Always return original text for English
    if (!text || targetLanguage === "en") {
      console.log("🌍 ENGLISH MODE: Returning original text:", text);
      return text;
    }

    const cacheKey = `${text}-${targetLanguage}`;

    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      setIsTranslating(true);

      console.log(`🌍 Translating "${text}" to ${targetLanguage}`);

      const response = await fetch(`${getApiBase()}/api/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage: "en",
        }),
      });

      if (!response.ok) {
        console.error(
          `Translation API error: ${response.status} ${response.statusText}`
        );
        return text;
      }

      const data = await response.json();
      console.log("🌍 Translation response:", data);

      if (data.success && data.translation) {
        // Cache the translation
        translationCache.set(cacheKey, data.translation);
        console.log(
          `✅ Translation successful: "${text}" -> "${data.translation}"`
        );
        return data.translation;
      } else {
        console.error("Translation failed:", data.error || "Unknown error");
        return text; // Return original text on failure
      }
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  };

  // Batch translate multiple texts
  const batchTranslate = async (texts, targetLanguage = currentLanguage) => {
    if (targetLanguage === "en") return texts;

    try {
      setIsTranslating(true);

      const response = await fetch(`${getApiBase()}/api/translate/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts,
          targetLanguage,
          sourceLanguage: "en",
        }),
      });

      const data = await response.json();

      if (data.success) {
        const translatedTexts = data.results.map((result) =>
          result.success ? result.translation : result.originalText
        );

        // Cache all translations
        texts.forEach((text, index) => {
          const cacheKey = `${text}-${targetLanguage}`;
          translationCache.set(cacheKey, translatedTexts[index]);
        });

        return translatedTexts;
      } else {
        console.error("Batch translation failed:", data.error);
        return texts;
      }
    } catch (error) {
      console.error("Batch translation error:", error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  };

  // ATOMIC LANGUAGE CHANGE - Nuclear-level error handling
  const changeLanguage = (languageCode) => {
    try {
      console.log(
        "🌍 ATOMIC ChangeLanguage - From:",
        currentLanguage,
        "To:",
        languageCode,
        "Type:",
        typeof languageCode
      );

      // Atomic validation
      if (!languageCode || typeof languageCode !== 'string') {
        console.error("🚨 ATOMIC ERROR: Invalid language code type:", typeof languageCode, languageCode);
        return;
      }

      if (!availableLanguages || !availableLanguages.includes(languageCode)) {
        console.error("🚨 ATOMIC ERROR: Language not available:", languageCode, "Available:", availableLanguages.slice(0, 10));
        return;
      }

      // Atomic state update
      console.log("🌍 ATOMIC: Setting currentLanguage state to:", languageCode);
      setCurrentLanguage(languageCode);
      
      // Atomic localStorage update
      try {
        console.log("🌍 ATOMIC: Saving to localStorage:", languageCode);
        localStorage.setItem("selectedLanguage", languageCode);
      } catch (storageError) {
        console.error("🚨 ATOMIC ERROR: localStorage failed:", storageError);
      }

      // ATOMIC CACHE MANAGEMENT - Clear cache for ANY language change
      setTimeout(() => {
        try {
          translationCache.clear();
          console.log("🌍 ATOMIC: Translation cache cleared for language change to:", languageCode);
          
          // CRITICAL: Force immediate English reset
          if (languageCode === "en") {
            console.log("🌍 ATOMIC: FORCING ENGLISH RESET - Clearing all translations");
            // Force complete re-render by updating translations state
            setTranslations({ forceEnglish: Date.now() });
            // Also clear any browser cache
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('languageReset', { detail: { language: 'en' } }));
            }
          }
        } catch (cacheError) {
          console.error("🚨 ATOMIC ERROR: Cache clear failed:", cacheError);
        }
      }, 0);

      // Atomic verification
      setTimeout(() => {
        try {
          const stored = localStorage.getItem("selectedLanguage");
          console.log("🌍 ATOMIC VERIFICATION - localStorage:", stored, "Expected:", languageCode);
          if (stored !== languageCode) {
            console.error("🚨 ATOMIC ERROR: localStorage mismatch!");
          }
        } catch (verifyError) {
          console.error("🚨 ATOMIC ERROR: Verification failed:", verifyError);
        }
      }, 50);

    } catch (error) {
      console.error("🚨 ATOMIC CATASTROPHIC ERROR in changeLanguage:", error);
      // Emergency fallback
      setCurrentLanguage("en");
    }
  };

  // Language is now initialized directly in useState, no need for useEffect

  const value = {
    currentLanguage,
    translations,
    isTranslating,
    translateText,
    batchTranslate,
    changeLanguage,
    setLanguage: changeLanguage, // Alias for compatibility
    availableLanguages,
    isEnglish: currentLanguage === "en",
  };

  // Debug context value
  console.log('🔍 LanguageContext providing:', {
    currentLanguage,
    availableLanguagesCount: availableLanguages.length,
    hasChangeLanguage: !!changeLanguage
  });

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Translation Hook for components
export function useTranslation() {
  const { translateText, currentLanguage, isTranslating } = useLanguage();

  const t = async (text) => {
    if (currentLanguage === "en") return text;
    return await translateText(text, currentLanguage);
  };

  return { t, isTranslating, currentLanguage };
}
