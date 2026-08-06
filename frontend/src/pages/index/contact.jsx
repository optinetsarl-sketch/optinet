import React, { useState } from "react";
import { sendMessage } from "../../services/authService";
import { useLanguage } from "../../context/LanguageContext";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [status, setStatus] = useState(null);
  const [payer, setPayer] = useState('TG');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState("");
  const { t, language } = useLanguage();

  const payerInfo = {
    TG: { code: '+228', flag: '🇹🇬', name: 'Togo' },
    FR: { code: '+33', flag: '🇫🇷', name: 'France' },
    US: { code: '+1', flag: '🇺🇸', name: 'USA' },
    CM: { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
    BE: { code: '+32', flag: '🇧🇪', name: 'Belgium' },
    DE: { code: '+49', flag: '🇩🇪', name: 'Germany' },
    GB: { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  };

  const handlePayerChange = (e) => {
    const selected = e.target.value;
    setPayer(selected);
    setNumeroDeTelephone((prev) => {
      const trimmed = prev.trim();
      const parts = trimmed.split(' ');
      const rest = parts.length > 1 ? parts.slice(1).join(' ') : '';
      return rest ? `${payerInfo[selected].code} ${rest}` : `${payerInfo[selected].code} `;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    let cleanedPhone = numeroDeTelephone.replace(/\s+/g, "");
    const selectedPrefix = payerInfo[payer]?.code || "";
    if (cleanedPhone === selectedPrefix || cleanedPhone === "+" || !cleanedPhone) {
      cleanedPhone = "";
    }

    try {
      await sendMessage({
        nom,
        email,
        entreprise,
        sujet,
        contenu,
        numero_de_telephone: cleanedPhone || null,
      });
      setStatus({ success: true, message: language === 'zh' ? '消息发送成功！' : language === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès!' });
      setNom("");
      setEmail("");
      setEntreprise("");
      setSujet("");
      setContenu("");
    } catch (err) {
      console.error(err);
      let errMsg = language === 'zh' ? '消息发送失败。' : language === 'en' ? 'Failed to send message.' : "Échec de l'envoi du message.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          const errors = Object.entries(data)
            .map(([field, msgs]) => {
              const fieldName = field === "numero_de_telephone" ? (language === 'zh' ? '电话号码' : language === 'en' ? 'Phone number' : 'Numéro de téléphone') : field;
              return `${fieldName}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`;
            })
            .join(' | ');
          if (errors) errMsg += ` (${errors})`;
        }
      }
      setStatus({ success: false, message: errMsg });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-info">
          <div className="section-tag">{t("contact_tag")}</div>
          <h2 className="section-title">
            {t("contact_title_1")}<br />
            <span className="accent">{t("contact_title_2")}</span>
          </h2>
          <p className="section-sub">
            {t("contact_sub")}
          </p>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">📍</div>
              <div className="contact-card-text">
                <label>{t("contact_loc")}</label>
                <p>Lomé, Togo</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">📞</div>
              <div className="contact-card-text">
                <label>{t("contact_phone")}</label>
                <p>+228 90 74 84 65</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">📧</div>
              <div className="contact-card-text">
                <label>{t("contact_email")}</label>
                <p>contact@optinet.tg</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">🕐</div>
              <div className="contact-card-text">
                <label>{t("contact_avail")}</label>
                <p>24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-form-wrap">
          <h3>{t("contact_send_heading")}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t("contact_fullname")}</label>
              <input type="text" placeholder={t("name")} value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t("email")}</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t("contact_company")}</label>
              <input type="text" placeholder={t("contact_company")} value={entreprise} onChange={(e) => setEntreprise(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t("contact_country")}</label>
              <select
                value={payer}
                onChange={handlePayerChange}
                className="form-select"
              >
                <option value="TG">Togo (+228) 🇹🇬</option>
                <option value="FR">France (+33) 🇫🇷</option>
                <option value="US">USA (+1) 🇺🇸</option>
                <option value="CM">Cameroun (+237) 🇨🇲</option>
                <option value="BE">Belgique (+32) 🇧🇪</option>
                <option value="DE">Allemagne (+49) 🇩🇪</option>
                <option value="GB">Royaume‑Uni (+44) 🇬🇧</option>
              </select>
            </div>
            <div className="form-group">
              <label>{payerInfo[payer].flag} {payerInfo[payer].name} {t("phone")}</label>
              <input
                type="tel"
                placeholder={`${payerInfo[payer].code} 90 74 84 65`}
                value={numeroDeTelephone}
                onChange={(e) => setNumeroDeTelephone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t("contact_subject")}</label>
              <input type="text" placeholder={t("contact_subject")} value={sujet} onChange={(e) => setSujet(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t("contact_message")}</label>
              <textarea placeholder={t("message")} value={contenu} onChange={(e) => setContenu(e.target.value)}></textarea>
            </div>
            <button type="submit" className="form-submit">{t("contact_submit_btn")}</button>
          </form>
          {status && (
            <p className={status.success ? "success-msg" : "error-msg"}>{status.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
