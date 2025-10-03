import { createServer } from "./server";
import { env } from "./config/env";

const app = createServer();
const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`where-to-watch backend listening on ${port}`);
});
