import { CONFIG } from "./config.js";

// document.addEventListener("DOMContentLoaded", () => {
//   if (!sessionStorage.getItem("access_token")) {
//     login();
//   }
// });

export function ensureLogin() {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    login();
    return false;
  }

  return true;
}

function login() {
  const params = new URLSearchParams({
    client_id: CONFIG.clientId,
    response_type: "token",
    redirect_uri: CONFIG.redirectUri,
    scope: CONFIG.scopes.join(" ")
  });

  location.href = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${params}`;
}
