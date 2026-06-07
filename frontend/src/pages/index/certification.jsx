export default function Certifications() {
  return (
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
  );
}
