import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, detectLanguage } from '@shared/languages';
import { translations, Translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first, then browser detection
    const saved = localStorage.getItem('optombazar-language') as Language;
    return saved || detectLanguage();
  });

  useEffect(() => {
    localStorage.setItem('optombazar-language', language);
    
    // Update document lang attribute
    document.documentElement.lang = language;
    
    // Update page title based on language
    document.title = language === 'uz' 
      ? 'OptomBazar.uz - O\'zbekiston optom savdo platformasi' 
      : 'OptomBazar.uz - Оптовая торговая платформа Узбекистана';
  }, [language]);

  const t = (key: keyof Translations) => {
    const translation = translations[key];
    return translation ? translation[language] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}