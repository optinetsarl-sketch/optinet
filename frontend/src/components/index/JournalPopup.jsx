import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import christmasFlyerEn from '../../assets/christmas-flyer-en.jpg';
import christmasFlyerFr from '../../assets/christmas-flyer-fr.jpg';
import { useLanguage } from '../../context/LanguageContext';
import { catColor } from '../../pages/index/Journal';
import { getActualites } from '../../services/authService';

const CAMPAIGN_ID = 'campaign-christmas-in-the-bush-2026';
const CAMPAIGN_POPUP_COPY = {
  fr: { category: 'Projet solidaire', title: 'Noël en brousse 2026', action: 'Découvrir le projet' },
  en: { category: 'Solidarity project', title: 'Christmas in the Bush 2026', action: 'Discover the project' },
  zh: { category: '公益项目', title: '丛林圣诞2026', action: '了解项目' },
};

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

const FIRST_DELAY = 6000;   // premier popup après 6s sur la page
const SHOW_DURATION = 9000; // reste affiché 9s
const GAP_MIN = 18000;      // puis attend 18 à 32s avant le suivant
const GAP_MAX = 32000;

export default function JournalPopup() {
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timers = useRef([]);
  const lastId = useRef(null);
  const { t, tDynamic, language } = useLanguage();
  const isCampaignPage = location.pathname.startsWith('/christmas-in-the-bush-2026');
  const campaignCopy = CAMPAIGN_POPUP_COPY[language] || CAMPAIGN_POPUP_COPY.fr;
  const currentIsCampaign = current?.kind === 'campaign';
  const currentTitle = currentIsCampaign ? campaignCopy.title : tDynamic(current?.titre);
  const currentImage = currentIsCampaign
    ? (language === 'fr' ? christmasFlyerFr : christmasFlyerEn)
    : httpsUrl(current?.image_principale);


  useEffect(() => {
    getActualites()
      .then((res) => setPosts((res.data || []).filter((a) => a.est_publie)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isCampaignPage) return;

    const pickAndShow = () => {
      if (lastId.current === CAMPAIGN_ID && posts.length === 0) return;

      const entries = [
        { id: CAMPAIGN_ID, kind: 'campaign' },
        ...posts.map((post) => ({ ...post, kind: 'news' })),
      ];
      const pool = entries.length > 1 ? entries.filter((entry) => entry.id !== lastId.current) : entries;
      const pick = lastId.current === null
        ? entries[0]
        : pool[Math.floor(Math.random() * pool.length)];
      lastId.current = pick.id;
      setCurrent(pick);
      setVisible(true);
      const hideT = setTimeout(() => setVisible(false), SHOW_DURATION);
      const nextGap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN);
      const nextT = setTimeout(pickAndShow, SHOW_DURATION + nextGap);
      timers.current.push(hideT, nextT);
    };

    const startT = setTimeout(pickAndShow, FIRST_DELAY);
    timers.current.push(startT);

    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [posts, isCampaignPage]);

  // pas de pub pour le Journal... pendant qu'on lit déjà le Journal
  if (location.pathname.startsWith('/journal') || isCampaignPage) return null;
  if (!current) return null;

  return (
    <>
      <div
        className="journal-popup-card"
        role="button"
        tabIndex={0}
        aria-label={`${currentTitle}. ${currentIsCampaign ? campaignCopy.action : (language === 'en' ? 'Read news' : language === 'zh' ? '查看动态' : 'Voir sur le site')}`}
        onClick={() => { setVisible(false); navigate(currentIsCampaign ? '/christmas-in-the-bush-2026' : `/journal/${current.id}`); }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setVisible(false);
            navigate(currentIsCampaign ? '/christmas-in-the-bush-2026' : `/journal/${current.id}`);
          }
        }}
        style={{
          position: 'fixed', right: 24, bottom: 104, zIndex: 999, width: 300, maxWidth: 'calc(100vw - 32px)',
          background: '#0a1526', border: '1px solid #12233a', borderRadius: 14,
          boxShadow: '0 12px 34px rgba(0,0,0,.45)', overflow: 'hidden', cursor: 'pointer',
          display: 'flex',
          transform: visible ? 'translateX(0)' : 'translateX(140%)',
          opacity: visible ? 1 : 0,
          transition: 'transform .5s ease, opacity .5s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          aria-label="Fermer"
          style={{ position: 'absolute', top: 5, right: 7, background: 'none', border: 'none', color: '#63798f', fontSize: 17, cursor: 'pointer', lineHeight: 1 }}
        >×</button>
        {currentImage && (
          <img src={currentImage} alt="" style={{ width: 84, height: 84, objectFit: 'cover', flex: '0 0 auto' }} />
        )}
        <div style={{ padding: '10px 30px 10px 12px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: currentIsCampaign ? '#d92d2d' : catColor(current.categorie), flex: '0 0 auto' }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: .4, color: '#63798f', textTransform: 'uppercase' }}>
              {currentIsCampaign ? campaignCopy.category : `${t("journal")} · ${t(`cat_${current.categorie}`) || current.categorie_label}`}
            </span>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: '#fff',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {currentTitle}
          </div>
          <div style={{ marginTop: 5, fontSize: 11.5, fontWeight: 700, color: '#12b3d6' }}>
            {currentIsCampaign ? campaignCopy.action : (language === 'en' ? 'Read news →' : language === 'zh' ? '查看工程动态 →' : 'Voir sur le site →')}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .journal-popup-card { right: 10px !important; bottom: 84px !important; }
        }
      `}</style>
    </>
  );
}
