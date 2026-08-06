import { createContext, useContext, useState, useEffect } from "react";
import { translations, translateDynamicContent } from "../translations/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("optinet_lang") || "fr";
  });

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem("optinet_lang", lang);
    }
  };

  const t = (key) => {
    if (!key) return "";
    const langDict = translations[language] || translations["fr"];
    return langDict[key] || translations["fr"][key] || key;
  };

  const tDynamic = (text) => {
    return translateDynamicContent(text, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
