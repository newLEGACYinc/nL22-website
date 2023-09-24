import { DiscordLoginButton } from "react-social-login-buttons";

function Auth() {
  return (
    <div className="App">
      <div className="flex items-center justify-center h-screen bg-discord-gray text-white">
        <DiscordLoginButton onClick={() => window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1153602966708813844&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2FnL22%2Fvoting&response_type=token&scope=identify%20guilds%20guilds.members.read"} />
      </div>
    </div>
  );
}

export default Auth;
