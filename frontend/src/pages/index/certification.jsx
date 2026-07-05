import ciscoLogo from "../../assets/cert-cisco.svg";
import microsoftLogo from "../../assets/cert-microsoft.svg";
import fortinetLogo from "../../assets/cert-fortinet.svg";

const LOGOS = { Cisco: ciscoLogo, Microsoft: microsoftLogo, Fortinet: fortinetLogo };

// Sélection des certifications les plus fortes (modifiable)
const CERTS = [
  { org: "Cisco", name: "CCNA 200-301", year: "2025" },
  { org: "Microsoft", name: "Azure Security Engineer Associate (AZ-500)", year: "2024" },
  { org: "Microsoft", name: "AZ-800 — Infrastructure hybride Windows Server", year: "2024" },
  { org: "Microsoft", name: "Manage identities in Microsoft Entra ID", year: "2024" },
  { org: "Fortinet", name: "NSE 4 — FortiOS 7.2 (Sécurité des réseaux)", year: "2024" },
  { org: "Fortinet", name: "Cloud Security — Web Application & API Security r04", year: "2025" },
  { org: "Fortinet", name: "Sécurité analytique — SOAR r04", year: "2025" },
];

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
        {CERTS.map((c, i) => (
          <div className="cert-card" key={i}>
            <div
              className="cert-badge"
              style={{
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 12,
                boxSizing: "border-box",
              }}
            >
              <img
                src={LOGOS[c.org]}
                alt={c.org}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div className="cert-name">{c.name}</div>
            <div className="cert-org">{c.org}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
