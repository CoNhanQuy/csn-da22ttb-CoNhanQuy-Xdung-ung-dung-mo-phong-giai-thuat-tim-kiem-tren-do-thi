# Mô phỏng BFS/DFS - DA22TTB ✅

**Mô tả ngắn:**
Ứng dụng Electron đơn giản để mô phỏng và trực quan hóa hai thuật toán tìm kiếm đồ thị: BFS (Breadth-First Search - Lan rộng) và DFS (Depth-First Search - Dò sâu) trên một lưới (grid). Người dùng có thể vẽ tường, kéo điểm bắt đầu/kết thúc, hoặc nạp ma trận 0/1 để mô phỏng.

---

## 🔧 Tính năng chính

- Hiển thị lưới tương tác (mặc định 20x20).
- Vẽ tường bằng cách nhấn giữ chuột.
- Kéo thả điểm bắt đầu (`start`) và điểm kết thúc (`end`).
- Chạy từng thuật toán: **BFS** hoặc **DFS**.
- So sánh đồng thời hai thuật toán (BFS vs DFS).
- Nhập ma trận 0/1 để khởi tạo lưới (0 = ô trống, 1 = tường).
- Hiển thị đường đi và ô đã được duyệt (màu khác nhau cho BFS/DFS).

---

## 🚀 Cài đặt & Chạy

Yêu cầu: Node.js (khuyến cáo phiên bản 16+).

1. Cài đặt phụ thuộc:

```bash
npm install
```

2. Chạy ứng dụng (sử dụng Electron):

```bash
npm start
```

Lệnh `start` trong `package.json` hiện chạy `electron .` (Electron được liệt kê trong `devDependencies`). Nếu không muốn cài Electron cục bộ, bạn có thể cài toàn cục hoặc dùng `npx electron .`.

---

## 🧭 Cách sử dụng

- Mở ứng dụng, bạn sẽ thấy lưới và bảng điều khiển bên trái.
- Sử dụng nút **Xóa / Tạo Mới** để reset (có tùy chọn giữ lại tường khi chỉ dừng thuật toán).
- Nhấn và giữ chuột để vẽ tường.
- Kéo ô `start` hoặc `end` để thay đổi vị trí.
- Nhấn **Chạy BFS** hoặc **Chạy DFS** để bắt đầu mô phỏng.
- Nhấn **So sánh cả 2** để bật hai lưới và chạy BFS trên lưới chính, DFS trên lưới phụ.
- Để nạp ma trận: nhập ma trận 0/1 (các dòng phân tách bằng xuống dòng, các số cách nhau bởi dấu cách) rồi nhấn **Mô phỏng từ Ma trận**. 0 = ô trống, 1 = tường.

Ví dụ ma trận:
```
0 0 1 0 0
0 1 0 0 0
0 0 0 1 0
```

---

## 📝 Cấu trúc thư mục (chính)

- `index.html` – giao diện chính.
- `style.css` – kiểu dáng giao diện.
- `script.js` – logic mô phỏng (tạo lưới, xử lý chuột, thuật toán BFS/DFS).
- `main.js` – phần khởi tạo cửa sổ Electron.
- `package.json` – thông tin gói và script `start`.

---

## ⚠️ Ghi chú kỹ thuật

- `main.js` bật `nodeIntegration: true` và `contextIsolation: false` để tiện phát triển; đây không phải cấu hình an toàn nhất cho ứng dụng production.
- Tốc độ mô phỏng được điều khiển bởi biến `SPEED` trong `script.js` (mặc định 30ms) và tốc độ vẽ đường đi là 150ms.

---

## 🧑‍💻 Góp ý & Phát triển

- Bạn có thể mở rộng: thêm các thuật toán khác (Dijkstra, A*), tinh chỉnh UI/UX, hỗ trợ lưu/ tải ma trận, thêm kiểm tra đầu vào.

---

## 📄 Giấy phép

Hiện chưa có thông tin tác giả hoặc license trong `package.json`. Bạn có thể thêm trường `author` và `license` nếu cần.

---

Nếu bạn muốn, mình có thể: thêm badges, ví dụ ảnh chụp màn hình, hoặc bản README tiếng Anh. 💡
