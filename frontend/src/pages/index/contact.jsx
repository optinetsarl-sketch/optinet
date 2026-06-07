import React, { useState } from "react";
import { sendMessage } from "../../services/authService";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [status, setStatus] = useState(null);
  const [payer, setPayer] = useState('TG');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState("");
  const payerInfo = {
    TG: { code: '+228', flag: '🇹🇬', name: 'Togo' },
    FR: { code: '+33', flag: '🇫🇷', name: 'France' },
    US: { code: '+1', flag: '🇺🇸', name: 'USA' },
    CM: { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
    BE: { code: '+32', flag: '🇧🇪', name: 'Belgium' },
    DE: { code: '+49', flag: '🇩🇪', name: 'Germany' },
    GB: { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    // Add more countries as needed
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

    // Clean the phone number (remove spaces)
    let cleanedPhone = numeroDeTelephone.replace(/\s+/g, "");
    const selectedPrefix = payerInfo[payer]?.code || "";
    // If phone matches just prefix or "+", treat as empty/null
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
      setStatus({ success: true, message: "Message envoyé avec succès!" });
      // Reset form (keep phone prefix intact)
      setNom("");
      setEmail("");
      setEntreprise("");
      setSujet("");
      setContenu("");
    } catch (err) {
      console.error(err);
      let errMsg = "Échec de l'envoi du message.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          const errors = Object.entries(data)
            .map(([field, msgs]) => {
              const fieldName = field === "numero_de_telephone" ? "Numéro de téléphone" : field;
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
          <div className="section-tag">Contact</div>
          <h2 className="section-title">
            Parlons de<br />
            <span className="accent">votre projet</span>
          </h2>
          <p className="section-sub">
            Vous avez un projet IT, télécom ou de sécurité ? Nous sommes disponibles pour vous conseiller, établir un devis et intervenir rapidement.
          </p>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">📍</div>
              <div className="contact-card-text">
                <label>Localisation</label>
                <p>Lomé, Togo</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">📞</div>
              <div className="contact-card-text">
                <label>Téléphone</label>
                <p>+228 90 74 84 65</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">📧</div>
              <div className="contact-card-text">
                <label>Email</label>
                <p>contact@optinet.tg</p>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">🕐</div>
              <div className="contact-card-text">
                <label>Disponibilité</label>
                <p>24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-form-wrap">
          <h3>Envoyer un message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom & Prénom</label>
              <input type="text" placeholder="Votre nom complet" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Entreprise</label>
              <input type="text" placeholder="Votre entreprise" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Payer</label>
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
              <label>{payerInfo[payer].flag} {payerInfo[payer].name} Numéro de téléphone</label>
              <input
                type="tel"
                placeholder={`${payerInfo[payer].code} 90 74 84 65`}
                value={numeroDeTelephone}
                onChange={(e) => setNumeroDeTelephone(e.target.value)}
              />
              <small className="form-text">
                Ce numéro sera utilisé pour les notifications de paiement.
              </small>
            </div>
            <div className="form-group">
              <label>Sujet</label>
              <input type="text" placeholder="Sujet du message" value={sujet} onChange={(e) => setSujet(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Décrivez votre projet ou question..." value={contenu} onChange={(e) => setContenu(e.target.value)}></textarea>
            </div>
            <button type="submit" className="form-submit">📝 Envoyer ma demande</button>
          </form>
          {status && (
            <p className={status.success ? "success-msg" : "error-msg"}>{status.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
