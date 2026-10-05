import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  christmasFlyerEn,
  christmasFlyerFr,
  christmasBg1,
  christmasBg2,
  christmasBg3,
  christmasBg4,
  christmasBg5,
} from "./christmasImages";
import { useLanguage } from "../../context/LanguageContext";
import "./christmas.css";

const PAYPAL_DONATION_URL = "https://www.paypal.com/ncp/payment/462YTWR7AWK6N";

const christmasContent = {
  fr: {
    badge: "OPTINET • Initiative de solidarité",
    title: "Noël en brousse 2026",
    slogan: "Ensemble, apportons le sourire à chaque village !",
    description: "Rejoignez OPTINET pour apporter de la joie, de la solidarité et des moments de partage aux enfants et aux communautés rurales du Togo.",
    donate: "DONNER MAINTENANT",
    learn: "EN SAVOIR PLUS",
    previousSlide: "Affiche précédente",
    nextSlide: "Affiche suivante",
    slideLabel: "Afficher l'affiche",
    flyerAlt: "Affiche de Noël en brousse 2026",
    note: "Les informations de paiement Western Union Business seront ajoutées dès leur confirmation.",
    metaDescription: "Noël en brousse 2026 est une initiative de solidarité OPTINET qui soutient les enfants et les communautés rurales du Togo à travers des cadeaux, du partage alimentaire, le soutien scolaire et des activités éducatives.",
    metaOgDescription: "Ensemble, apportons le sourire à chaque village !",
    aboutEyebrow: "Projet",
    aboutTitle: "À propos de Noël en brousse 2026",
    aboutParagraphs: [
      "Noël en brousse 2026 est une initiative de solidarité organisée par OPTINET SARL-U pour apporter de la joie, du partage et du soutien aux enfants, aux familles et aux communautés rurales du Togo.",
      "L'initiative vise à créer des moments de bonheur à travers des cadeaux, le partage alimentaire, les activités pour enfants, le soutien scolaire et les activités éducatives.",
      "Au-delà de la célébration elle-même, le projet promeut la solidarité, la dignité, la proximité et l'engagement communautaire."
    ],
    objectiveEyebrow: "Objectifs",
    objectiveTitle: "Nos objectifs",
    objectiveList: [
      "Apporter de la joie et des sourires aux enfants des communautés rurales.",
      "Partager la nourriture et les biens essentiels avec les familles et les membres de la communauté.",
      "Offrir des cadeaux et des ressources utiles aux enfants.",
      "Soutenir les élèves grâce aux fournitures scolaires et aux ressources éducatives.",
      "Créer des moments de partage et de cohésion communautaire.",
      "Promouvoir la solidarité et la responsabilité sociale.",
      "Organiser des activités éducatives et récréatives pour les enfants.",
      "Encourager des initiatives de soutien communautaire à long terme."
    ],
    supportEyebrow: "Soutien",
    supportTitle: "Qui nous soutenons",
    beneficiaries: [
      { title: "Enfants", text: "Les enfants vivant dans les communautés rurales.", icon: "" },
      { title: "Familles vulnérables", text: "Les familles et individus qui peuvent avoir besoin d'un soutien supplémentaire.", icon: "" },
      { title: "Personnes âgées", text: "Les personnes âgées et les individus ayant besoin d'une attention particulière.", icon: "" },
      { title: "Étudiants", text: "Les étudiants qui peuvent bénéficier de fournitures scolaires et de ressources éducatives.", icon: "" }
    ],
    activitiesEyebrow: "Activités",
    activitiesTitle: "Nos 5 principales activités",
    activities: [
      { number: "01", title: "Distribution de cadeaux", icon: "", description: "Distribution de cadeaux aux enfants et aux bénéficiaires du projet." },
      { number: "02", title: "Partage alimentaire", icon: "", description: "Organisation d'un moment de partage autour d'un repas communautaire." },
      { number: "03", title: "Activités pour enfants", icon: "", description: "Jeux, animations, musique, danse, concours et activités récréatives destinées aux enfants." },
      { number: "04", title: "Soutien scolaire", icon: "", description: "Distribution de fournitures scolaires, livres et ressources éducatives." },
      { number: "05", title: "Projection de film éducatif sous la lune", icon: "", description: "Projection d'un film éducatif en plein air, sous le clair de lune, afin de proposer aux enfants un moment à la fois divertissant et éducatif." }
    ],
    actionEyebrow: "Action",
    actionTitle: "Comment vous pouvez aider",
    helpOptions: [
      "Soutien financier",
      "Dons alimentaires",
      "Vêtements et chaussures",
      "Jouets, livres et jeux éducatifs",
      "Fournitures scolaires",
      "Produits d'hygiène",
      "Soutien logistique",
      "Bénévolat / assistance humaine"
    ],
    donationEyebrow: "Don",
    donationTitle: "Soutenez Noël en brousse 2026",
    donationText: "Chaque contribution, petite ou grande, peut nous aider à apporter des sourires aux enfants et aux familles des communautés rurales du Togo.",
    donationAmountTitle: "Montant libre",
    donationAmountText: "Choisissez vous-même le montant de votre contribution sur la page sécurisée PayPal.",
    securePaymentTitle: "Paiement sécurisé par PayPal",
    paymentDetails: "Le paiement et les coordonnées nécessaires sont saisis directement sur PayPal.",
    westernUnion: "Western Union :",
    westernUnionText: "Les détails seront ajoutés une fois le compte Business configuré.",
    impactMessageEyebrow: "Impact",
    impactMessageTitle: "Votre soutien fait une différence",
    impactMessageParagraphs: [
      "Les entreprises, associations, particuliers, fournisseurs, employés et partenaires sont invités à soutenir Noël en brousse 2026.",
      "Votre contribution peut aider à fournir des cadeaux, des repas, des vêtements, des fournitures scolaires et des moments de bonheur aux enfants et aux familles des communautés rurales du Togo.",
      "Ensemble, nous pouvons apporter le sourire à chaque village."
    ],
    infoEyebrow: "Informations du projet",
    infoTitle: "Informations du projet",
    infoItems: [
      { label: "Date", value: "24 ou 25 décembre 2026" },
      { label: "Pays", value: "Togo" },
      { label: "Lieu", value: "Communautés rurales / villages du Togo" },
      { label: "Organisateur", value: "OPTINET SARL-U" }
    ],
    infoNote: "Le village exact sera communiqué ultérieurement lorsqu'il sera officiellement sélectionné.",
    galleryEyebrow: "Galerie",
    galleryTitle: "Galerie",
    galleryCards: ["Préparatifs", "Dons", "Activités enfants", "Partage communautaire", "Moments de l'événement", "Projection éducative sous la lune"],
    galleryNote: "Les photos et vidéos d'enfants doivent être publiées en respectant leur dignité et leur vie privée, et uniquement avec l'autorisation appropriée lorsque cela est nécessaire.",
    impactEyebrow: "Impact",
    impactTitle: "Notre impact",
    impactStats: [
      { label: "Enfants soutenus", value: "À venir" },
      { label: "Familles touchées", value: "À venir" },
      { label: "Cadeaux distribués", value: "À venir" },
      { label: "Kits scolaires fournis", value: "À venir" },
      { label: "Repas partagés", value: "À venir" },
      { label: "Bénévoles impliqués", value: "À venir" },
      { label: "Villages touchés", value: "À venir" }
    ],
    futureEyebrow: "Avenir",
    futureTitle: "À l'avenir",
    futureParagraphs: [
      "Noël en brousse est conçu pour devenir une initiative annuelle.",
      "À l'avenir, l'initiative pourra s'étendre à davantage de villages et d'enfants et impliquer davantage de partenaires.",
      "Les activités futures peuvent inclure des initiatives éducatives, scolaires, sanitaires, hygiéniques et environnementales."
    ],
    valuesEyebrow: "Valeurs",
    valuesTitle: "Nos valeurs",
    values: [
      { title: "Solidarité", text: "Soutenir les personnes et les communautés.", icon: "" },
      { title: "Partage", text: "Créer des moments de générosité et de cohésion.", icon: "" },
      { title: "Proximité", text: "Être proche des communautés rurales et de leurs besoins.", icon: "" },
      { title: "Dignité", text: "Respecter chaque bénéficiaire, surtout les enfants.", icon: "" },
      { title: "Engagement", text: "Travailler ensemble pour créer un impact significatif et durable.", icon: "" }
    ],
    contactEyebrow: "Contact",
    contactTitle: "Contactez-nous",
    phone: "Téléphone : +228 90 74 84 65",
    location: "Localisation : Agoè-Nyivé – Togo",
    cta: "Contact OPTINET",
    shareEyebrow: "Partager",
    shareTitle: "Partager le projet",
    shareText: "Ensemble, apportons le sourire à chaque village !",
    projectName: "Noël en brousse 2026"
  },
  en: {
    badge: "OPTINET • Solidarity Initiative",
    title: "Christmas in the Bush 2026",
    slogan: "Together, Bringing Smiles to Every Village!",
    description: "Join OPTINET in bringing Christmas joy, solidarity and meaningful moments to children and rural communities in Togo.",
    donate: "DONATE NOW",
    learn: "LEARN MORE",
    previousSlide: "Previous flyer",
    nextSlide: "Next flyer",
    slideLabel: "Show flyer",
    flyerAlt: "Christmas in the Bush 2026 campaign flyer",
    note: "Western Union Business payment details will be added once confirmed.",
    metaDescription: "Christmas in the Bush 2026 is an OPTINET solidarity initiative supporting children and rural communities in Togo through gifts, food sharing, school support and educational activities.",
    metaOgDescription: "Together, Bringing Smiles to Every Village!",
    aboutEyebrow: "Project",
    aboutTitle: "About Christmas in the Bush 2026",
    aboutParagraphs: [
      "Christmas in the Bush 2026 is a solidarity initiative organized by OPTINET SARL-U to bring Christmas joy, sharing and support to children, families and rural communities in Togo.",
      "The initiative aims to create meaningful moments of happiness through gifts, food sharing, children's activities, school support and educational activities.",
      "Beyond the celebration itself, the project promotes solidarity, dignity, proximity and community engagement."
    ],
    objectiveEyebrow: "Goals",
    objectiveTitle: "Our Objectives",
    objectiveList: [
      "Bring joy and smiles to children in rural communities.",
      "Share food and essential items with families and community members.",
      "Provide gifts and useful resources to children.",
      "Support students through school supplies and educational materials.",
      "Create meaningful moments of sharing and community togetherness.",
      "Promote solidarity and social responsibility.",
      "Organize educational and entertaining activities for children.",
      "Encourage long-term community support initiatives."
    ],
    supportEyebrow: "Support",
    supportTitle: "Who We Support",
    beneficiaries: [
      { title: "Children", text: "Children living in rural communities.", icon: "" },
      { title: "Vulnerable Families", text: "Families and individuals who may need additional support.", icon: "" },
      { title: "Elderly People", text: "Elderly people and individuals requiring special attention.", icon: "" },
      { title: "Students", text: "Students who can benefit from school supplies and educational resources.", icon: "" }
    ],
    activitiesEyebrow: "Activities",
    activitiesTitle: "Our 5 Main Activities",
    activities: [
      { number: "01", title: "Gift Distribution", icon: "", description: "Distribution of gifts to children and project beneficiaries." },
      { number: "02", title: "Food Sharing", icon: "", description: "Organizing a community meal and a moment of sharing." },
      { number: "03", title: "Activities for Children", icon: "", description: "Games, entertainment, music, dance, competitions and recreational activities for children." },
      { number: "04", title: "School Support", icon: "", description: "Distribution of school supplies, books and educational resources." },
      { number: "05", title: "Educational Film Screening under the Moonlight", icon: "", description: "Open-air educational film screening under the moonlight to provide children with an entertaining and educational experience." }
    ],
    actionEyebrow: "Action",
    actionTitle: "How You Can Help",
    helpOptions: [
      "Financial Support",
      "Food Donations",
      "Clothing and shoes",
      "Toys, books and educational games",
      "School Supplies",
      "Hygiene Products",
      "Logistics Support",
      "Volunteer / Human Support"
    ],
    donationEyebrow: "Donation",
    donationTitle: "Support Christmas in the Bush 2026",
    donationText: "Every contribution, big or small, can help us bring smiles to children and families in rural communities in Togo.",
    donationAmountTitle: "Choose your amount",
    donationAmountText: "Enter the amount of your choice on the secure PayPal page.",
    securePaymentTitle: "Secure payment with PayPal",
    paymentDetails: "Payment and any required details are entered directly on PayPal.",
    westernUnion: "Western Union:",
    westernUnionText: "Details to be added once the Business account is configured.",
    impactMessageEyebrow: "Impact",
    impactMessageTitle: "Your Support Makes a Difference",
    impactMessageParagraphs: [
      "Companies, associations, individuals, suppliers, employees and partners are invited to support Christmas in the Bush 2026.",
      "Your contribution can help provide gifts, meals, clothing, school supplies and meaningful moments of happiness to children and families in rural communities in Togo.",
      "Together, we can bring smiles to every village."
    ],
    infoEyebrow: "Project Information",
    infoTitle: "Project Information",
    infoItems: [
      { label: "Date", value: "December 24 or 25, 2026" },
      { label: "Country", value: "Togo" },
      { label: "Location", value: "Rural communities / villages in Togo" },
      { label: "Organizer", value: "OPTINET SARL-U" }
    ],
    infoNote: "The exact village will be communicated later when officially selected.",
    galleryEyebrow: "Gallery",
    galleryTitle: "Gallery",
    galleryCards: ["Preparations", "Donations", "Children Activities", "Community Sharing", "Event Moments", "Moonlight Educational Screening"],
    galleryNote: "Photos and videos of children must be published with respect for their dignity and privacy, and only with appropriate authorization when necessary.",
    impactEyebrow: "Impact",
    impactTitle: "Our Impact",
    impactStats: [
      { label: "Children supported", value: "Coming Soon" },
      { label: "Families reached", value: "Coming Soon" },
      { label: "Gifts distributed", value: "Coming Soon" },
      { label: "School kits provided", value: "Coming Soon" },
      { label: "Meals shared", value: "Coming Soon" },
      { label: "Volunteers involved", value: "Coming Soon" },
      { label: "Villages reached", value: "Coming Soon" }
    ],
    futureEyebrow: "Future",
    futureTitle: "Looking Ahead",
    futureParagraphs: [
      "Christmas in the Bush is intended to become an annual initiative.",
      "In the future, the initiative may expand to reach more villages and children and involve additional partners.",
      "Future activities may include educational, school, health, hygiene and environmental initiatives."
    ],
    valuesEyebrow: "Values",
    valuesTitle: "Our Values",
    values: [
      { title: "Solidarity", text: "Supporting people and communities.", icon: "" },
      { title: "Sharing", text: "Creating moments of generosity and togetherness.", icon: "" },
      { title: "Proximity", text: "Being close to rural communities and their needs.", icon: "" },
      { title: "Dignity", text: "Respecting every beneficiary, especially children.", icon: "" },
      { title: "Commitment", text: "Working together to create meaningful and lasting impact.", icon: "" }
    ],
    contactEyebrow: "Contact",
    contactTitle: "Contact Us",
    phone: "Phone: +228 90 74 84 65",
    location: "Location: Agoè-Nyivé – Togo",
    cta: "Contact OPTINET",
    shareEyebrow: "Share",
    shareTitle: "Share the Project",
    shareText: "Together, Bringing Smiles to Every Village!",
    projectName: "Christmas in the Bush 2026"
  },
  zh: {
    badge: "OPTINET • 公益倡议",
    title: "丛林圣诞2026",
    slogan: "一起，让每个村庄都充满笑声！",
    description: "加入 OPTINET，给多哥乡村社区和儿童带来圣诞欢乐、团结与有意义的时刻。",
    donate: "立即捐赠",
    learn: "了解更多",
    previousSlide: "上一张海报",
    nextSlide: "下一张海报",
    slideLabel: "显示海报",
    flyerAlt: "丛林圣诞2026宣传海报",
    note: "Western Union 商务付款详情将在确认后补充。",
    metaDescription: "丛林圣诞2026 是 OPTINET 的一项公益倡议，支持多哥的儿童和乡村社区，通过礼物、食物分发、学校支持和教育活动带来欢乐与帮助。",
    metaOgDescription: "一起，让每个村庄都充满笑声！",
    aboutEyebrow: "项目",
    aboutTitle: "关于丛林圣诞2026",
    aboutParagraphs: [
      "丛林圣诞2026 是由 OPTINET SARL-U 发起的一项公益倡议，旨在为多哥的儿童、家庭和乡村社区带来圣诞的欢乐、分享与支持。",
      "该倡议旨在通过礼物分发、食物共享、儿童活动、学校支持和教育活动创造有意义的幸福时刻。",
      "除了庆祝本身之外，这个项目还倡导团结、尊严、贴近社区和共同参与。"
    ],
    objectiveEyebrow: "目标",
    objectiveTitle: "我们的目标",
    objectiveList: [
      "为农村社区的儿童带来欢乐和笑声。",
      "与家庭和社区成员分享食物及必要物资。",
      "为儿童提供礼物和实用资源。",
      "通过校具和教育资料支持学生。",
      "创造有意义的分享与社区团结时刻。",
      "促进团结与社会责任感。",
      "为儿童组织教育性和娱乐性的活动。",
      "鼓励长期社区支持计划。"
    ],
    supportEyebrow: "支持对象",
    supportTitle: "我们支持谁",
    beneficiaries: [
      { title: "儿童", text: "居住在农村社区的儿童。", icon: "" },
      { title: "弱势家庭", text: "可能需要额外支持的家庭和个人。", icon: "" },
      { title: "老人", text: "需要特别照顾的老人和弱势人士。", icon: "" },
      { title: "学生", text: "能够受益于学习用品和教育资源的学生。", icon: "" }
    ],
    activitiesEyebrow: "活动",
    activitiesTitle: "我们的五大核心活动",
    activities: [
      { number: "01", title: "礼物分发", icon: "", description: "向儿童及项目受益者分发礼物。" },
      { number: "02", title: "食物共享", icon: "", description: "组织社区聚餐和共享时刻。" },
      { number: "03", title: "儿童活动", icon: "", description: "为儿童举办游戏、娱乐、音乐、舞蹈、比赛和休闲活动。" },
      { number: "04", title: "学校支持", icon: "", description: "分发学习用品、书籍和教育资源。" },
      { number: "05", title: "月光下的教育电影放映", icon: "", description: "在月光下举行户外教育电影放映，为儿童带来既有趣又有教育意义的体验。" }
    ],
    actionEyebrow: "参与方式",
    actionTitle: "您如何帮助",
    helpOptions: [
      "财政支持",
      "食品捐赠",
      "衣物与鞋子",
      "玩具、书籍与教育游戏",
      "学习用品",
      "卫生用品",
      "后勤支持",
      "志愿者 / 人力支持"
    ],
    donationEyebrow: "捐赠",
    donationTitle: "支持丛林圣诞2026",
    donationText: "每一份贡献，无论大小，都能帮助我们让多哥乡村社区的儿童和家庭露出笑容。",
    donationAmountTitle: "自选捐赠金额",
    donationAmountText: "请在 PayPal 安全付款页面输入您希望捐赠的金额。",
    securePaymentTitle: "PayPal 安全付款",
    paymentDetails: "付款及所需信息将直接在 PayPal 页面填写。",
    westernUnion: "西联汇款：",
    westernUnionText: "待商务账户配置完成后，将补充详细信息。",
    impactMessageEyebrow: "影响",
    impactMessageTitle: "您的支持能带来改变",
    impactMessageParagraphs: [
      "企业、协会、个人、供应商、员工和合作伙伴都受邀支持丛林圣诞2026。",
      "您的贡献可以为多哥乡村社区的儿童和家庭提供礼物、膳食、衣物、学习用品和幸福时刻。",
      "让我们一起把笑容带给每一个村庄。"
    ],
    infoEyebrow: "项目资料",
    infoTitle: "项目资料",
    infoItems: [
      { label: "日期", value: "2026年12月24日或25日" },
      { label: "国家", value: "多哥" },
      { label: "地点", value: "多哥乡村社区 / 村庄" },
      { label: "主办方", value: "OPTINET SARL-U" }
    ],
    infoNote: "具体村庄名称将在正式选定后另行公布。",
    galleryEyebrow: "相册",
    galleryTitle: "相册",
    galleryCards: ["筹备工作", "捐赠", "儿童活动", "社区共享", "活动瞬间", "月光下的教育电影放映"],
    galleryNote: "儿童照片和视频必须尊重其尊严和隐私，并在必要时仅在获得适当授权后发布。",
    impactEyebrow: "影响",
    impactTitle: "我们的影响",
    impactStats: [
      { label: "受助儿童", value: "即将公布" },
      { label: "覆盖家庭", value: "即将公布" },
      { label: "分发礼物", value: "即将公布" },
      { label: "提供学习包", value: "即将公布" },
      { label: "共享餐食", value: "即将公布" },
      { label: "参与志愿者", value: "即将公布" },
      { label: "覆盖村庄", value: "即将公布" }
    ],
    futureEyebrow: "展望",
    futureTitle: "展望未来",
    futureParagraphs: [
      "丛林圣诞计划旨在成为年度公益活动。",
      "未来，该倡议可能扩展到更多村庄和儿童，并吸纳更多合作伙伴参与。",
      "未来活动可能包括教育、学校、健康、卫生和环境倡议。"
    ],
    valuesEyebrow: "价值观",
    valuesTitle: "我们的价值观",
    values: [
      { title: "团结", text: "支持人们与社区。", icon: "" },
      { title: "分享", text: "创造慷慨与团结的时刻。", icon: "" },
      { title: "贴近", text: "靠近农村社区及其需求。", icon: "" },
      { title: "尊严", text: "尊重每位受益人，尤其是儿童。", icon: "" },
      { title: "承诺", text: "共同努力，创造有意义且持久的影响。", icon: "" }
    ],
    contactEyebrow: "联系我们",
    contactTitle: "联系我们",
    phone: "电话：+228 90 74 84 65",
    location: "地点：Agoè-Nyivé – 多哥",
    cta: "联系 OPTINET",
    shareEyebrow: "分享",
    shareTitle: "分享项目",
    shareText: "一起，让每个村庄都充满笑声！",
    projectName: "丛林圣诞2026"
  }
};

export default function ChristmasInTheBushPage() {
  const { language } = useLanguage();
  const content = christmasContent[language] || christmasContent.fr;
  const flyerSlides = language === "fr"
    ? [christmasFlyerFr, christmasFlyerEn]
    : [christmasFlyerEn, christmasFlyerFr];
  const heroBackgrounds = [
    christmasBg1,
    christmasBg2,
    christmasBg3,
    christmasBg4,
    christmasBg5,
  ];
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0);
  const [activeBackgroundIndex, setActiveBackgroundIndex] = useState(0);
  const activeFlyer = flyerSlides[activeFlyerIndex];
  const seasonalTextStyles = [
    { title: "#fffaf0", accent: "#f7d78c", panel: "rgba(22, 18, 15, 0.38)" },
    { title: "#fffdf9", accent: "#f9d68e", panel: "rgba(18, 26, 21, 0.42)" },
    { title: "#fff9f0", accent: "#ffdf9c", panel: "rgba(23, 12, 16, 0.44)" },
    { title: "#fefaf5", accent: "#ffd97f", panel: "rgba(24, 12, 12, 0.45)" },
    { title: "#fff6eb", accent: "#f7d98d", panel: "rgba(13, 27, 22, 0.42)" }
  ];
  const activeTextStyle = seasonalTextStyles[activeBackgroundIndex] || seasonalTextStyles[0];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveFlyerIndex((currentIndex) => (currentIndex + 1) % flyerSlides.length);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [language, flyerSlides.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveBackgroundIndex((currentIndex) => (currentIndex + 1) % heroBackgrounds.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [heroBackgrounds.length]);

  useEffect(() => {
    document.title = `${content.title} | OPTINET`;

    const setMeta = (name, contentText, attr = "name") => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", contentText);
    };

    setMeta("description", content.metaDescription);
    setMeta("og:title", `${content.title} | OPTINET`, "property");
    setMeta("og:description", content.metaOgDescription, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", "", "property");
    setMeta("twitter:card", "summary_large_image");
  }, [content]);

  return (
    <div className="christmas-page">
      <section className="christmas-hero" aria-label="Arrière-plan Noël défilant">
        <div className="christmas-hero__slides" aria-hidden="true">
          {heroBackgrounds.map((background, index) => (
            <div
              key={background}
              className={`christmas-hero__slide ${index === activeBackgroundIndex ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${background})` }}
            />
          ))}
        </div>
        <div className="christmas-hero__overlay" />
        <div className="christmas-hero__layout container">
          <div
            className="christmas-hero__content"
            style={{ background: activeTextStyle.panel, border: `1px solid ${activeTextStyle.accent}33` }}
          >
            <div className="christmas-hero__badge">{content.badge}</div>
            <h1 style={{ color: activeTextStyle.title }}>
              <span className="christmas-hero__title-main">{content.title.replace(" 2026", "")}</span>
              <span className="christmas-hero__year">2026</span>
            </h1>
            <h2 style={{ color: activeTextStyle.accent }}>{content.slogan}</h2>
            <p style={{ color: activeTextStyle.title }}>{content.description}</p>
            <div className="christmas-hero__actions">
              <a
                className="btn btn-primary"
                href={PAYPAL_DONATION_URL || "#support-donation"}
                target={PAYPAL_DONATION_URL ? "_blank" : undefined}
                rel={PAYPAL_DONATION_URL ? "noreferrer" : undefined}
              >
                {content.donate}
              </a>
              <a className="btn btn-secondary" href="#about-project">
                {content.learn}
              </a>
            </div>
            <div className="christmas-hero__note">{content.note}</div>
          </div>
          <div
            className="christmas-hero__visual"
            role="region"
            aria-roledescription="carousel"
            aria-label={content.projectName}
          >
            <img key={activeFlyer} src={activeFlyer} alt={content.flyerAlt} />
            <div className="christmas-flyer-controls">
              <button
                type="button"
                aria-label={content.previousSlide}
                onClick={() => setActiveFlyerIndex((activeFlyerIndex + flyerSlides.length - 1) % flyerSlides.length)}
              >
                ‹
              </button>
              <div className="christmas-flyer-dots">
                {flyerSlides.map((flyer, index) => (
                  <button
                    key={flyer}
                    type="button"
                    aria-label={`${content.slideLabel} ${index + 1}`}
                    aria-pressed={activeFlyerIndex === index}
                    onClick={() => setActiveFlyerIndex(index)}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label={content.nextSlide}
                onClick={() => setActiveFlyerIndex((activeFlyerIndex + 1) % flyerSlides.length)}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="container christmas-main">
        <section id="about-project" className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.aboutEyebrow}</span>
            <h3>{content.aboutTitle}</h3>
          </div>
          <div className="christmas-copy">
            {content.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.objectiveEyebrow}</span>
            <h3>{content.objectiveTitle}</h3>
          </div>
          <ul className="christmas-list">
            {content.objectiveList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.supportEyebrow}</span>
            <h3>{content.supportTitle}</h3>
          </div>
          <div className="card-grid beneficiary-grid">
            {content.beneficiaries.map(({ title, text, icon }) => (
              <div key={title} className="info-card">
                {icon ? <div className="info-card__icon" aria-hidden="true">{icon}</div> : null}
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.activitiesEyebrow}</span>
            <h3>{content.activitiesTitle}</h3>
          </div>
          <div className="activity-list">
            {content.activities.map(({ number, title, icon, description }) => (
              <div key={number} className="activity-card">
                <div className="activity-card__number">{number}</div>
                <div className="activity-card__content">
                  <div className="activity-card__title-row">
                    {icon ? <span className="activity-card__icon" aria-hidden="true">{icon}</span> : null}
                    <h4>{title}</h4>
                  </div>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.actionEyebrow}</span>
            <h3>{content.actionTitle}</h3>
          </div>
          <div className="card-grid help-grid">
            {content.helpOptions.map((option) => (
              <div key={option} className="mini-card">
                <span className="mini-card__dot" aria-hidden="true" />
                <span>{option}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="support-donation" className="christmas-section christmas-donate">
          <div className="section-heading">
            <span className="eyebrow">{content.donationEyebrow}</span>
            <h3>{content.donationTitle}</h3>
          </div>
          <div className="donation-box">
            <div className="donation-box__amount">
              <h4>{content.donationAmountTitle}</h4>
              <p>{content.donationText}</p>
              <p>{content.donationAmountText}</p>
              <a
                className="btn btn-primary large"
                href={PAYPAL_DONATION_URL}
                target="_blank"
                rel="noreferrer"
              >
                {content.donate}
              </a>
            </div>
            <div className="donation-box__details">
              <h4>{content.securePaymentTitle}</h4>
              <p>{content.paymentDetails}</p>
              <div className="donation-box__provider">PayPal</div>
            </div>
          </div>
          <p className="donation-western-union">
            <strong>{content.westernUnion}</strong> {content.westernUnionText}
          </p>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.impactMessageEyebrow}</span>
            <h3>{content.impactMessageTitle}</h3>
          </div>
          <div className="christmas-copy">
            {content.impactMessageParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="christmas-section project-info">
          <div className="section-heading">
            <span className="eyebrow">{content.infoEyebrow}</span>
            <h3>{content.infoTitle}</h3>
          </div>
          <div className="project-info__grid">
            {content.infoItems.map(({ label, value }) => (
              <div key={label} className="project-info__item">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="project-info__note">{content.infoNote}</p>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.galleryEyebrow}</span>
            <h3>{content.galleryTitle}</h3>
          </div>
          <div className="gallery-grid">
            {content.galleryCards.map((label) => (
              <div key={label} className="gallery-item">
                <div className="gallery-item__placeholder">{label}</div>
              </div>
            ))}
          </div>
          <p className="gallery-note">{content.galleryNote}</p>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.impactEyebrow}</span>
            <h3>{content.impactTitle}</h3>
          </div>
          <div className="impact-grid">
            {content.impactStats.map(({ label, value }) => (
              <div key={label} className="impact-card">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.futureEyebrow}</span>
            <h3>{content.futureTitle}</h3>
          </div>
          <div className="christmas-copy">
            {content.futureParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="christmas-section">
          <div className="section-heading">
            <span className="eyebrow">{content.valuesEyebrow}</span>
            <h3>{content.valuesTitle}</h3>
          </div>
          <div className="card-grid values-grid">
            {content.values.map(({ title, text, icon }) => (
              <div key={title} className="value-card">
                {icon ? <div className="value-card__icon" aria-hidden="true">{icon}</div> : null}
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="christmas-section contact-section">
          <div className="section-heading">
            <span className="eyebrow">{content.contactEyebrow}</span>
            <h3>{content.contactTitle}</h3>
          </div>
          <div className="contact-card">
            <div>
              <h4>OPTINET SARL-U</h4>
              <p>{content.phone}</p>
              <p>{content.location}</p>
            </div>
            <Link to="/contact" className="btn btn-secondary">
              {content.cta}
            </Link>
          </div>
        </section>

        <section className="christmas-section social-share">
          <div className="section-heading">
            <span className="eyebrow">{content.shareEyebrow}</span>
            <h3>{content.shareTitle}</h3>
          </div>
          <div className="share-box">
            <p>
              <strong>{content.projectName}</strong>
            </p>
            <p>{content.slogan}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
