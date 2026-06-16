import { corsairGmailService } from "./packages/trpc/server/index";

async function run() {
  try {
    const res = await corsairGmailService.connectGmail("test-id");
    console.log(res);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

run();
