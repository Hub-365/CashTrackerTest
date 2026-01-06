const clientId = "a2334259-ee0b-447d-a579-fa207d8a3924";
const projectName = "CashTrackerTest";

const redirectUri = `https://hub-365.github.io/${projectName}/callback.html`;
const scopes = "Files.ReadWrite Sites.ReadWrite.All offline_access";

document.getElementById("loginBtn").onclick = () => {
  const authUrl =
    `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize` +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  location.href = authUrl;
};
