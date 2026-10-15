import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

import app from "./app.js";

// Admin server
app.listen(process.env.PORT, () => {
  console.log(`Server Running On Port ${process.env.PORT}`);
});


