# Agent Skill: User Requirements Document (URD) Generator (ISO 9241-210:2019)

## 1. Objective & Role

Bạn đóng vai trò **Principal User Experience (UX) Architect & Human-Centred Systems Analyst**.
Nhiệm vụ: Reverse-engineer toàn bộ codebase hiện hành kết hợp dữ liệu quét kiến trúc từ `agents-reverse-engineer` (ARE) để lập tài liệu User Requirements Document (URD) / Stakeholder Requirements Specification tại `docs/URD.md` tuân thủ tiêu chuẩn quốc tế **ISO 9241-210:2019** (Human-centred design for interactive systems).

## 2. Core Principles (ISO 9241-210 & ISO 9241-11)

1. **Human-Centric Focus:** Tập trung vào: Ai dùng? Mục tiêu là gì? Trở ngại (Pain points)? Hệ thống hỗ trợ ra sao? Không viết dưới góc nhìn DB Schema hay Server infrastructure.

2. **Context of Use:** Bóc tách môi trường thao tác (Desktop/Mobile/POS, tần suất nhập liệu, áp lực thời gian, điều kiện mạng).

3. **Traceability:** Mọi yêu cầu (`UR-[ID]`) phải truy xuất ngược về User Role và UI View/Route hoặc API Endpoint/CLI command tương ứng trong code.

4. **Syntax Safety:** Đảm bảo tất cả biểu đồ Mermaid hợp lệ. Khung ASCII Box-Drawing cố định 74–76 ký tự ngang.

### 2.1 Enterprise Business Tone (BẮT BUỘC cho mọi nội dung sinh ra)

- **Văn phong:** thể khách quan, trang trọng, ngôi thứ ba. Mỗi câu tối đa một ý chính; ưu tiên bảng ma trận, điều kiện tiên quyết và ràng buộc logic thay cho đoạn văn dài.
- **Cấm:**
  - câu đệm hội thoại hoặc văn nói ("Lưu ý nhé", "Thực ra", "Như bạn thấy", "Hãy thử");
  - giải thích cảm xúc hoặc nhận xét chủ quan của AI ("rất tiếc", "đáng lo", "yên tâm", "thật sự");
  - lời thoại ngôi thứ nhất của người dùng ("Tôi muốn…", "Mình cần…") và tên riêng giả định (Linh, Minh…);
  - biểu tượng cảm xúc (emoji) và ký hiệu trang trí; chỉ dùng nhãn văn bản chuẩn (`[OK]`, `[WARN]`, `[!]`, `[i]`);
  - các từ giảm nhẹ không có nội dung ("có lẽ", "khá", "hơi", "đại khái"). Điều chưa chắc chắn phải ghi bằng nhãn `[ASSUMPTION]`, `[UNKNOWN]` hoặc `[OPEN]`, không dùng từ giảm nhẹ.
- **Động từ hành động chuẩn mực:** xác định, thiết lập, kiểm tra, từ chối, ghi nhận, truy xuất, phê duyệt, chuyển đổi, hiển thị, ngăn chặn. Tránh: "nhìn thấy", "nắm được", "đụng tới", "kéo", "bấm" (trừ khi mô tả thao tác giao diện cụ thể).
- **Mẫu câu yêu cầu:** `<Tác nhân/Hệ thống> + <động từ hành động> + <đối tượng> + <điều kiện/ràng buộc>`. Ví dụ đúng: "Hệ thống từ chối bật nguồn khi `terms_status` chưa ở trạng thái đã duyệt." Ví dụ sai: "Mình muốn hệ thống đừng cho bật nguồn khi chưa được phép."
- **Nói đúng trạng thái bằng chứng:** nội dung chưa có trong mã phải gắn nhãn (`[SPEC]`, `[PROPOSED]`, `[ASSUMPTION]`); không diễn đạt như điều đã tồn tại.
- **Áp dụng cho URD:** Empathy Map giữ bốn thành phần Says – Thinks – Does – Feels nhưng diễn đạt bằng yêu cầu thông tin, nhận định và hành vi khách quan, không dùng lời thoại ngôi thứ nhất. Cột cảm xúc của Journey Map ghi "Mức thuận lợi" theo thang Thấp / Trung bình / Cao.

**Bảng chuẩn hóa thuật ngữ bắt buộc:**

| Thay vì | Dùng |
|---|---|
| Người dùng, persona, nhân vật | Tác nhân (Actor) |
| Người vận hành, ban vận hành | Đơn vị vận hành |
| Nỗi đau, rào cản, vướng mắc (Pain point) | Trở ngại quy trình |
| Tiêu chí hoàn thành, "xong là" | Tiêu chuẩn nghiệm thu |
| Trigger, lúc bắt đầu | Điểm kích hoạt |
| Cảm xúc (cột hành trình) | Mức thuận lợi (Thấp / Trung bình / Cao) |
| Nhu cầu ("Tôi muốn…") | Yêu cầu nghiệp vụ (câu khách quan) |

---

## 3. Decision Matrix: Hệ thống Cần Mockup vs Không Cần Mockup

Trước khi khởi tạo tài liệu, Agent phải tự động phân tích cấu trúc codebase để xác định loại hình hệ thống và rẽ nhánh phù hợp:

```
                  Kiểm tra Codebase & Packages
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [UI / Frontend Detected]             [Backend / Headless / CLI]
(React, Vue, Angular, Mobile,       (REST API, gRPC, Cronjobs, Workers,
 HTML templates, Blade, JSP...)      Microservices, CLI Tools...)
            │                                     │
            ▼                                     ▼
     BRANCH 1: UI-DRIVEN                   BRANCH 2: HEADLESS
  - Bắt buộc Low-Fi ASCII Mockup        - KHÔNG vẽ Mockup giao diện
  - Focus: Bố cục, Visual Hierarchy,   - Focus: CLI Workflow, Terminal Box,
    giảm tải thao tác chuột/phím           Payload/Schema Contract Interaction
```

### Rẽ nhánh 1: Hệ thống có Giao diện Người dùng (UI / Interactive Systems)
* **Dấu hiệu nhận biết:** Codebase chứa thư viện frontend (React, Vue, Next.js, Flutter, Svelte, Blade...), thư mục views, pages, components hoặc template HTML.
* **Yêu cầu bắt buộc:** Tại Mục 6 của tài liệu, mỗi yêu cầu người dùng phải tích hợp **Low-Fidelity ASCII Wireframe Mockup** (Pattern A, B hoặc C) để xác thực bố cục dữ liệu và luồng thao tác.

### Rẽ nhánh 2: Hệ thống Backend, API, Dịch vụ ngầm hoặc CLI (Headless / Service Systems)
* **Dấu hiệu nhận biết:** Codebase thuần backend API (NestJS, Spring Boot API, Go fiber/gin, FastAPI, Express...), worker queues, cronjobs, CLI tooling.
* **Quy tắc thực thi:** **TUYỆT ĐỐI KHÔNG BỊA MOCKUP GIAO DIỆN WEB/APP.** 
* **Giải pháp thay thế Mockup:** Thay thế khung Mockup bằng:
  1. **Terminal / CLI Interaction Box** (nếu là công cụ dòng lệnh).
  2. **Data & Action Interaction Matrix** (nếu là API / Headless Backend) mô tả:
     - Input Parameters người dùng cung cấp (kèm ý nghĩa nghiệp vụ đời thường).
     - Kết quả hệ thống phản hồi (kèm thông điệp thân thiện với người vận hành).
     - Trạng thái xử lý bất đồng bộ hoặc cảnh báo ngoại lệ.

---

## 4. Visual Artifacts Reference System

### Phân nhánh A: Dành cho Hệ thống có UI (Low-Fi ASCII Mockups)

#### Pattern A1: Multi-step Wizard (Quy trình tuần tự nhiều bước)
```text
┌────────────────────────────────────────────────────────────────────────┐
│  [PROCESS TITLE]                                           [Cancel] [X]│
├────────────────────────────────────────────────────────────────────────┤
│  STEP INDICATOR:                                                       │
│  (1) [Step 1 Name] ─── [2] [Current Step] ─── (3) [Step 3] ─── (4) End │
│      [Completed]            [Active]              [Upcoming] [Upcoming]│
├────────────────────────────────────────────────────────────────────────┤
│  SECTION: 2. [Current Step Details & Configurations]                   │
│                                                                        │
│  * [Field Label 1]                 * [Field Label 2]                   │
│  ┌──────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │ [Sample Value / Code]        │  │ [Formatted Numeric / Text]      │ │
│  └──────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                        │
│  * [Dropdown Selection]            * [Radio Option Field]              │
│  ┌──────────────────────────────┐  (•) [Selected Option]               │
│  │ [ Dropdown Value         ▼ ] │  ( ) [Unselected Option]             │
│  └──────────────────────────────┘                                      │
│                                                                        │
│  [!] Validation Warning: [Dynamic message based on validation rules]   │
│                                                                        │
│  Options / Switches:                                                   │
│  [X] [Active Switch / Checkbox Rule]                                   │
│  [ ] [Inactive Option]                                                 │
├────────────────────────────────────────────────────────────────────────┤
│  [ < Back: Prev Step ]            [ Save Draft ]     [ Next Step > ]   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Pattern A2: Dashboard KPI (Theo dõi chỉ số, trạng thái vận hành)
```text
┌────────────────────────────────────────────────────────────────────────┐
│  [DASHBOARD / MONITORING TITLE]                    [Live: Connected ●] │
│  Time Range: [ Today (2026-10-30) ▼ ]              Last Sync: 14:42:10 │
├────────────────────────────────────────────────────────────────────────┤
│  KEY METRICS SUMMARY                                                   │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│  │ [METRIC 1 NAME]   │  │ [METRIC 2 NAME]   │  │ [METRIC 3 NAME]   │   │
│  │ 1,428.50 B VND    │  │ 384,192 (1,240/s) │  │ 1.82 ms (p99)     │   │
│  │ ▲ +12.4% vs T-1   │  │ ▲ +5.1% Peak      │  │ ▼ -0.3ms (Stable) │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│  CHART / HISTORICAL VELOCITY                                           │
│  Val                                                                   │
│   400 ┤        ┌──┐                                                    │
│   300 ┤  ┌──┐  │  │        ┌──┐                                        │
│   200 ┤  │  │  │  │  ┌──┐  │  │  ┌──┐                                  │
│   100 ┼──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴─────────────────────────         │
│       [T1]  [T2]  [T3]  [T4]  [T5] (Timeline Units)                    │
├────────────────────────────────────────────────────────────────────────┤
│  ALERT & SYSTEM LOGS                                                   │
│  [OK]    [Service Component A]: Running within nominal parameters      │
│  [WARN]  [Service Component B]: Utilization threshold reached (>80%)  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Pattern A3: Data Grid with Advanced Filter (Tra cứu, quản lý danh sách)
```text
┌────────────────────────────────────────────────────────────────────────┐
│  [DATA MANAGEMENT / AUDIT GRID TITLE]                                  │
├────────────────────────────────────────────────────────────────────────┤
│  ADVANCED FILTERS:                                                     │
│  Search: [ Keyword / Unique ID...  ]  Status: [ Selected Status    ▼ ] │
│  Range:  [ YYYY-MM-DD ] to [ YYYY-MM-DD ]     [ Filter ]   [ Reset ]   │
├────────────────────────────────────────────────────────────────────────┤
│  Selected: 2 items                   [ Action 1 ]    [ Action 2 ]      │
│  ┌───┬──────────┬──────────────┬─────────┬──────────┬────────┬───────┐ │
│  │[X]│ Record ID│ Attribute 1  │ Qty/Num │ Status   │ Time   │ Action│ │
│  ├───┼──────────┼──────────────┼─────────┼──────────┼────────┼───────┤ │
│  │[X]│ #REC-001 │ Sample Alpha │ 10,000  │ SUCCESS  │ 14:20  │ [...] │ │
│  │[X]│ #REC-002 │ Sample Beta  │ 5,000   │ SUCCESS  │ 14:15  │ [...] │ │
│  │[ ]│ #REC-003 │ Sample Gamma │ 50,000  │ PENDING  │ 13:58  │ [...] │ │
│  │[ ]│ #REC-004 │ Sample Delta │ 2,000   │ REJECTED │ 13:40  │ [!]   │ │
│  └───┴──────────┴──────────────┴─────────┴──────────┴────────┴───────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  Showing 1 - 4 of 1,240 records       [|<] [<] [1] 2 3 ... 50 [>] [>|] │
│  Rows per page: [ 25 ▼ ]                                               │
└────────────────────────────────────────────────────────────────────────┘
```

### Phân nhánh B: Dành cho Hệ thống Headless / API / CLI (Không dùng UI Mockup)

#### Pattern B1: CLI Command Workflow Simulation
```text
┌────────────────────────────────────────────────────────────────────────┐
│  TERMINAL CLI INTERACTION: [Command Name / Operation]                  │
├────────────────────────────────────────────────────────────────────────┤
│  $ sysctl order create --symbol "VNM" --qty 1000 --side "buy"          │
│  > Checking account balance... [OK]                                    │
│  > Validating price limits with exchange... [OK]                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Order ID    : #ORD-2026-9912                                     │  │
│  │ Status      : SUBMITTED (Pending execution)                      │  │
│  │ Total Value : 72,500,000 VND                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  [?] Confirm submission to live matching engine? (y/N): y              │
│  ✓ Successfully placed order #ORD-2026-9912                            │
└────────────────────────────────────────────────────────────────────────┘
```

#### Pattern B2: API Consumer Action & Data Interaction Matrix
```text
┌────────────────────────────────────────────────────────────────────────┐
│  API STAKEHOLDER INTERACTION: [Operation / Event Trigger]              │
├────────────────────────────────────────────────────────────────────────┤
│  Hành động người dùng/tích hợp: Gửi yêu cầu tất toán giao dịch         │
│  Dữ liệu cung cấp: [ AccountId, SettlementDate, BatchReference ]       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ KẾT QUẢ TRẢ VỀ CHO NGƯỜI VẬN HÀNH / BÊN TÍCH HỢP:                │  │
│  │ • Thông điệp nghiệp vụ: Yêu cầu đã được tiếp nhận và xử lý theo lô│  │
│  │ • Trạng thái tiến trình: 85% hoàn tất (170/200 records thanh công)│  │
│  │ • Báo cáo lỗi (nếu có): Chi tiết lý do từ chối rõ nghĩa theo mã lỗi│ │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Standard URD Outline (ISO 9241-210:2019)

Tài liệu xuất ra tại `docs/URD.md` phải tuân thủ nghiêm ngặt 8 phần:

```
1. GIỚI THIỆU & NGUYÊN TẮC HCD
   1.1 Mục đích tài liệu (Xác định nhu cầu người dùng & Usability criteria)
   1.2 Tuyên bố lấy con người làm trung tâm (Giảm tải Cognitive load)
   1.3 Thuật ngữ & Khái niệm người dùng (User Glossary)

2. BỐI CẢNH SỬ DỤNG (CONTEXT OF USE ANALYSIS)
   2.1 Đặc điểm người dùng (Trình độ, thói quen, tần suất sử dụng)
   2.2 Môi trường vận hành (Thiết bị, độ phân giải, mạng, áp lực thời gian hoặc terminal env)
   2.3 Nhiệm vụ cốt lõi (Bảng ma trận nhiệm vụ & tần suất)

3. CHÂN DUNG NGƯỜI DÙNG (USER PERSONAS & EMPATHY MAPS)
   - Tối thiểu 2-3 Personas bóc tách từ Roles/Guards/API Consumers trong code.
   - Empathy Map (Says - Thinks - Does - Feels).

4. BẢN ĐỒ HÀNH TRÌNH TRẢI NGHIỆM (USER JOURNEY MAPS)
   - Ma trận hành trình: Giai đoạn -> Điểm chạm (Touchpoints: Screens, CLI, Webhook Alerts) -> Cảm xúc -> Rào cản.

5. SƠ ĐỒ LUỒNG CÔNG VIỆC CỦA NGƯỜI DÙNG (TASK FLOWS)
   - Biểu đồ `mermaid flowchart TD` từ góc nhìn thao tác người dùng (kèm cơ chế Error Prevention & Self-recovery).

6. ĐẶC TẢ CHI TIẾT YÊU CẦU NGƯỜI DÙNG (Trọng tâm)
   Mỗi yêu cầu UR-[MODULE]-[STT] gồm:
   - Tên hành động người dùng + Traceability (UI Route hoặc API Endpoint/CLI).
   - [ĐIỀU KIỆN RẼ NHÁNH]:
     * Nếu là hệ thống UI: Áp dụng Low-Fi ASCII Mockup (Pattern A1, A2 hoặc A3).
     * Nếu là hệ thống Backend/Headless/CLI: Áp dụng Simulation Box (Pattern B1 hoặc B2).
   - Kịch bản tương tác (Optimal Flow & Exception/Alternative Flow).
   - Quy tắc công thái học & Chống sai sót (Confirmation, Auto-format, Hotkeys, Inline errors).

7. TIÊU CHÍ KHẢ DỤNG & CÔNG THÁI HỌC (ISO 9241-11)
   - Tính hiệu quả (Effectiveness: Completion rate >95%).
   - Tính hiệu suất (Efficiency: Tối ưu số bước thao tác, thời gian phản hồi).
   - Mức độ hài lòng & Tiếp cận (Satisfaction & Accessibility / API Developer Experience).
   - Khả năng học hỏi (Learnability).

8. PHƯƠNG PHÁP ĐÁNH GIÁ TRẢI NGHIỆM (USABILITY EVALUATION)
   - Bảng kịch bản Usability Test (Test Tasks, Pass/Fail criteria).
```

---

## 6. Mandatory Phased Execution Workflow for Agent

Khi skill này được kích hoạt, Agent **bắt buộc phải tự động chia thành 4 giai đoạn** thực thi nối tiếp:

* **Giai đoạn 1 (Khởi tạo, Quét & Quyết định Rẽ nhánh):** 
  - Quét codebase qua `.are/` (chạy `are scan --depth 3 --output .are/` nếu chưa có).
  - Xác định hệ thống thuộc **Phân nhánh 1 (UI-driven)** hay **Phân nhánh 2 (Headless/Backend)** theo Mục 3.
  - Tạo mới file `docs/URD.md` và viết **Mục 1, 2, 3** (ghi rõ loại hình hệ thống được nhận diện).

* **Giai đoạn 2 (Hành trình & Luồng tác vụ):** 
  - Nối tiếp (append) vào `docs/URD.md`.
  - Phân tích luồng thao tác người dùng để viết **Mục 4 & 5** (kèm `mermaid flowchart TD`).

* **Giai đoạn 3 (Đặc tả chi tiết từng Module & Visual Artifacts):** 
  - Nối tiếp (append) vào `docs/URD.md`.
  - Duyệt qua từng module nghiệp vụ để viết **Mục 6** (áp dụng đúng Mockup cho UI hoặc Terminal/Contract Box cho Headless).

* **Giai đoạn 4 (Tiêu chí khả dụng & Kiểm thử cú pháp):** 
  - Nối tiếp **Mục 7 & 8**.
  - Chạy script `node scripts/validate-mermaid.mjs docs/URD.md` (hoặc `python scripts/validate_mermaid.py docs/URD.md`), tự sửa lỗi parse nếu có cho đến khi pass 100%.