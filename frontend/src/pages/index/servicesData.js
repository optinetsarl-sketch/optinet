import img1 from "../../assets/services/service-1.jpg";
import img2 from "../../assets/services/service-2.jpg";
import img3 from "../../assets/services/service-3.jpg";
import img4 from "../../assets/services/service-4.jpg";
import img5 from "../../assets/services/service-5.jpg";
import img6 from "../../assets/services/service-6.jpg";

const servicesData = [
  {
    id: 1,
    slug: "reseaux",
    icon: "🌐",
    image: img1,
    title: "Réseaux & Infrastructure",
    desc: "Conception, installation et maintenance d'infrastructures réseau LAN/WAN.",
    fullDesc:
      "Nous réalisons l'audit, le câblage structuré (Cat 6/7), le déploiement de commutateurs et routeurs Cisco/MikroTik, ainsi que l'optimisation de la couverture Wi-Fi.",
    tags: ["LAN/WAN", "Wi-Fi", "Câblage"],
  },
  {
    id: 2,
    slug: "securite",
    icon: "🔒",
    image: img2,
    title: "Sécurité & Surveillance",
    desc: "Installation de caméras de surveillance CCTV et contrôle d'accès.",
    fullDesc:
      "Protection périmétrique avec caméras IP HD, sécurité réseau Fortinet et protection de vos infrastructures critiques contre les intrusions.",
    tags: ["CCTV", "Fortinet", "Sécurité"],
  },
  {
    id: 3,
    slug: "fibre",
    icon: "📡",
    image: img3,
    title: "Fibre Optique & Télécoms",
    desc: "Déploiement et maintenance fibre optique et transmission radio.",
    fullDesc:
      "Soudure de fibre, test OTDR, installation d'antennes micro-ondes et solutions de transmission longue distance.",
    tags: ["Fibre Optique", "Micro-ondes", "Radio"],
  },
  {
    id: 4,
    slug: "serveurs",
    icon: "🖥️",
    image: img4,
    title: "Serveurs & Virtualisation",
    desc: "Administration de serveurs et solutions cloud hybride Azure.",
    fullDesc:
      "Installation de serveurs physiques, virtualisation VMware/Hyper-V et mise en place de solutions Cloud et sauvegardes déportées.",
    tags: ["Hyper-V", "VMware", "Azure"],
  },
  {
    id: 5,
    slug: "telephonie",
    icon: "📞",
    image: img5,
    title: "Téléphonie d'Entreprise",
    desc: "Mise en service de systèmes de téléphonie IP et VoIP.",
    fullDesc:
      "Installation de centraux téléphoniques (PABX/IPBX), configuration de téléphones IP et solutions de communication unifiée.",
    tags: ["VoIP", "Centraux", "IP"],
  },
  {
    id: 6,
    slug: "conseil",
    icon: "🎓",
    image: img6,
    title: "Conseil & Formation",
    desc: "Accompagnement en transformation numérique et audit.",
    fullDesc:
      "Audit complet de votre parc informatique, conseil stratégique et formation de vos équipes aux nouvelles technologies.",
    tags: ["Conseil", "Formation", "Audit"],
  },
];

export default servicesData;
