// LanguageContext.js
import React,{ createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export  const  LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("lng")?localStorage.getItem("lng"):'en');

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export   const    useLanguage = () => useContext(LanguageContext);
