import React, { useState, useEffect } from 'react';
import { getMessages, deleteMessage, updateMessageStatus } from "../../services/authService";
import { useMessages } from "../../context/MessageContext";
import "../styles_admin/messages.css";

const MessageDisplayForm = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { refreshUnreadCount } = useMessages();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const fetchMessages = () => {
    setLoading(true);
    getMessages()
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    setShowReply(false);
    setReplyText("");
    if (msg.statut === "non_lu") updateStatus(msg.id, "lu");
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const subject = encodeURIComponent(`Re: ${selectedMessage.sujet}`);
    const body = encodeURIComponent(
      `${replyText}\n\n---\nMessage original de ${selectedMessage.nom} :\n${selectedMessage.contenu}`
    );
    window.location.href = `mailto:${selectedMessage.email}?subject=${subject}&body=${body}`;
  };

  const updateStatus = (id, newStatus) => {
    updateMessageStatus(id, newStatus)
      .then(() => {
        setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, statut: newStatus } : msg));
        if (selectedMessage && selectedMessage.id === id)
          setSelectedMessage(prev => ({ ...prev, statut: newStatus }));
        refreshUnreadCount();
      })
      .catch(err => console.error("Failed to update status:", err));
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      deleteMessage(id)
        .then(() => {
          setMessages(prev => prev.filter(msg => msg.id !== id));
          if (selectedMessage && selectedMessage.id === id) setSelectedMessage(null);
          refreshUnreadCount();
        })
        .catch(err => { console.error(err); alert("Erreur lors de la suppression."); });
    }
  };

  const counts = {
    all: messages.length,
    non_lu: messages.filter(m => m.statut === "non_lu").length,
    lu: messages.filter(m => m.statut === "lu").length,
    en_attente: messages.filter(m => m.statut === "en_attente").length,
  };

  const filteredMessages = messages.filter(msg => {
    if (activeTab !== "all" && msg.statut !== activeTab) return false;
    const t = searchTerm.toLowerCase();
    return (
      (msg.nom && msg.nom.toLowerCase().includes(t)) ||
      (msg.email && msg.email.toLowerCase().includes(t)) ||
      (msg.sujet && msg.sujet.toLowerCase().includes(t)) ||
      (msg.entreprise && msg.entreprise.toLowerCase().includes(t))
    );
  });

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const formatShortDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusLabel = (s) => ({ non_lu: "Non lu", lu: "Lu", en_attente: "En attente" }[s] || s);

  return (
    <div className="messages-page">
      {/* ── Page header ── */}
      <div className="messages-header">
        <div>
          <h1 className="messages-title">Messages de Contact</h1>
          <p className="messages-subtitle">Consultez et gérez les messages reçus.</p>
        </div>
        <div className="messages-actions">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="filter-tabs">
        {[
          { key: "all", label: "Tous", count: counts.all },
          { key: "non_lu", label: "Non lus", count: counts.non_lu },
          { key: "en_attente", label: "En attente", count: counts.en_attente },
          { key: "lu", label: "Lus", count: counts.lu },
        ].map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── Two-column mail layout ── */}
      <div className="mail-layout">

        {/* ── Left: message list ── */}
        <div className="mail-list">
          {loading && (
            <div className="mail-empty">
              <div className="mail-empty-icon">📬</div>
              <p>Chargement des messages…</p>
            </div>
          )}
          {!loading && filteredMessages.length === 0 && (
            <div className="mail-empty">
              <div className="mail-empty-icon">📭</div>
              <p>Aucun message trouvé.</p>
            </div>
          )}
          {filteredMessages.map(msg => (
            <div
              key={msg.id}
              className={`mail-item ${selectedMessage?.id === msg.id ? "active" : ""} ${msg.statut === "non_lu" ? "unread" : ""}`}
              onClick={() => handleOpenMessage(msg)}
            >
              <div
                className="mail-item-avatar"
                style={{
                  background: msg.statut === "non_lu"
                    ? "linear-gradient(135deg,#0f6cb3,#0b4e82)"
                    : "linear-gradient(135deg,#64748b,#475569)"
                }}
              >
                {getInitials(msg.nom)}
              </div>
              <div className="mail-item-body">
                <div className="mail-item-top">
                  <span className="mail-item-name">{msg.nom}</span>
                  <span className="mail-item-date">{formatShortDate(msg.date_creation)}</span>
                </div>
                <div className="mail-item-subject">{msg.sujet}</div>
                <div className="mail-item-preview">{msg.contenu}</div>
              </div>
              {msg.statut === "non_lu" && <span className="mail-unread-dot"></span>}
            </div>
          ))}
        </div>

        {/* ── Right: message detail ── */}
        <div className={`mail-detail ${selectedMessage ? "open" : ""}`}>
          {!selectedMessage ? (
            <div className="mail-detail-empty">
              <div className="mail-detail-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Sélectionnez un message</h3>
              <p>Cliquez sur un message dans la liste pour le lire.</p>
            </div>
          ) : (
            <>
              {/* Detail header */}
              <div className="mail-detail-header">
                <div className="mail-detail-header-left">
                  <div className="mail-detail-avatar">
                    {getInitials(selectedMessage.nom)}
                  </div>
                  <div>
                    <div className="mail-detail-sender">{selectedMessage.nom}</div>
                    <div className="mail-detail-email">{selectedMessage.email}</div>
                  </div>
                </div>
                <div className="mail-detail-header-right">
                  <span className={`status-badge ${selectedMessage.statut}`}>
                    <span className="status-dot"></span>
                    {getStatusLabel(selectedMessage.statut)}
                  </span>
                  <button
                    className="mail-close-btn"
                    onClick={() => setSelectedMessage(null)}
                    title="Fermer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Meta info bar */}
              <div className="mail-meta-bar">
                <div className="mail-meta-subject">{selectedMessage.sujet}</div>
                <div className="mail-meta-info">
                  {selectedMessage.entreprise && (
                    <span className="company-badge">{selectedMessage.entreprise}</span>
                  )}
                  {selectedMessage.numero_de_telephone && (
                    <span className="mail-meta-phone">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {selectedMessage.numero_de_telephone}
                    </span>
                  )}
                  <span className="mail-meta-date">{formatDate(selectedMessage.date_creation)}</span>
                </div>
              </div>

              {/* Status change bar */}
              <div className="mail-status-bar">
                <span className="mail-status-bar-label">Statut :</span>
                {["non_lu", "lu", "en_attente"].map(s => (
                  <button
                    key={s}
                    className={`status-select-btn ${s} ${selectedMessage.statut === s ? "active" : ""}`}
                    onClick={() => updateStatus(selectedMessage.id, s)}
                  >
                    {getStatusLabel(s)}
                  </button>
                ))}
              </div>

              {/* Message body */}
              <div className="mail-body">
                <div className="mail-body-content">{selectedMessage.contenu}</div>
              </div>

              {/* Reply compose area */}
              {showReply && (
                <div className="reply-compose">
                  <div className="reply-compose-header">
                    <div className="reply-compose-avatar">{getInitials(selectedMessage.nom)}</div>
                    <div className="reply-compose-to">
                      <span className="reply-compose-label">Répondre à</span>
                      <span className="reply-compose-name">{selectedMessage.nom}</span>
                      <span className="reply-compose-email">&lt;{selectedMessage.email}&gt;</span>
                    </div>
                    <button className="reply-compose-close" onClick={() => { setShowReply(false); setReplyText(""); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="reply-subject-bar">
                    <span className="reply-subject-prefix">Objet :</span>
                    <span className="reply-subject-value">Re: {selectedMessage.sujet}</span>
                  </div>
                  <div className="reply-body-area">
                    <textarea
                      className="reply-textarea"
                      placeholder={`Bonjour ${selectedMessage.nom},\n\n`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={5}
                      autoFocus
                    />
                    <div className="reply-quoted">
                      <div className="reply-quoted-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 17 4 12 9 7"></polyline>
                          <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                        </svg>
                        Message original
                      </div>
                      <div className="reply-quoted-text">{selectedMessage.contenu}</div>
                    </div>
                  </div>
                  <div className="reply-toolbar">
                    <div className="reply-char-count">
                      {replyText.length > 0 && `${replyText.length} car.`}
                    </div>
                    <div className="reply-toolbar-actions">
                      <button className="secondary-btn reply-cancel-btn" onClick={() => { setShowReply(false); setReplyText(""); }}>
                        Annuler
                      </button>
                      <button className="send-reply-btn" onClick={handleSendReply} disabled={!replyText.trim()}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action footer */}
              <div className="mail-action-footer">
                <button className="delete-btn-modal" onClick={() => handleDelete(selectedMessage.id)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Supprimer
                </button>
                {!showReply && (
                  <button className="reply-btn-modal" onClick={() => setShowReply(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 17 4 12 9 7"></polyline>
                      <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                    </svg>
                    Répondre
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageDisplayForm;