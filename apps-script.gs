/**
 * Server 134 — bộ nhận đơn di cư, ghi thẳng vào Google Sheet.
 *
 * Cách dùng (khuyến nghị):
 *  1. Tạo một Google Sheet mới.
 *  2. Từ trong chính Sheet đó, vào Tiện ích mở rộng (Extensions) → Apps Script.
 *     Mở kiểu này thì script gắn thẳng vào Sheet, không cần dán link Sheet vào đâu cả.
 *  3. Xoá hết code mẫu, dán toàn bộ file này vào.
 *  4. Bấm Triển khai (Deploy) → Bản triển khai mới (New deployment)
 *       - Loại: Ứng dụng web (Web app)
 *       - Thực thi với tư cách (Execute as): Tôi (Me)
 *       - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 *  5. Copy URL dạng https://script.google.com/macros/s/..../exec
 *  6. Dán URL đó vào biến SHEET_ENDPOINT trong index.html.
 *
 * Sau mỗi lần sửa code phải bấm Deploy → Manage deployments → Edit → New version,
 * nếu không URL cũ vẫn chạy code cũ.
 */

// Tên tab trong Sheet sẽ chứa dữ liệu. Không cần tạo trước, script tự tạo.
var SHEET_NAME = 'DonDangKy';

/**
 * Để trống nếu bạn mở Apps Script từ trong Sheet (cách khuyến nghị ở trên) —
 * script tự tìm đúng Sheet đang chứa nó.
 *
 * Chỉ điền khi bạn tạo project rời ở script.google.com. Khi đó dán ID của Sheet
 * vào đây. ID là đoạn giữa /d/ và /edit trên thanh địa chỉ:
 *   https://docs.google.com/spreadsheets/d/1AbCdEf...XyZ/edit
 *                                          ^^^^^^^^^^^^^^ đoạn này
 */
var SPREADSHEET_ID = '';

// Các cột theo đúng thứ tự ghi xuống Sheet.
var HEADERS = [
  'Thời gian',
  'Mã đơn',
  'ID game',
  'Tên nhân vật',
  'Server hiện tại',
  'Cấp nhà',
  'Lực chiến xe 1',
  'Kênh liên hệ',
  'Thông tin liên hệ',
  'Ghi chú',
  'Ngôn ngữ',
  'Trạng thái'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.ticket      || '',
      data.gameId      || '',
      data.gameName    || '',
      data.server      || '',
      data.towerLevel  || '',
      data.power       || '',
      data.contactType || '',
      data.contact     || '',
      data.note        || '',
      data.lang        || '',
      'Chờ duyệt'
    ]);

    return json_({ ok: true, ticket: data.ticket || '' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Mở URL bằng trình duyệt sẽ thấy dòng này — dùng để kiểm tra đã deploy đúng chưa.
function doGet() {
  try {
    var sheet = getSheet_();
    return json_({
      ok: true,
      service: 'S134 migration intake',
      sheet: sheet.getParent().getName(),
      tab: sheet.getName(),
      rows: Math.max(0, sheet.getLastRow() - 1)
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Không tìm thấy Sheet. Hãy mở Apps Script từ trong Google Sheet ' +
      '(Extensions → Apps Script), hoặc điền ID Sheet vào biến SPREADSHEET_ID.'
    );
  }

  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Lần đầu chạy thì tạo hàng tiêu đề và định dạng cho dễ nhìn.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setFontWeight('bold');
    header.setBackground('#1b1f26');
    header.setFontColor('#ffb454');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(10, 300);
  }

  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
