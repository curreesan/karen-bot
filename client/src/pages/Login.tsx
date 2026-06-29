function Login() {
  function handleLogin() {
    window.location.href = "http://localhost:3001/api/auth/login";
  }

  return (
    <div>
      <h1>Karen Dashboard</h1>
      <button onClick={handleLogin}>Login with Discord</button>
    </div>
  );
}

export default Login;
