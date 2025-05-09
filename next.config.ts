/* eslint-disable @typescript-eslint/no-require-imports */
const withPWA = require("next-pwa")({
  dest: "public", // Service Workerの出力先
  register: true, // 自動登録
  skipWaiting: true, // 新しいService Workerを即時適用
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  output: "export", // 静的エクスポート設定
  // 他のNext.js設定をここに追加
});
