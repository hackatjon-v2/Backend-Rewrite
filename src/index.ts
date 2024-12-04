import { StartServer } from "./api";
import { activeRequests } from "./api/tracker";
import { EchoIntro } from "./intro";

export async function Initialize() {
  EchoIntro();

  StartServer();
}

Initialize();

process.on("uncaughtException", (e) => {
  if (e.message.includes("EADDRINUSE")) {
    console.log("The address is already in use!");

    process.exit(255);
  }

  for (const res of activeRequests) {
    if (!res.headersSent) {
      res.status(500).send();
    }
  }
});
