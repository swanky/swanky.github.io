# Facebook Page Archive — SwankyParty

**封存來源**: https://www.facebook.com/SwankyParty
**封存日期**: 2026-03-22
**封存工具**: Apify Facebook Pages Scraper (apify/facebook-pages-scraper)
**帳號**: swanbear (免費方案)

> ⚠️ **重要聲明**：本封存僅包含「本次執行時可公開取得的內容」。Facebook 的技術限制（登入牆、API 限制、動態載入）可能導致部分內容未被收錄。本封存**不**代表完整備份。

## 目錄結構

```
facebook-archive/
├── README.md              — 本說明文件
├── metadata/
│   ├── page_info.json     — 頁面基本資訊
│   └── run_report.json    — 抓取執行報告
├── posts/
│   ├── all_posts.json     — 所有貼文結構化資料
│   └── YYYY/              — 按年份分類的 Markdown 貼文
│       └── YYYY-MM-DD_post-id.md
├── photos/
│   └── (下載的圖片)
├── indexes/
│   ├── index.md           — 總覽索引
│   ├── YYYY_index.md      — 各年度索引
│   └── failures.md        — 失敗清單
└── logs/
    └── apify_run.log      — 原始 API 回應
```

## 使用說明

- `metadata/page_info.json` — 頁面名稱、追蹤人數、簡介等基本資訊
- `posts/all_posts.json` — 可直接匯入網站使用的結構化資料
- `indexes/failures.md` — 記錄所有失敗或受限內容，方便後續補充

## 已知限制

| 限制 | 原因 |
|------|------|
| 部分舊貼文可能遺漏 | Facebook 對未登入狀態限制歷史貼文存取 |
| 影片內容無法下載 | Apify 免費版不含影片下載 |
| 限時動態 (Stories) | Facebook 不保留，無法封存 |
| 私人貼文 | 僅限追蹤者可見的內容無法取得 |
| 留言區 | 本次設定 maxPostComments=0 以節省額度 |
