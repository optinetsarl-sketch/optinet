import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-Optinet-sokode.png";
import "./styles_admin/login.css";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser({ email, password });
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      // redirect to admin users page after login
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      setError("Identifiants invalides ou problème de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="Optinet" className="top-logo" />
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Nom d'utilisateur</label>
            <div className="input-box">
              <input
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Mot de passe</label>
            <div className="input-box">
              <input
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// import logo from "../assets/logo-Optinet-sokode.png";
// import "./styles_admin/login.css";

// const Login = () => {
//   return (
// 	<div className="login-page">
// 	  <div className="login-card">
// 		<img src={logo} alt="Optinet" className="top-logo" />

// 		<h2>Connexion</h2>

// 		<div className="input-group">
// 		  <label>Nom d'utilisateur</label>
// 		  <div className="input-box">
// 			<input type="text" placeholder="Entrez votre nom d'utilisateur" />
// 		  </div>
// 		</div>

// 		<div className="input-group">
// 		  <label>Mot de passe</label>
// 		  <div className="input-box">
// 			<input type="password" placeholder="Entrez votre mot de passe" />
// 		  </div>
// 		</div>

// 		<button className="login-btn">Se connecter</button>
// 	  </div>
// 	</div>
//   );
// };
// export default Login;