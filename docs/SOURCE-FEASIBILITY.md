# Source Feasibility — 2026-09-29

本次只檢視官方公開搜尋頁與條款，**沒有對站點執行程式化大量請求、登入、DevTools Request 擷取或 Adapter 測試**。搜尋引擎／頁面可讀不等於可以自動擷取、重用圖片或建立商用聚合。三來源狀態均為 **disabled / Need Verification**。如條款或授權有變，以後續核實結果為準。

| 問題 | 591 | 信義房屋 | 永慶房仲網 |
| --- | --- | --- | --- |
| 官方搜尋入口 | [新莊區售屋列表](https://sale.591.com.tw/?firstRow=0&kind=9&regionid=3&section=44&shType=list) | [新莊區買屋列表](https://www.sinyi.com.tw/buy/list/NewTaipei-city/242-zip/default-desc/1) | [新莊區買屋列表](https://buy.yungching.com.tw/list/%E6%96%B0%E5%8C%97%E5%B8%82-%E6%96%B0%E8%8E%8A%E5%8D%80_c) |
| 可見資料 | 搜尋索引顯示標題、地區、格局、坪數、價格等；此次直接開頁工具回報錯誤，HTML 未驗證 | 公開頁文字可見標題、地區、價格、建坪、屋齡、格局、車位資訊 | 公開頁文字可見標題、地區、價格、建坪、屋齡、格局等 |
| SSR / CSR、原始 HTML 是否含物件 | Need Verification | 工具抽取到文字；原始回應是否 SSR：Need Verification | 工具抽取到文字；原始回應是否 SSR：Need Verification |
| 公開 Request / API | Need Verification；未核實 API，也未獲 API 使用許可 | Need Verification | Need Verification |
| 搜尋參數／分頁 | 範例 URL 含 `regionid`、`section`、`firstRow`，語意及穩定性未核實 | 範例路徑含城市／區域／頁碼；可見多頁，完整參數未核實 | 範例路徑含城市／區域；分頁機制未核實 |
| 關鍵字／區域 | 可見區域入口；關鍵字能力 Need Verification | 可見區域及「街道/捷運站/社區/物件編號/學校」輸入；實際匹配規則 Need Verification | 區域列表可見；關鍵字能力 Need Verification |
| 價格／坪數／格局／屋齡／車位篩選 | 各項 Request mapping Need Verification | 可見總價、類型、格局控制；單價、坪數、屋齡、車位 mapping Need Verification | 全部 Request mapping Need Verification |
| Request 限制／Anti-Bot | 條款限制未授權自動擷取；具體限額及阻擋機制 Need Verification | 條款明禁非人為自動截取、點擊及重複讀取；具體限額 Need Verification | 條款和正式授權範圍 Need Verification；不可由公開頁推定允許 |
| robots / ToS | [服務條款](https://m.591.com.tw/v2/terms/service) 明定未授權不得使用爬蟲等連續自動提取內容；robots 本次未核實 | [服務條款](https://www.sinyi.com.tw/tos) 第 7 節禁止非人為方式自動截取等；robots 本次未核實 | [會員及網友同意條款](https://buy.yungching.com.tw/Information/agreement) 可讀，但此頁沒有提供聚合重用許可；robots 與其他適用條款 Need Verification |
| 穩定性 | 高風險，條款及技術均未過關 | 高風險，條款明確限制 | 高風險，授權、API 與穩定性未核實 |

## Gate before any live Adapter

1. 由 Owner 取得或確認來源明確允許的存取、展示、重用方式與範圍（必要時向來源申請正式合作／API）。
2. 記錄適用 robots、ToS、速率、保留時間、圖片與欄位使用限制；若禁止則維持 disabled。
3. 在允許範圍內用**單次、低頻**請求驗證搜尋、分頁、欄位與 SSR/CSR，保存去個資的可重現證據。
4. 逐來源定義 mapping 和 fixture，更新 Ticket 後再開始 Adapter 實作。

沒有第 1 步時，可先完成 fixture 驅動的 UI／Domain MVP，或改為人工導向官方搜尋頁；這兩者不宣稱取得三站即時房源。禁止 CAPTCHA、登入、Anti-Bot 繞過。
