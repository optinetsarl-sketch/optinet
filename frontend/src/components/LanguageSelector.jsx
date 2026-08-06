import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "zh", label: "ZH", flag: "🇨🇳", name: "中文 (Chinese)" },
];

const LanguageSelector = ({ isMobile = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", padding: "10px 0" }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            style={{
              background: language === lang.code ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: language === lang.code ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.15)",
              color: language === lang.code ? "#10b981" : "#fff",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sélectionner la langue"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "20px",
          color: "#fff",
          padding: "5px 12px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s ease",
          backdropFilter: "blur(4px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.borderColor = "#10b981";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
        }}
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <span style={{ fontSize: "10px", opacity: 0.7, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#020b18",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            padding: "6px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            zIndex: 1000,
            minWidth: "140px",
            backdropFilter: "blur(12px)",
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                background: language === lang.code ? "rgba(16, 185, 129, 0.15)" : "transparent",
                border: "none",
                color: language === lang.code ? "#10b981" : "#e2e8f0",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: language === lang.code ? "700" : "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "15px" }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
