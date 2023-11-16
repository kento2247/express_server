"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express")); // Import IRoute from express
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const CONFIG = require("../config/server_config.json");
const port = CONFIG.port;
const binding_host = CONFIG.binding_host;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// テンプレートエンジンの設定
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// 静的ファイルの提供
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/api/html", (req, res) => {
    fs_1.default.readFile("../static/html/toppage.html", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        }
        else {
            res.send(data);
        }
    });
});
app.post("/api/data", (req, res) => {
    res.json(req.body);
});
// 404エラーハンドリング
app.use((req, res, next) => {
    const hostIpAddress = (0, utils_1.getHostIpAddress)();
    res
        .status(404)
        .render("404", { ipAddress: hostIpAddress, endpoints: getEndpoints() });
});
app.listen(port, binding_host, () => {
    const hostIpAddress = (0, utils_1.getHostIpAddress)();
    console.log(`Server is running on http://${hostIpAddress}:${port}`);
});
// エンドポイントのリストを取得
function getEndpoints() {
    const routes = [];
    app._router.stack.forEach((layer) => {
        if (layer.route) {
            const method = Object.keys(layer.route.methods)[0].toUpperCase();
            const path = layer.route.path;
            routes.push({ method, path });
        }
    });
    return routes;
}
