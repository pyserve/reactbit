export const httpProtocol = window.location.protocol;
console.log("🚀 ~ httpProtocol:", httpProtocol);
export const protocol = httpProtocol === "https:" ? "wss" : "ws";
console.log("🚀 ~ protocol:", protocol);
export const backend_host = "reactbit-backend.onrender.com"; // "reactbit-backend.onrender.com"
export const backend_url = `${httpProtocol}//reactbit-backend.onrender.com`; // "reactbit-backend.onrender.com"

console.log("🚀 ~ backend_url:", backend_url);
