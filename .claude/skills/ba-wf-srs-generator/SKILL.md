# Agent Skill: Software Requirements Specification (SRS) Generator

## Objective
Thực hiện reverse-engineering toàn diện codebase hiện hành bằng cách kết hợp dữ liệu quét cấu trúc từ `agents-reverse-engineer` (ARE) với việc duyệt trực tiếp code nguồn, nhằm biên soạn bộ tài liệu Software Requirements Specification (SRS) tuân thủ tiêu chuẩn quốc tế **ISO/IEC/IEEE 29148:2018** (Systems and software engineering — Life cycle processes — Requirements engineering).

---

## 1. Core Extraction & Validation Rules
1. **Evidence-Based Engineering (Bằng chứng thực tế):**
   - Tuyệt đối không giả định tính năng. Mọi yêu cầu nghiệp vụ đều phải đối chiếu được với code.
   - Mỗi Functional Requirement (`FR-XXX`) bắt buộc phải ghi rõ:
     - `File Path` (đường dẫn file Controller, Service, Repository, Handler).
     - `Method / Handler` (hàm cụ thể xử lý logic).
     - `Data Entities & Tables` (model, entity, migrations liên quan).
2. **Context Window Management (Chống tràn token):**
   - Đọc bản đồ kiến trúc từ `.are/summary.md` hoặc `are-manifest.json` trước.
   - Khi bóc tách từng module, chỉ tải theo chuỗi: `Route/Controller` -> `Service/Domain` -> `Entity/Migration`.
   - **Chiến lược ghi file:** Tuyệt đối không ghi toàn bộ tài liệu trong một lượt gọi duy nhất. Phải ghi tuần tự theo giai đoạn (Mục 1-6 -> Mục 7-8 -> Mục 9.1 Module A -> Mục 9.1 Module B -> Mục 9.2) bằng công cụ nối tiếp file (Append/Edit).
3. **Syntax Safety:**
   - Đảm bảo mã Mermaid không chứa dấu ngoặc kép trần hoặc ký tự đặc biệt gây lỗi parser. Luôn encode chuỗi phức tạp trong label (ví dụ: dùng `["Text"]` hoặc các ký tự HTML entity an toàn).
   - Toàn bộ Wireframe Mockup phải dùng ký tự Box-Drawing chuẩn với chiều rộng cố định (74-76 ký tự).
4. **Enterprise Business Tone (BẮT BUỘC cho mọi nội dung sinh ra):**

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
   - **Áp dụng cho SRS:** yêu cầu chức năng dùng động từ "phải/không được" (shall/shall not) cho điều bắt buộc; mô tả chu trình xử lý bằng câu khẳng định, không bằng lời kể. Bảng Error Codes ghi điều kiện kích hoạt, trạng thái HTTP và cơ chế rollback; không dùng câu mô tả chung chung.

   **Bảng chuẩn hóa thuật ngữ bắt buộc:**

   | Thay vì | Dùng |
   |---|---|
   | Người dùng, user | Tác nhân (Actor) |
   | Hệ thống "tự lo", "tự xử" | Hệ thống thực hiện `<hành động>` theo `<quy tắc>` |
   | Lỗi chung chung ("bị lỗi") | Điều kiện lỗi + mã lỗi + hành động xử lý |
   | Tiêu chí hoàn thành | Tiêu chuẩn nghiệm thu |
   | Trigger | Điểm kích hoạt |
   | Pain point | Trở ngại quy trình |

---

## 2. Mockup Reference Design System (ASCII Wireframes)

Khi mô tả các chức năng tương tác tại **Mục 9.1 (Functional Requirements)**, Agent bắt buộc phải chọn và render Mockup tương ứng theo các khuôn mẫu chuẩn dưới đây:

### Pattern A: Multi-step Wizard (Dành cho quy trình tạo mới/phê duyệt nhiều bước)
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

### Pattern B: Dashboard KPI (Dành cho màn hình theo dõi số liệu, metrics, trạng thái)
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

### Pattern C: Data Grid with Advanced Filter (Dành cho tra cứu, quản lý danh sách)
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

---

## 3. Standard SRS Outline (ISO/IEC/IEEE 29148:2018)
Tài liệu xuất ra tại `docs/SRS.md` phải tuân thủ nghiêm ngặt theo kết cấu 9 phần sau:

```text
1. INTRODUCTION
1.1 Purpose: Mục đích kỹ thuật của tài liệu và đối tượng tiếp nhận.
1.2 Scope: Tên sản phẩm, mục tiêu thiết kế và ranh giới hệ thống (System Boundaries).
1.3 Product Overview: Vị trí của hệ thống trong ngữ cảnh vận hành và tổng thể tổ chức.
1.4 Definitions, Acronyms, and Abbreviations: Bảng thuật ngữ chuyên ngành (Domain glossary) bóc tách trực tiếp từ logic code.

2. REFERENCES
Danh mục tài liệu kỹ thuật, RFC, đặc tả framework, package dependencies và các chuẩn bảo mật/kỹ thuật liên quan.

3. SPECIFIC SYSTEM CONSTRAINTS
3.1 Regulatory & Compliance Constraints: Ràng buộc bảo mật, an toàn dữ liệu hoặc chuẩn ngành.
3.2 Hardware and Environment Limitations: Cấu hình hạ tầng, CPU, Memory, Storage tối thiểu.
3.3 Technology Stack Constraints: Ràng buộc về ngôn ngữ, runtime, database engine, cache, messaging protocol.

4. SYSTEM ARCHITECTURE & HIGH LEVEL DESIGN (HLD)
High-Level Design Architecture (mermaid graph TD): Phân tầng rõ rệt: Presentation Layer -> API Gateway / Load Balancer -> Application / Core Domain Services -> Infrastructure / Persistence & External Systems.
Integration Context: Danh mục các cổng kết nối ngoại vi (External APIs, Webhooks, BaaS).

5. USER CHARACTERISTICS & ROLES
Bảng phân quyền Role-Based Access Control (RBAC) bóc tách từ middleware, Guards hoặc bảng User/Role.

6. OPERATIONAL SCENARIOS & USE CASE MODELING
Bảng tổng hợp Use Case Matrix (Use Case ID, Name, Primary Actor, Preconditions, Postconditions).
Sơ đồ tương tác người dùng tổng thể (mermaid graph LR hoặc flowchart).

7. DATA REQUIREMENTS & LOGICAL DATABASE
7.1 Entity-Relationship Diagram (mermaid erDiagram): Trích xuất từ models, ORM entities hoặc migrations (đầy đủ các quan hệ 1-1, 1-n, n-n và các khóa PK, FK).
7.2 Data Dictionary: Bảng mô tả chi tiết các trường, kiểu dữ liệu, ràng buộc (Not Null, Unique, Index).

8. EXTERNAL INTERFACE REQUIREMENTS
8.1 User Interfaces: Nguyên tắc trải nghiệm và chuẩn thiết kế giao diện.
8.2 Software & API Interfaces: Định dạng giao tiếp (RESTful JSON, gRPC, WebSocket), Common Request Headers, Authentication Token, Common Response/Error Wrapper DTO.
8.3 Communication Protocols: Giao thức mạng, Port, mã hóa đường truyền (TLS/SSL).

9. SYSTEM REQUIREMENTS (Trọng tâm)
9.1 Functional Requirements (Theo từng Module nghiệp vụ)
Mỗi chức năng phải được bóc tách theo mẫu chuẩn:
- Identifier: FR-[MODULE]-[ID]
- Title & Code Traceability: Tên chức năng + Đường dẫn file Controller/Service/Handler cụ thể.
- UI / Interaction Mockup: Render bằng ASCII Wireframe Box-Drawing tương ứng (Pattern A, B hoặc C).
- Preconditions & Postconditions: Điều kiện trước và sau khi kích hoạt.
- Inputs & Validation Rules: Bảng chi tiết trường dữ liệu, kiểu, tính bắt buộc, regex/ràng buộc.
- Logic Decision Flowchart (mermaid flowchart TD): Lưu đồ thuật toán, rẽ nhánh if/else, kiểm tra điều kiện.
- Call-Stack Sequence Diagram (mermaid sequenceDiagram): Trình tự tương tác runtime: Actor -> Controller -> Service -> Repo -> DB / External Queue.
- Exception & Error Handling: Mã lỗi (Error Code, HTTP Status), điều kiện kích hoạt, cơ chế rollback.

9.2 Non-Functional Requirements (NFRs / Quality Attributes)
- Performance & Scalability: Throughput dự kiến, TPS, thời gian phản hồi (p95, p99), chiến lược caching, database connection pooling.
- Security: Cơ chế xác thực (JWT, OAuth2), thuật toán mã hóa (Hash passwords, Data at rest/transit), CORS, Rate limiting, CSRF protection.
- Reliability & Availability: Health check probes, logging framework, circuit breaker, retry policies, database transaction isolation level.
- Maintainability: Cấu trúc module, quy ước Clean Architecture / DDD, độ bao phủ test (Unit/Integration tests).
```

---

## 4. Execution Workflow for Claude Agent
1. **Quét sơ đồ:** Kiểm tra thư mục `.are/`. Nếu chưa có, tự chạy `are scan --depth 3 --output .are/`.
2. **Lập kế hoạch phân mảnh:** Đọc `.are/summary.md` để liệt kê các module.
3. **Biên tập phân tầng & Nối tiếp file (Phased Append):**
   - **Phase 1:** Viết Mục 1 đến Mục 6 trước (Khởi tạo `docs/SRS.md`).
   - **Phase 2:** Nối tiếp Mục 7 & 8 (Database ERD, Data Dictionary, API Contracts).
   - **Phase 3:** Nối tiếp lần lượt từng module nghiệp vụ cho Mục 9.1 (kèm Mockup ASCII + Flowchart + Sequence Diagram), sau đó viết Mục 9.2 (NFRs).
4. **Kiểm tra cú pháp tự động (Automated Verification):**
   - Chạy script kiểm thử: `node scripts/validate-mermaid.mjs docs/SRS.md` hoặc `python scripts/validate_mermaid.py docs/SRS.md`.
   - Nếu script báo lỗi cú pháp (parse error, lexical error), đọc dòng lỗi, sửa trực tiếp vào `docs/SRS.md` và chạy lại cho đến khi pass 100%.