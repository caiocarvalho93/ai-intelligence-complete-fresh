// 🌍 TranslatedText Component - Auto-translating text component
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function TranslatedText({ 
  children, 
  text, 
  className = '', 
  style = {},
  fallback = null 
}) {
  const { translateText, currentLanguage, isEnglish } = useLanguage();
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const originalText = text || children;

  useEffect(() => {
    // ATOMIC RESET: Immediately clear translated text when switching to English
    if (isEnglish || !originalText) {
      console.log('🌍 ATOMIC RESET: Clearing translation for English:', originalText);
      setTranslatedText(originalText);
      setIsLoading(false);
      return;
    }

    const translate = async () => {
      setIsLoading(true);
      try {
        console.log('🌍 ATOMIC TRANSLATE:', originalText, 'to', currentLanguage);
        const translated = await translateText(originalText, currentLanguage);
        setTranslatedText(translated);
        console.log('🌍 ATOMIC SUCCESS:', originalText, '->', translated);
      } catch (error) {
        console.error('🚨 ATOMIC TRANSLATION ERROR:', error);
        setTranslatedText(originalText); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [originalText, currentLanguage, isEnglish, translateText]);

  // Listen for language reset events
  useEffect(() => {
    const handleLanguageReset = (event) => {
      if (event.detail.language === 'en') {
        console.log('🌍 FORCE RESET: TranslatedText resetting to English');
        setTranslatedText(originalText);
        setIsLoading(false);
      }
    };

    window.addEventListener('languageReset', handleLanguageReset);
    return () => window.removeEventListener('languageReset', handleLanguageReset);
  }, [originalText]);

  if (isLoading && fallback) {
    return fallback;
  }

  if (isLoading) {
    return (
      <span className={className} style={{ ...style, opacity: 0.7 }}>
        {originalText}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      {translatedText || originalText}
    </span>
  );
}