import path from "path";
import Koa from "koa";
import serve from "koa-static";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Koa();
const PORT = 8866;
const ROOT_DIR = path.join(__dirname, "../utils/lib");

app.use(serve(ROOT_DIR));

app.listen(PORT, () => {
  console.log(`Lib server running at http://localhost:${PORT}`);
});
