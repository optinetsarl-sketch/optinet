// import React, { useState } from "react";
// import "../styles/Login.css";
// import logo from "../assets/logoLogin.png";
// import {
//   FaUser,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import { loginUser } from "../services/authService";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async () => {
//     setMessage("");
//     setError("");

//     if (!username || !password) {
//       setError("Veuillez remplir tous les champs.");
//       return;
//     }

//     setLoading(true);

//     // Clear any stale token that could block the login request
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");

//     try {
//       const response = await loginUser({
//         username,
//         password,
//       });

//       localStorage.setItem("access", response.data.access);
//       localStorage.setItem("refresh", response.data.refresh);

//       setMessage(
//         response.data.message || "Connexion réussie."
//       );

//       setTimeout(() => {
//         navigate("/admin/dashboard");
//       }, 1000);
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Nom d'utilisateur ou mot de passe incorrect."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-right">
//         <div className="login-card">
//           <img src={logo} alt="logo" className="top-logo" />

//           <h2>Connexion</h2>

//           {message && (
//             <div className="success-message">
//               {message}
//             </div>
//           )}

//           {error && (
//             <div className="error-message">
//               {error}
//             </div>
//           )}

//           {/* Username */}
//           <div className="input-group">
//             <label>Nom d'utilisateur</label>

//             <div className="input-box">
//               <FaUser className="icon" />

//               <input
//                 type="text"
//                 placeholder="Entrez votre nom d'utilisateur"
//                 value={username}
//                 onChange={(e) =>
//                   setUsername(e.target.value)
//                 }
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="input-group">
//             <label>Mot de passe</label>

//             <div className="input-box">
//               <FaLock className="icon" />

//               <input
//                 type={
//                   showPassword ? "text" : "password"
//                 }
//                 placeholder="Entrez votre mot de passe"
//                 value={password}
//                 onChange={(e) =>
//                   setPassword(e.target.value)
//                 }
//               />

//               <span
//                 className="icon-right"
//                 onClick={() =>
//                   setShowPassword(!showPassword)
//                 }
//                 style={{ cursor: "pointer" }}
//               >
//                 {showPassword ? (
//                   <FaEye />
//                 ) : (
//                   <FaEyeSlash />
//                 )}
//               </span>
//             </div>
//           </div>

//           {/* Button */}
//           <button
//             className="login-btn"
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading
//               ? "Connexion..."
//               : "Se connecter"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;