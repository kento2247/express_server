// src/index.ts
import bodyParser from "body-parser";
import express from "express"; // Import IRoute from express
import fs from "fs";
import path from "path";

import { getHostIpAddress } from "./utils";

const CONFIG = require("../config/server_config.json");
const port = CONFIG.port;
const binding_host = CONFIG.binding_host;
const app = express();
app.use(bodyParser.json());
// テンプレートエンジンの設定
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// 静的ファイルの提供
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/html", (req, res) => {
  fs.readFile("../static/html/toppage.html", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send(data);
    }
  });
});

app.post("/api/data", (req, res) => {
  res.json(req.body);
});

// 404エラーハンドリング
app.use((req, res, next) => {
  const hostIpAddress = getHostIpAddress();
  res
    .status(404)
    .render("404", { ipAddress: hostIpAddress, endpoints: getEndpoints() });
});

app.listen(port, binding_host, () => {
  const hostIpAddress = getHostIpAddress();
  console.log(`Server is running on http://${hostIpAddress}:${port}`);
});

// エンドポイントのリストを取得
function getEndpoints(): { method: string; path: string }[] {
  const routes: { method: string; path: string }[] = [];
  app._router.stack.forEach((layer: any) => {
    if (layer.route) {
      const method = Object.keys(layer.route.methods)[0].toUpperCase();
      const path = layer.route.path;
      routes.push({ method, path });
    }
  });
  return routes;
}
