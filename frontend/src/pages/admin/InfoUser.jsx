// import React, { useEffect, useState } from "react";
// import { getMe, changePassword, requestPasswordReset } from "../../services/authService";

// const InfoUser = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // États pour le changement direct
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [changeMsg, setChangeMsg] = useState({ text: "", type: "" });
//   const [changeLoading, setChangeLoading] = useState(false);

//   // État pour la demande de lien
//   const [resetMsg, setResetMsg] = useState({ text: "", type: "" });
//   const [resetLoading, setResetLoading] = useState(false);

//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const response = await getMe();
//         setUser(response.data);
//       } catch (err) {
//         console.error("Erreur lors de la récupération du profil", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMe();
//   }, []);

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setChangeMsg({ text: "", type: "" });

//     if (newPassword !== confirmPassword) {
//       setChangeMsg({ text: "Les nouveaux mots de passe ne correspondent pas.", type: "error" });
//       return;
//     }

//     setChangeLoading(true);
//     try {
//       const res = await changePassword({ old_password: oldPassword, new_password: newPassword });
//       setChangeMsg({ text: res.data.message || "Mot de passe modifié avec succès.", type: "success" });
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err) {
//       setChangeMsg({ 
//         text: err.response?.data?.error || "Erreur lors du changement de mot de passe.", 
//         type: "error" 
//       });
//     } finally {
//       setChangeLoading(false);
//     }
//   };

//   const handleResetRequest = async () => {
//     setResetMsg({ text: "", type: "" });
//     setResetLoading(true);
//     try {
//       const res = await requestPasswordReset(user.email);
//       setResetMsg({ text: res.data.message || "Un lien de réinitialisation a été envoyé à votre adresse email.", type: "success" });
//     } catch (err) {
//       setResetMsg({ 
//         text: err.response?.data?.error || "Erreur lors de la demande de réinitialisation.", 
//         type: "error" 
//       });
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   if (loading) return <div style={styles.container}><h2>Chargement du profil...</h2></div>;
//   if (!user) return <div style={styles.container}><h2>Impossible de charger le profil.</h2></div>;

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>Mon Profil</h1>

//       <div style={styles.card}>
//         <h2>Informations Personnelles</h2>
//         <div style={styles.infoGrid}>
//           <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
//           <p><strong>Email :</strong> {user.email}</p>
//           <p><strong>Prénom :</strong> {user.first_name || "Non renseigné"}</p>
//           <p><strong>Nom :</strong> {user.last_name || "Non renseigné"}</p>
//           <p><strong>Rôle :</strong> {user.is_superuser ? "Super Admin" : "Utilisateur"}</p>
//           <p><strong>Client (Schéma) :</strong> {user.client?.nom_entreprise || "N/A"} ({user.client?.schema_name || "public"})</p>
//         </div>
//       </div>

//       <div style={styles.row}>
//         {/* Colonne gauche : Changement direct de mot de passe */}
//         <div style={{...styles.card, flex: 1}}>
//           <h2>Changer mon mot de passe</h2>
//           <form onSubmit={handleChangePassword} style={styles.form}>
//             {changeMsg.text && (
//               <div style={changeMsg.type === "error" ? styles.errorMsg : styles.successMsg}>
//                 {changeMsg.text}
//               </div>
//             )}
            
//             <div style={styles.inputGroup}>
//               <label>Ancien mot de passe</label>
//               <input 
//                 type="password" 
//                 value={oldPassword} 
//                 onChange={(e) => setOldPassword(e.target.value)} 
//                 required 
//                 style={styles.input}
//               />
//             </div>

//             <div style={styles.inputGroup}>
//               <label>Nouveau mot de passe</label>
//               <input 
//                 type="password" 
//                 value={newPassword} 
//                 onChange={(e) => setNewPassword(e.target.value)} 
//                 required 
//                 style={styles.input}
//               />
//             </div>

//             <div style={styles.inputGroup}>
//               <label>Confirmer nouveau mot de passe</label>
//               <input 
//                 type="password" 
//                 value={confirmPassword} 
//                 onChange={(e) => setConfirmPassword(e.target.value)} 
//                 required 
//                 style={styles.input}
//               />
//             </div>

//             <button type="submit" style={styles.btnPrimary} disabled={changeLoading}>
//               {changeLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
//             </button>
//           </form>
//         </div>

//         {/* Colonne droite : Demande de lien par mail */}
//         <div style={{...styles.card, flex: 1}}>
//           <h2>Réinitialisation par Email</h2>
//           <p style={{marginBottom: "20px", color: "#555"}}>
//             Vous avez oublié votre mot de passe ou préférez le réinitialiser via un lien sécurisé envoyé à votre adresse <strong>{user.email}</strong> ?
//           </p>

//           {resetMsg.text && (
//             <div style={resetMsg.type === "error" ? styles.errorMsg : styles.successMsg}>
//               {resetMsg.text}
//             </div>
//           )}

//           <button 
//             onClick={handleResetRequest} 
//             style={styles.btnSecondary} 
//             disabled={resetLoading || !user.email}
//           >
//             {resetLoading ? "Envoi en cours..." : "M'envoyer un lien de réinitialisation"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles basiques en ligne pour aller vite (vous pourrez les basculer dans un fichier CSS)
// const styles = {
//   container: { padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" },
//   title: { color: "#333", borderBottom: "2px solid #eaeaea", paddingBottom: "10px", marginBottom: "30px" },
//   card: { backgroundColor: "#fff", padding: "25px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "30px" },
//   infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", lineHeight: "1.6" },
//   row: { display: "flex", gap: "30px", flexWrap: "wrap" },
//   form: { display: "flex", flexDirection: "column", gap: "15px" },
//   inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
//   input: { padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "14px" },
//   btnPrimary: { padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" },
//   btnSecondary: { padding: "12px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", width: "100%" },
//   errorMsg: { padding: "10px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "5px", fontSize: "14px" },
//   successMsg: { padding: "10px", backgroundColor: "#e8f5e9", color: "#2e7d32", borderRadius: "5px", fontSize: "14px" }
// };

// export default InfoUser;
