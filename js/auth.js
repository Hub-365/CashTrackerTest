import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("access_token")) {
    login();
  }
});

function login() {
  const params = new URLSearchParams({
    client_id: CONFIG.clientId,
    response_type: "token",
    redirect_uri: CONFIG.redirectUri,
    scope: CONFIG.scopes.join(" ")
  });

  location.href = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${params}`;
}
