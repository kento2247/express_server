const express = require("express");
const bodyParser = require("body-parser");
const os = require("os");
const fs = require("fs");

const app = express();
const port = 3000; // 適切なポート番号に変更すること

// POSTデータを解析するためのミドルウェアを設定
app.use(bodyParser.json());

// ホストのIPアドレスを取得する関数
function getHostIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  // ローカルネットワーク内のIPv4アドレスを検索
  for (const interfaceName of Object.keys(networkInterfaces)) {
    const interfaceInfo = networkInterfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (info.family === "IPv4" && !info.internal) {
        return info.address;
      }
    }
  }
  return null; // IPアドレスが見つからない場合
}

// GETリクエストを処理するエンドポイント
app.get("/api/html", (req, res) => {
  // 適当なHTMLをファイルから読み込んで返す
  fs.readFile("./templates/index.html", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send(data);
    }
  });
});

// POSTリクエストを処理するエンドポイント
app.post("/api/data", (req, res) => {
  // 受け取ったデータをそのまま返す
  res.json(req.body);
});

// サーバーを起動
app.listen(port, () => {
  const hostIpAddress = getHostIpAddress();
  console.log(`Server is running on http://${hostIpAddress}:${port}`);
});
