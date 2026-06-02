import { useEffect } from "react";
import "./styles/index.css";

function Home() {
  useEffect(() => {
    // Navbar scroll effect
    const handleScroll = () => {
      const nav = document.getElementById("navbar");
      if (window.scrollY > 60) {
        nav.style.background = "rgba(2,11,24,0.97)";
      } else {
        nav.style.background = "rgba(2,11,24,0.85)";
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(
      ".service-card, .cert-card, .about-feature, .contact-card, .stat-item"
    );
    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      observer.observe(el);
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav id="navbar">
        <a className="nav-logo" href="#hero">
          <div className="nav-logo-circle">O</div>
          <span className="nav-logo-text">
            Opti<span>Net</span>
          </span>
        </a>
        <ul>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#about">À propos</a>
          </li>
          <li>
            <a href="#director">Direction</a>
          </li>
          <li>
            <a href="#certifications">Certifications</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <button className="nav-cta">Demander un devis</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              🇹🇬 Lomé, Togo • Solutions IT & Télécom
            </div>
            <h1>
              L'Expertise IT au
              <br />
              <span className="accent">Service de Votre</span>
              <br />
              Croissance
            </h1>
            <p className="hero-desc">
              OPTINET SARL U est votre partenaire technologique de confiance au
              Togo. Réseaux, sécurité, télécommunications et infrastructures
              numériques — nous connectons votre organisation au futur.
            </p>
            <div className="hero-btns">
              <a href="#services" className="btn-primary">
                Découvrir nos solutions
              </a>
              <a href="#contact" className="btn-outline">
                Nous contacter
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-float-badge">
              <div className="val">
                100<span>+</span>
              </div>
              <div className="lbl">Projets réalisés</div>
            </div>
            <div className="hero-card-main">
              <div className="hc-logo-area">
                <div className="hc-logo-icon">O</div>
                <div>
                  <div className="hc-logo-name">
                    Opti<span>Net</span> SARL U
                  </div>
                  <div className="hc-logo-sub">
                    Solutions IT • Réseaux • Télécommunications
                  </div>
                </div>
              </div>
              <div className="hc-metrics">
                <div className="hc-metric">
                  <div className="hc-metric-val">100+</div>
                  <div className="hc-metric-label">Projets réalisés</div>
                </div>
                <div className="hc-metric">
                  <div className="hc-metric-val">24/7</div>
                  <div className="hc-metric-label">Support disponible</div>
                </div>
              </div>
              <div className="hc-services-list">
                <div className="hc-service-item">Infrastructure réseau</div>
                <div className="hc-service-item">Sécurité informatique</div>
                <div className="hc-service-item">Support technique</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-banner">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num">1 000 000</div>
            <div className="stat-label">FCFA Capital Social</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">CCNA</div>
            <div className="stat-label">Certifié Cisco 200-301</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">NSE 4</div>
            <div className="stat-label">Certifié Fortinet</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">AZ-500</div>
            <div className="stat-label">Certifié Microsoft Azure</div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <div className="services-header">
          <div className="section-tag">Nos Services</div>
          <h2 className="section-title">
            Des <span className="accent">Solutions Complètes</span>
            <br />
            pour Votre Organisation
          </h2>
          <p className="section-sub">
            OPTINET SARL U propose une gamme complète de services IT et télécom
            adaptés aux besoins des institutions publiques et entreprises
            privées au Togo et dans la sous-région.
          </p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <div className="service-title">Réseaux & Infrastructure</div>
            <div className="service-desc">
              Conception, installation et maintenance d'infrastructures réseau
              LAN/WAN. Câblage structuré, points d'accès Wi-Fi, commutateurs et
              routeurs.
            </div>
            <div className="service-tags">
              <span className="service-tag">LAN/WAN</span>
              <span className="service-tag">Wi-Fi</span>
              <span className="service-tag">Câblage</span>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🔒</div>
            <div className="service-title">Sécurité & Surveillance</div>
            <div className="service-desc">
              Installation de caméras de surveillance CCTV, contrôle d'accès,
              sécurité réseau Fortinet et protection de vos infrastructures
              critiques.
            </div>
            <div className="service-tags">
              <span className="service-tag">CCTV</span>
              <span className="service-tag">Fortinet</span>
              <span className="service-tag">Sécurité</span>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📡</div>
            <div className="service-title">Fibre Optique & Télécoms</div>
            <div className="service-desc">
              Déploiement et maintenance fibre optique (OTDR, fusion splicer),
              transmission radio, antennes micro-ondes et solutions
              téléphoniques.
            </div>
            <div className="service-tags">
              <span className="service-tag">Fibre Optique</span>
              <span className="service-tag">Micro-ondes</span>
              <span className="service-tag">Radio</span>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🖥️</div>
            <div className="service-title">Serveurs & Virtualisation</div>
            <div className="service-desc">
              Installation et administration de serveurs, virtualisation
              (Hyper-V, VMware), cloud hybride Azure, déploiement
              d'applications serveur.
            </div>
            <div className="service-tags">
              <span className="service-tag">Hyper-V</span>
              <span className="service-tag">VMware</span>
              <span className="service-tag">Azure</span>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📞</div>
            <div className="service-title">Téléphonie d'Entreprise</div>
            <div className="service-desc">
              Mise en service de systèmes de téléphonie IP interne et externe,
              centraux téléphoniques et solutions de communication unifiée.
            </div>
            <div className="service-tags">
              <span className="service-tag">VoIP</span>
              <span className="service-tag">Centraux</span>
              <span className="service-tag">IP</span>
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🎓</div>
            <div className="service-title">Conseil & Formation</div>
            <div className="service-desc">
              Accompagnement en transformation numérique, formation sur les
              outils bureautiques et techniques, audit et documentation des
              systèmes.
            </div>
            <div className="service-tags">
              <span className="service-tag">Conseil</span>
              <span className="service-tag">Formation</span>
              <span className="service-tag">Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-img-wrap">
              <div className="about-big-logo">O</div>
              <div className="about-company-name">
                Opti<span>Net</span> SARL U
              </div>
              <div className="about-company-sub">
                Solutions IT • Réseaux • Télécommunications
              </div>
              <div className="about-info-grid">
                <div className="about-info-item">
                  <div className="about-info-label">Siège Social</div>
                  <div className="about-info-val">Lomé, Togo</div>
                </div>
                <div className="about-info-item">
                  <div className="about-info-label">Créée</div>
                  <div className="about-info-val">2026</div>
                </div>
                <div className="about-info-item">
                  <div className="about-info-label">Secteur</div>
                  <div className="about-info-val">IT & Télécom</div>
                </div>
                <div className="about-info-item">
                  <div className="about-info-label">Domaine</div>
                  <div className="about-info-val">Services Techniques</div>
                </div>
              </div>
            </div>
            <div className="about-float">
              <div className="about-float-val">100+</div>
              <div className="about-float-lbl">Projets réalisés</div>
            </div>
          </div>
          <div className="about-content">
            <div className="section-tag">À Propos</div>
            <h2 className="section-title">
              Qui sommes-<br />
              <span className="accent">nous ?</span>
            </h2>
            <p className="section-sub">
              OPTINET SARL U est une société togolaise de technologie,
              enregistrée et opérationnelle depuis 2026. Spécialisée dans les
              solutions IT, les réseaux et les télécommunications, elle
              intervient auprès d'institutions publiques et privées pour la
              modernisation de leurs infrastructures numériques.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">⚡</div>
                <div className="about-feature-text">
                  <h4>Réactivité & Expertise</h4>
                  <p>
                    Une équipe hautement qualifiée avec certifications
                    internationales et expérience opérationnelle.
                  </p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🎯</div>
                <div className="about-feature-text">
                  <h4>Solutions Sur Mesure</h4>
                  <p>
                    Adaptées à vos besoins spécifiques, scalables et pérennes.
                  </p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🛡️</div>
                <div className="about-feature-text">
                  <h4>Sécurité en Priorité</h4>
                  <p>
                    Conformité aux standards internationaux et protection
                    maximale de vos données.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="cert-section" id="certifications">
        <div className="cert-header">
          <div className="section-tag">Certifications</div>
          <h2 className="section-title">
            Standards <span className="accent">Internationaux</span>
          </h2>
          <p className="section-sub">
            Notre expertise est validée par les plus grandes certifications
            mondiales dans les domaines IT, réseau et cybersécurité.
          </p>
        </div>
        <div className="cert-grid">
          <div className="cert-card">
            <div className="cert-badge">C</div>
            <div className="cert-name">CCNA 200-301</div>
            <div className="cert-org">Cisco</div>
            <div className="cert-year">2025</div>
          </div>
          <div className="cert-card">
            <div className="cert-badge">F</div>
            <div className="cert-name">NSE 4 – FortiOS 7.2</div>
            <div className="cert-org">Fortinet</div>
            <div className="cert-year">2024</div>
          </div>
          <div className="cert-card">
            <div className="cert-badge">M</div>
            <div className="cert-name">AZ-500 Security Engineer</div>
            <div className="cert-org">Microsoft Azure</div>
            <div className="cert-year">2024</div>
          </div>
          <div className="cert-card">
            <div className="cert-badge">M</div>
            <div className="cert-name">AZ-800 Windows Server</div>
            <div className="cert-org">Microsoft Azure</div>
            <div className="cert-year">2024</div>
          </div>
        </div>
      </section>

      {/* DIRECTOR */}
      <section className="director-section" id="director">
        <div className="director-grid">
          <div className="director-avatar">
            <div className="avatar-circle">N</div>
            <div className="director-name">NABINE Tassounti</div>
            <div className="director-role">Directeur Général – OPTINET SARL U</div>
            <div className="director-contacts">
              <div className="director-contact-item">
                <span>📧</span> nabine@optinet.tg
              </div>
              <div className="director-contact-item">
                <span>📞</span> +228 90 74 84 65
              </div>
              <div className="director-contact-item">
                <span>🌐</span> LinkedIn: NABINE Tassounti
              </div>
            </div>
          </div>
          <div className="director-content">
            <div className="section-tag">Notre Directeur</div>
            <h2 className="section-title">
              Une Vision,
              <br />
              <span className="accent">une Expertise</span>
            </h2>
            <p className="section-sub">
              M. NABINE Tassounti est un ingénieur réseaux et
              télécommunications avec plus de 5 ans d'expérience sur le terrain.
              Il a conçu et déployé des infrastructures pour certaines des
              institutions les plus stratégiques du Togo, avec des
              certifications internationales de haut niveau.
            </p>
            <div className="skill-list">
              <span className="skill-chip">Réseaux Cisco</span>
              <span className="skill-chip">Sécurité Fortinet</span>
              <span className="skill-chip">Cloud Azure</span>
              <span className="skill-chip">Virtualisation</span>
              <span className="skill-chip">Fibre Optique</span>
              <span className="skill-chip">Télécoms</span>
              <span className="skill-chip">Management</span>
              <span className="skill-chip">Documentation</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="contact-info">
            <div className="section-tag">Contact</div>
            <h2 className="section-title">
              Parlons de
              <br />
              <span className="accent">votre projet</span>
            </h2>
            <p className="section-sub">
              Vous avez un projet IT, télécom ou de sécurité ? Nous sommes
              disponibles pour vous conseiller, établir un devis et intervenir
              rapidement.
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
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Nom & Prénom</label>
                <input type="text" placeholder="Votre nom complet" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="votre@email.com" />
              </div>
              <div className="form-group">
                <label>Entreprise</label>
                <input type="text" placeholder="Votre entreprise" />
              </div>
              <div className="form-group">
                <label>Service demandé</label>
                <select>
                  <option value="">-- Sélectionner --</option>
                  <option value="network">Réseaux & Infrastructure</option>
                  <option value="security">Sécurité & Surveillance</option>
                  <option value="telecom">Fibre Optique & Télécoms</option>
                  <option value="servers">Serveurs & Virtualisation</option>
                  <option value="telephony">Téléphonie d'Entreprise</option>
                  <option value="consulting">Conseil & Formation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Décrivez votre projet ou question..."
                ></textarea>
              </div>
              <button type="submit" className="form-submit">
                📨 Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">
              <div className="footer-logo-circle">O</div>
              <span className="footer-logo-text">
                Opti<span>Net</span>
              </span>
            </div>
            <p className="footer-desc">
              Solutions informatiques, réseaux et télécommunications au service
              des institutions publiques et entreprises privées en Afrique de
              l'Ouest.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">CCNA 200-301</span>
              <span className="footer-badge">NSE 4</span>
              <span className="footer-badge">AZ-500</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#about">À Propos</a>
              </li>
              <li>
                <a href="#certifications">Certifications</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="#services">Réseaux IT</a>
              </li>
              <li>
                <a href="#services">Sécurité</a>
              </li>
              <li>
                <a href="#services">Télécoms</a>
              </li>
              <li>
                <a href="#services">Support</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Légal</h4>
            <ul>
              <li>
                <a href="#">Confidentialité</a>
              </li>
              <li>
                <a href="#">Conditions</a>
              </li>
              <li>
                <a href="#">RCCM: TG-LOM-2026-B12345</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 <strong>OPTINET SARL U</strong>. Tous droits réservés.
          </p>
          <div className="footer-legal">
            <span>Politique de confidentialité</span>
            <span>Conditions d'utilisation</span>
            <span>RCCM: TG-LOM-2026-B12345</span>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a
        className="whatsapp-float"
        href="https://wa.me/22890748465"
        target="_blank"
        rel="noreferrer"
        title="Discuter sur WhatsApp"
      >
        💬
      </a>
    </>
  );
}

export default Home;