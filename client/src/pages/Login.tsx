import "../styles/login.css";

function Login() {
  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>👮 Karen</h1>
        <p>AI-Powered Discord Moderator</p>
        <button className="btn-discord" onClick={handleLogin}>
          Login with Discord
        </button>
      </div>
    </div>
  );
}

export default Login;
