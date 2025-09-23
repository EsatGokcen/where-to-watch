import { createServer } from "./server";
import { env } from "./config/env";

const app = createServer();
const port = env.PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`where-to-watch backend listening on http://localhost:${port}`);
});
