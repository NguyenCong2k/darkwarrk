# Server 134 — Trang đăng ký di cư (Dark War: Survival)

Trang tuyển quân một file, ba ngôn ngữ Việt / Anh / Trung, dùng để thu đơn migration về Server 134. Người chơi điền form, dữ liệu chảy thẳng vào Google Sheet của bạn.

## Nội dung thư mục

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ trang web: giao diện, hình vẽ, form, ba ngôn ngữ. Một file duy nhất, không phụ thuộc thư viện ngoài. |
| `apps-script.gs` | Code dán vào Google Apps Script để nhận đơn và ghi vào Sheet. |
| `images/` | Thư mục tuỳ chọn để thả ảnh game của bạn (xem mục 5). |

---

## 1. Nối form với Google Sheet

1. Tạo một Google Sheet mới (đặt tên gì cũng được). Không cần tạo tab, không cần gõ tiêu đề cột — script tự tạo hết ở lần nhận đơn đầu tiên.
2. **Đang mở chính Sheet đó**, vào **Extensions → Apps Script**. Mở kiểu này thì script gắn thẳng vào Sheet, nên không phải dán link Sheet vào đâu cả.
3. Xoá hết code mẫu, dán toàn bộ nội dung `apps-script.gs` vào, bấm lưu.
4. Bấm **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Lần đầu Google sẽ hỏi cấp quyền. Chọn tài khoản → *Advanced* → *Go to … (unsafe)* → *Allow*. Cảnh báo này là bình thường với script tự viết.
6. Copy URL kết thúc bằng `/exec`.
7. Mở `index.html`, tìm dòng:

```js
const SHEET_ENDPOINT = "";
```

dán URL vào giữa hai dấu nháy:

```js
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfy..../exec";
```

**Kiểm tra:** dán URL `/exec` thẳng vào trình duyệt. Đúng thì thấy tên Sheet nó đang nối tới:

```json
{"ok":true,"service":"S134 migration intake","sheet":"Ten Sheet Cua Ban","tab":"DonDangKy","rows":0}
```

Nếu thấy `{"ok":false,"error":"...Không tìm thấy Sheet..."}` nghĩa là bạn đã tạo project rời ở `script.google.com` thay vì mở từ trong Sheet. Hai cách chữa: xoá project đó rồi làm lại từ bước 2, hoặc điền ID Sheet vào biến `SPREADSHEET_ID` ở đầu `apps-script.gs` (ID là đoạn giữa `/d/` và `/edit` trên thanh địa chỉ của Sheet).

> Mỗi lần sửa code trong Apps Script phải **Deploy → Manage deployments → Edit → New version**, nếu không URL cũ vẫn chạy code cũ.

## 2. Điền link nhóm liên hệ

Ngay dưới `SHEET_ENDPOINT`:

```js
const CONTACT_LINK = "";
```

Dán link nhóm Zalo, invite Discord hoặc QR group vào. Điền xong thì nút **"Vào nhóm liên hệ"** tự hiện ở màn hình cảm ơn sau khi gửi đơn. Để trống thì nút ẩn, trang vẫn chạy bình thường.

## 3. Tạo link cho người khác bấm vào

Trang phải nằm trên một máy chủ web thì mới có link chia sẻ được. Chọn một trong ba cách dưới đây, cách nào cũng miễn phí.

### Cách nhanh nhất — Netlify Drop (2 phút, không cần tài khoản để thử)

1. Mở `app.netlify.com/drop`.
2. Kéo nguyên **thư mục** `darkwarrk` thả vào ô giữa trang.
3. Đợi vài giây, Netlify trả về link dạng `https://ten-ngau-nhien-123.netlify.app`.
4. Đó chính là link gửi cho anh em. Muốn đổi tên đẹp hơn thì đăng nhập, vào *Site configuration → Change site name*.

Lưu ý: kéo cả thư mục chứ không phải chỉ mỗi file `index.html`, để `images/` đi theo.

### Cloudflare Pages (tốc độ tốt ở Việt Nam)

1. Đăng ký `pages.cloudflare.com`, bấm **Create a project → Direct Upload**.
2. Đặt tên project, upload thư mục.
3. Link có dạng `https://ten-project.pages.dev`.

### GitHub Pages (hợp khi sửa nội dung lâu dài)

1. Tạo repo mới trên GitHub, upload 3 file.
2. Vào **Settings → Pages**, mục *Source* chọn nhánh `main`, thư mục `/ (root)`, bấm Save.
3. Đợi 1–2 phút, link có dạng `https://ten-tai-khoan.github.io/ten-repo/`.

### Muốn tên miền riêng?

Mua tên miền ở Namecheap / Cloudflare / Tenten (khoảng 200–300k/năm), rồi trỏ về site Netlify hoặc Cloudflare Pages trong phần *Custom domain*. Không bắt buộc — link mặc định dùng vẫn tốt.

### Vài điều cần biết

- Mở file bằng cách nhấp đúp (`file:///…`) chỉ để xem thử. Gửi đường dẫn đó cho người khác sẽ **không** mở được, và form gửi lên Google Sheet có thể bị trình duyệt chặn. Phải host mới dùng thật được.
- Sau khi sửa `index.html`, phải upload lại thì bản trên mạng mới đổi theo.
- Muốn link mở thẳng một ngôn ngữ, thêm đuôi `?lang=`:
  - Tiếng Trung: `https://link-cua-ban.netlify.app/?lang=zh`
  - Tiếng Anh: `https://link-cua-ban.netlify.app/?lang=en`
  - Tiếng Việt: `https://link-cua-ban.netlify.app/?lang=vi`

## 4. Ngôn ngữ

Trang có nút **VI / EN / 中文** ở góc phải thanh điều hướng.

Thứ tự ưu tiên khi mở trang:

1. Đuôi `?lang=vi`, `?lang=en` hoặc `?lang=zh` trên URL — dùng khi muốn gửi link chỉ định sẵn ngôn ngữ.
2. Lựa chọn người dùng đã bấm lần trước (lưu trong trình duyệt của họ).
3. Ngôn ngữ hệ thống: trình duyệt tiếng Trung mở bản tiếng Trung, tiếng Anh mở bản tiếng Anh, còn lại mặc định tiếng Việt.

Ngôn ngữ người gửi đang dùng cũng được ghi vào Sheet ở cột **Ngôn ngữ**, để bạn biết nên trả lời bằng tiếng gì.

### Sửa chữ hoặc thêm ngôn ngữ mới

Toàn bộ câu chữ nằm trong khối `const I18N = { … }` ở đầu phần `<script>`, chia ba nhóm `vi`, `en` và `zh`. Sửa chữ thì sửa thẳng trong đó — cả ba nhóm dùng chung bộ khoá.

Thêm ngôn ngữ thứ tư (ví dụ tiếng Thái):

1. Copy nguyên khối `en: { … }`, đổi khoá thành `th`, dịch lại phần giá trị.
2. Thêm một nút vào thanh nav, cạnh ba nút có sẵn:

```html
<button type="button" data-setlang="th" aria-pressed="false">TH</button>
```

3. Nếu ngôn ngữ đó cần bộ chữ riêng, thêm một khối như `html[data-lang="zh"]` trong `<style>` để đổi `--font-body` và `--font-display`.

Xong. Không cần sửa gì thêm.

## 5. Thay ảnh game (tuỳ chọn)

Trang đang dùng tranh vector tự vẽ theo phong cách hậu tận thế của game, nên chạy được ngay và không dính bản quyền hình ảnh của nhà phát hành.

Muốn dùng ảnh thật:

1. Tạo thư mục `images/` cạnh `index.html`.
2. Bỏ vào file tên `hero.jpg` — ảnh nền lớn ở đầu trang, nên rộng khoảng 1920px.
3. Thêm `og.jpg` (1200×630) nếu muốn ảnh xem trước đẹp khi dán link vào Zalo / WeChat / Facebook.

Không có file thì trang tự bỏ qua, không lỗi, không hiện ô ảnh vỡ.

Nên dùng ảnh chụp màn hình do chính bạn chụp trong game, tránh lấy key art thương mại của nhà phát hành.

## 6. Sửa nội dung và màu sắc

- Mọi câu chữ: khối `I18N` trong `<script>` (xem mục 4).
- Bốn con số ở dải thống kê: các thẻ `<div class="stat">` trong HTML.
- Màu chủ đạo: các biến ở đầu khối `<style>`, ví dụ `--amber:#ff8a1f`.
- Tên liên minh: hiện để chung chung là "Server 134". Muốn gắn tên riêng thì sửa `<div class="brand">` ở nav và các khoá `hero.*` trong `I18N`.

## 7. Các trường trong form

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| ID game | Có | Chỉ nhận chữ số |
| Tên nhân vật | Có | Tối đa 40 ký tự |
| Server hiện tại | Có | Chỉ nhận chữ số |
| Cấp độ nhà | Có | Danh sách cấp 25–30 và I1–I10. Sửa mảng `LEVELS` trong `index.html` để đổi danh sách. |
| Lực chiến xe 1 | Có | Tự chèn dấu chấm ngăn cách hàng nghìn |
| Kênh liên hệ | Có | Zalo / Discord / WeChat / QQ / Facebook / Telegram / Khác |
| Thông tin liên hệ | Có | Số điện thoại, tag hoặc link |
| Ghi chú | Không | Tối đa 500 ký tự |

Mỗi đơn được cấp một mã dạng `S134-0822-A3KD` để tiện tra cứu khi nhắn tin.

## 8. Phòng khi Google Sheet trục trặc

Mỗi đơn còn được lưu tạm trong trình duyệt của chính người gửi. Nếu nghi ngờ mất đơn, bảo người đó mở trang với đuôi `?admin=1`:

```
https://ten-trang-cua-ban/?admin=1
```

Một nút **"Tải CSV đơn lưu tạm"** hiện ở góc dưới trái, bấm để lấy file. Bản lưu tạm này chỉ nằm trên máy người gửi, giữ tối đa 50 đơn gần nhất.

---

Trang do cộng đồng người chơi tự lập, không phải trang chính thức và không có liên kết với nhà phát hành Dark War: Survival.
