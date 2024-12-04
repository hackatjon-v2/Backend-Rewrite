import axios from "axios";
import { Log } from "../logging";

export async function NotifyAdminBot(): Promise<boolean> {
  Log("Informing Admin Bot of mutations in approval...", "NOTIFIER");

  try {
    const response = await axios.post("http://localhost:7390/notify");

    return response.status === 200;
  } catch {
    Log("Operation failed! The bot did not get the memo.", "NOTIFIER");

    return false;
  }
}
