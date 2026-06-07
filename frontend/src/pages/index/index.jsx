// import React from "react";
// import { Link } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
// IMPORT DE TON IMAGE LOCALE
import heroBg from "../../assets/360_F_521661218_MNYc5lCrIQUKKwBfIGzxJYHYxZzwNof9.jpg";
export default function Homes() {
  return (
      <section className="hero-modern" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <div className="dot"></div>
            <span>🇹🇬 Lomé, Togo • Solutions IT , Télécom & WEB </span>
          </div>

          <h1 className="hero-title">
            L'Expertise  <br />
            <span className="accent-text">au Service de Votre Croissance</span>
          </h1>

          <p className="hero-description">
          <strong>OPTINET SARL U</strong> est votre partenaire technologique de confiance au Togo. 
                                        Réseaux, sécurité, télécommunications et infrastructures numériques — 
                                          nous connectons votre organisation au futur.
                                    </p>

          <div className="hero-features">
            <div className="feat"><span>✔</span> Réseaux & Serveurs</div>
            <div className="feat"><span>✔</span> Sécurité informatique </div>
            <div className="feat"><span>✔</span> Télécommunications</div>
            <div className="feat"><span>✔</span> Infrastructures Numériques</div>
            {/* <div className="feat"><span>✔</span> </div> */}
            <div className="feat"><span>✔</span> Logiciels </div>
          </div>
          <br />
          <br />
          <div className="hero-btns">
            <Link to="/contact" className="btn-main">Lancer Un Projet Avec Nous</Link>
            <Link to="/services" className="btn-outline">Nos services</Link>
          </div>
        </div>
      </div>
    </section>
  );
}