// MySanad — Google Apps Script
//
// SETUP (important — follow in order):
// 1. Open your Google Sheet "ORDRES MYSANAD"
// 2. Copy the Sheet ID from the URL:
//    https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
// 3. Paste it in SPREADSHEET_ID below
// 4. Extensions → Apps Script → paste this entire file → Save
// 5. Select function "testWebhook" → Run → authorize Google
// 6. Check tab "Orders" — a test row must appear
// 7. Deploy → New deployment → Web app
//      Execute as: Me | Who has access: Anyone
// 8. Copy /exec URL → Easypanel backend → GOOGLE_SHEET_WEBHOOK_URL
//
// DEBUG: open the /exec URL in your browser — it shows which sheet receives rows.

// ── REQUIRED: paste your Google Sheet ID here ──────────────────────────────
// From the browser URL (NOT the #gid= number at the end):
//
//   https://docs.google.com/spreadsheets/d/1abcXYZ_long_string_here/edit#gid=374278921
//                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                          copy THIS part only (usually 40+ chars)
//
// WRONG: 374278921  ← this is the tab id (#gid=), not the spreadsheet id
const SPREADSHEET_ID = ""; // e.g. "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

const ORDERS_SHEET_NAME = "Orders";

const HEADERS = [
  "date",
  "orderid",
  "country",
  "name",
  "phone",
  "product",
  "sku",
  "quantity",
  "totalprice",
  "currency",
  "status",
];

function getOrdersSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "SPREADSHEET_ID is empty and no active spreadsheet found. " +
        "Paste your Sheet ID at the top of this script (from the Google Sheet URL)."
    );
  }
  return ss;
}

function doPost(e) {
  try {
    if (!e || !e.postData) {
      throw new Error("doPost called without HTTP request. Use testWebhook() to test locally.");
    }
    var body = JSON.parse(e.postData.contents || "{}");
    var info = appendRow(body);
    return jsonResponse({ ok: true, spreadsheet: info.spreadsheet_name, row: info.row });
  } catch (err) {
    Logger.log("doPost error: " + err.toString());
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function doGet() {
  try {
    var ss = getOrdersSpreadsheet();
    var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
    return jsonResponse({
      ok: true,
      service: "mysanad-orders-webhook",
      spreadsheet_id: ss.getId(),
      spreadsheet_name: ss.getName(),
      spreadsheet_url: ss.getUrl(),
      orders_tab: ORDERS_SHEET_NAME,
      orders_rows: sheet ? sheet.getLastRow() : 0,
      spreadsheet_id_configured: Boolean(SPREADSHEET_ID),
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function normalizePayload(payload) {
  var items = payload.items || [];
  var productFromItems = items
    .map(function (i) { return i.product_name || i.product_id || ""; })
    .filter(Boolean)
    .join("/");
  var skuFromItems = items
    .map(function (i) { return i.sku || i.product_id || ""; })
    .filter(Boolean)
    .join("/");
  var qtyFromItems = items
    .map(function (i) { return String(i.quantity || ""); })
    .filter(Boolean)
    .join("/");

  return {
    date: payload.date || formatIsoDate(payload.created_at),
    orderid: payload.orderid || payload.order_number || payload.order_id || "",
    country: payload.country || "KSA",
    name: payload.name || payload.customer_name || "",
    phone:
      payload.phone ||
      payload.phone_country_digits ||
      String(payload.phone_e164 || "").replace(/^\+/, ""),
    product: payload.product || payload.items_summary || productFromItems,
    sku: payload.sku || skuFromItems,
    quantity: payload.quantity || qtyFromItems,
    totalprice: payload.totalprice != null ? payload.totalprice : payload.total,
    currency: payload.currency || "SAR",
    status: payload.status || "",
  };
}

function formatIsoDate(iso) {
  if (!iso) return "";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  var dd = String(d.getDate()).padStart(2, "0");
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var yyyy = d.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
}

function appendRow(payload) {
  var ss = getOrdersSpreadsheet();
  var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(ORDERS_SHEET_NAME);

  ensureHeaders(sheet);

  var normalized = normalizePayload(payload);
  var row = HEADERS.map(function (h) {
    var v = normalized[h];
    return v === undefined || v === null ? "" : v;
  });
  sheet.appendRow(row);

  return {
    spreadsheet_name: ss.getName(),
    spreadsheet_id: ss.getId(),
    row: sheet.getLastRow(),
  };
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return;
  }
  var existing = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length))
    .getValues()[0];
  if (existing[0] !== HEADERS[0] || existing.length < HEADERS.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function jsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function testWebhook() {
  var info = appendRow({
    date: "19/06/2026",
    orderid: "TEST-WEBHOOK-LOCAL",
    country: "KSA",
    name: "اختبار",
    phone: "966501234567",
    product: "قطرات البيوتين والكولاجين",
    sku: "SANAD-BC-7K3F",
    quantity: "1",
    totalprice: 199,
    currency: "SAR",
    status: "test",
  });
  Logger.log(
    "OK — row " + info.row + " added to \"" + info.spreadsheet_name + "\" (" + info.spreadsheet_id + ")"
  );
}
