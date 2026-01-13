const isLocal = location.hostname === "127.0.0.1" || location.hostname === "localhost";

export const CONFIG = {
  basePath: "/CashTrackerTest/",
  projectName: "CashTrackerTest",
  clientId: "a2334259-ee0b-447d-a579-fa207d8a3924",
  redirectUri: isLocal
    ? "http://localhost:5500/callback.html"
    : "https://hub-365.github.io/CashTrackerTest/callback.html",
  scopes: ["Files.ReadWrite", "User.Read"],
  excelFolder: "Apps",
  excelFile: "Book",
  tableName: "t_record",
  graphBase: "https://graph.microsoft.com/v1.0/me/drive/root:",
  cacheName: "cashtracker-cache-v1"
};
