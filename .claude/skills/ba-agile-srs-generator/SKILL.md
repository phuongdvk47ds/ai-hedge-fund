# Agent Skill: Agile Software Requirements Specification (Agile SRS) Generator

## Objective
Thực hiện reverse-engineering codebase hiện hành bằng cách kết hợp dữ liệu quét cấu trúc từ `agents-reverse-engineer` (ARE) với việc duyệt trực tiếp code nguồn (routes, domain services, tests, entities), nhằm biên soạn bộ tài liệu Agile SRS / Living Requirements Specification tuân thủ tiêu chuẩn quốc tế **ISO/IEC/IEEE 26515:2018** (Developing user information in an agile environment).

Khác với tài liệu thác nước (waterfall/monolithic), tài liệu Agile SRS tập trung vào **User Stories, Acceptance Criteria (Gherkin/Given-When-Then), Definition of Done (DoD), Epics, Slices & Iterative Spikes**, đồng thời tích hợp trực quan hóa qua User Journey Flowchart, Interaction Sequence và ASCII Mockup.

---

## 1. Core Extraction & Agile Engineering Rules
1. **Evidence-Based Agile Decomposition (Truy xuất từ Code & Tests):**
   - Không suy diễn story giả tạo. Mọi User Story phải được bóc tách từ:
     - Route handlers & Controller methods -> User Actions & Endpoints.
     - Domain validation, business logic, exceptions -> Acceptance Criteria & Business Rules.
     - Unit/E2E test suites (`*.spec.ts`, `*.test.py`, pytest, jest, junit) -> Test Scenarios theo cú pháp BDD Gherkin (`Given - When - Then`).
     - Data models, migrations, DB tables -> Data Entities & Boundaries.
   - Mỗi Story (`US-[EPIC]-[ID]`) bắt buộc ghi rõ:
     - `Source Code Traceability`: File path và hàm xử lý cụ thể.
     - `Automated Test Traceability`: File test hiện có kiểm thử logic này (nếu có).
2. **Context Window Management (Chống tràn token):**
   - Đọc sơ đồ module từ `.are/summary.md` hoặc `are-manifest.json` trước.
   - Thực hiện ghi file dạng phân đoạn (Phased Append) vào `docs/AGILE_SRS.md`:
     - Giai đoạn 1: Mục 1 -> Mục 4 (Vision, Personas, Architecture, User Story Map).
     - Giai đoạn 2: Lần lượt từng Epic trong Mục 5 (User Stories, Mockups, Sequence Diagrams, Acceptance Criteria).
     - Giai đoạn 3: Mục 6 -> Mục 8 (Data Models, NFRs as Technical Stories, Agile DoD).
3. **Mermaid & Wireframe Syntax Safety:**
   - Mã Mermaid (`userJourney`, `flowchart TD`, `sequenceDiagram`, `erDiagram`) không chứa ký tự ngoặc kép trần hoặc ký tự đặc biệt làm gãy parser.
   - Mockup giao diện sử dụng chuẩn Box-Drawing cố định 74–76 ký tự chiều ngang.
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
   - **Áp dụng cho Agile SRS:** User Story giữ khuôn "Với tư cách là `<vai trò>`, tôi muốn `<năng lực>` để `<giá trị>`" (khuôn bắt buộc của kỹ thuật này); mọi phần còn lại (Acceptance Criteria, DoD, mô tả Epic, Spike) viết ở thể khách quan. Gherkin dùng câu khẳng định, không dùng lời thoại.

   **Bảng chuẩn hóa thuật ngữ bắt buộc:**

   | Thay vì | Dùng |
   |---|---|
   | Người dùng, user | Tác nhân (Actor) hoặc vai trò trong User Story |
   | Tiêu chí hoàn thành | Tiêu chuẩn nghiệm thu (Acceptance Criteria) |
   | Trigger | Điểm kích hoạt |
   | Pain point | Trở ngại quy trình |
   | Mô tả kể chuyện, giọng kể | Câu khẳng định khách quan trong Given – When – Then |

---

## 2. Agile Mockup Reference System (ASCII Wireframes)

Mỗi User Story có tương tác người dùng (Web/Mobile/Dashboard/CLI) bắt buộc phải tích hợp Wireframe ASCII tương ứng:

### Pattern A: User Action & Guided Form (Story tạo mới, gửi lệnh, wizard)
```text
┌────────────────────────────────────────────────────────────────────────┐
│  STORY: [US-KEY] - [USER STORY ACTION TITLE]               [Cancel] [X]│
├────────────────────────────────────────────────────────────────────────┤
│  EPIC CONTEXT: [Epic Name] | STEP: [Current Step Name]                 │
│  Progress: [●] Step 1 ─── [●] Step 2 ─── [○] Step 3 ─── [○] Complete   │
├────────────────────────────────────────────────────────────────────────┤
│  USER INPUT FORM / WORKFLOW:                                           │
│                                                                        │
│  * [Primary Field Label]           * [Secondary Field Label]           │
│  ┌──────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │ [Target Input / Value]       │  │ [Validated Value / Code]        │ │
│  └──────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                        │
│  * [Selection / Decision Dropdown]  * [Option Radio Select]            │
│  ┌──────────────────────────────┐  (•) [Selected Option Rule]          │
│  │ [ Selection Value        ▼ ] │  ( ) [Alternative Option]            │
│  └──────────────────────────────┘                                      │
│                                                                        │
│  [!] Business Validation Notice: [Precondition or rule feedback]       │
├────────────────────────────────────────────────────────────────────────┤
│  [ < Previous ]                [ Save Draft ]            [ Confirm > ] │
└────────────────────────────────────────────────────────────────────────┘
```

### Pattern B: Agile Monitoring Board / Metrics Spike (Màn hình KPI, trạng thái)
```text
┌────────────────────────────────────────────────────────────────────────┐
│  STORY: [US-KEY] - [LIVE DASHBOARD / TELEMETRY]   [Status: Active ●]   │
│  Scope Filter: [ Current Sprint ▼ ]                 Sync: 14:42:10     │
├────────────────────────────────────────────────────────────────────────┤
│  SPRINT KPI SUMMARY CARDS                                              │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│  │ [METRIC A: VOLUME]│  │ [METRIC B: OPS/S] │  │ [METRIC C: ERROR] │   │
│  │ 1,428.50 B VND    │  │ 1,240 req/s       │  │ 0.02% (Healthy)   │   │
│  │ ▲ +12.4% vs T-1   │  │ ▲ Peak Capacity   │  │ ▼ -0.01% Error    │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│  REAL-TIME FLOW STATUS                                                 │
│  Throughput                                                            │
│   400 ┤        ┌──┐                                                    │
│   200 ┤  ┌──┐  │  │        ┌──┐                                        │
│   100 ┼──┴──┴──┴──┴──┴──┴──┴──┴────────────────────────────────         │
│       [T0]  [T1]  [T2]  [T3] (Time Interval)                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Pattern C: Interactive Item Management & Audit Backlog (Danh sách, bảng dữ liệu)
```text
┌────────────────────────────────────────────────────────────────────────┐
│  STORY: [US-KEY] - [DATA LIST & FILTER AUDIT]                          │
├────────────────────────────────────────────────────────────────────────┤
│  FILTER BAR:                                                           │
│  Search: [ Keyword / Reference ID... ]  State: [ All Statuses      ▼ ] │
│  Period: [ YYYY-MM-DD ] to [ YYYY-MM-DD ]     [ Apply ]  [ Clear ]     │
├────────────────────────────────────────────────────────────────────────┤
│  Items: 2 selected                   [ Quick Action A ] [ Action B ]   │
│  ┌───┬──────────┬──────────────┬─────────┬──────────┬────────┬───────┐ │
│  │[X]│ Entity ID│ Key Field    │ Amount  │ State    │ Time   │ Op    │ │
│  ├───┼──────────┼──────────────┼─────────┼──────────┼────────┼───────┤ │
│  │[X]│ #ENT-101 │ Alpha Record │ 10,000  │ DONE     │ 14:20  │ [...] │ │
│  │[X]│ #ENT-102 │ Beta Record  │ 5,000   │ ACTIVE   │ 14:15  │ [...] │ │
│  │[ ]│ #ENT-103 │ Gamma Record │ 50,000  │ BLOCKED  │ 13:58  │ [!]   │ │
│  └───┴──────────┴──────────────┴─────────┴──────────┴────────┴───────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  Showing 1 - 3 of 84 items             [|<] [<] [1] 2 3 [>] [>|]       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Agile SRS Outline (ISO/IEC/IEEE 26515:2018)

Tài liệu xuất ra tại `docs/AGILE_SRS.md` phải bám sát cấu trúc 8 phần sau:

```text
1. PRODUCT VISION & PURPOSE (ISO/IEC/IEEE 26515 Clause 5)
1.1 Product Vision Statement: Tuyên ngôn tầm nhìn (For [target persona], Who [need/opportunity], The [Product] Is a [category] That [key benefit], Unlike [alternative], Our product [key differentiator]).
1.2 Scope & Boundaries: Ranh giới sản phẩm (In-Scope Epics vs Out-of-Scope Spikes).
1.3 Technical Assumptions & Dependencies: Ràng buộc môi trường, third-party libraries, services nền tảng.
1.4 Domain Glossary: Thuật ngữ Ubiquitous Language trích xuất từ domain models/services.

2. AGILE USER PERSONAS & ROLE MATRIX
2.1 User Personas: Danh sách persona (Primary Goal, Pain Points, Technical Level) đối chiếu từ RBAC và permissions.
2.2 Role & Permission Matrix: Bảng phân quyền Role theo Persona, route middleware và token claims.

3. HIGH-LEVEL ARCHITECTURE & COMPONENT TOPOLOGY
3.1 Architecture Overview (mermaid graph TD): Phân tầng Presentation -> API/Gateway -> Domain Services -> Storage/Cache -> External Systems.
3.2 Context & Integration Map: Bảng cổng tích hợp ngoại vi (Third-party APIs, webhooks, brokers).

4. USER STORY MAP & EPIC BREAKDOWN
4.1 User Story Map (mermaid journey hoặc flowchart LR): Lược đồ hành trình tổng thể của người dùng qua các giai đoạn (Discover -> Configure -> Execute -> Verify).
4.2 Epic Hierarchy Matrix: Bảng phân rã (Epic ID, Epic Name, Core Goal, Primary Persona, Mapped Modules).

5. DETAILED EPICS & USER STORIES (SPECIFICATION BY EXAMPLE) (Trọng tâm)
Với MỖI Epic, trình bày chi tiết các User Stories theo cấu trúc chuẩn:
- Epic Header: [EPIC-ID] - [Epic Title] & Business Goal.
- Chi tiết từng Story:
  * Story ID & Title: US-[EPIC]-[ID] - [Action Verb]
  * User Story Formula:
    "As a [Persona / Role],
     I want to [Perform Action / Capability],
     So that [Business Value / Benefit]."
  * Code & Test Traceability:
    - Implementation: Controller path, Service method, Entity model.
    - Automated Tests: Unit/E2E test files liên quan (nếu có).
  * UI Interaction Wireframe: ASCII Mockup (chọn Pattern A, B hoặc C).
  * Business Logic & Decision Flowchart: `mermaid flowchart TD` (rẽ nhánh điều kiện if/else, permissions, transactions).
  * Runtime Call-Stack Sequence Diagram: `mermaid sequenceDiagram` (Actor -> Controller -> Service -> Repo -> DB/Queue).
  * Acceptance Criteria (BDD / Gherkin format):
    Scenario 1: Happy Path
      Given [Precondition & initial state]
      When [Action triggered by user / API]
      Then [Expected system state & response]
    Scenario 2: Validation Failure / Edge Case
      Given [Invalid state / missing parameters]
      When [Action executed]
      Then [Error code, exception & rollback action]

6. LIVING DATA REQUIREMENTS & ENTITY SCHEMA
6.1 Entity-Relationship Diagram (mermaid erDiagram): Bóc tách từ ORM models/migrations (PK, FK, 1-1, 1-n, n-n).
6.2 Data Contracts & Schema Dictionary: Bảng thuộc tính, validation constraints, index.

7. NON-FUNCTIONAL REQUIREMENTS (NFRs) AS TECHNICAL STORIES
7.1 Security & Compliance: Mã hóa, JWT/Auth, CORS, Rate-limit, Audit Logging.
7.2 Performance & Scalability: Throughput, latency target, connection pools, cache strategies.
7.3 Resilience & Reliability: Circuit breaker, retry policy, health check, transactions.

8. DEFINITION OF READY (DoR) & DEFINITION OF DONE (DoD)
8.1 Definition of Ready (DoR): Tiêu chí câu chuyện đã đủ điều kiện triển khai (Story clear, AC BDD defined, Mockup ready, Contract specified).
8.2 Definition of Done (DoD): Tiêu chí hoàn thành (Code merged, Unit tests pass, API docs updated, Linters & Mermaid verified).
```

---

## 4. Execution Workflow for Claude Agent
1. **Quét & Lập bản đồ:** Kiểm tra `.are/`. Nếu chưa có, chạy `are scan --depth 3 --output .are/`. Đọc `.are/summary.md`.
2. **Khai thác BDD từ Tests & Code:**
   - Đọc các file test (`*.spec.*`, `*.test.*`) để thu thập các assertions thực tế, chuyển hóa thành Scenarios Gherkin.
   - Đọc Controllers & Services để xác định User Actions, Exceptions và Business Rules.
3. **Biên tập phân tầng & Nối tiếp file (Phased Append):**
   - **Phase 1:** Viết Mục 1 đến Mục 4 (Vision, Personas, Architecture, Story Map) -> Khởi tạo `docs/AGILE_SRS.md`.
   - **Phase 2:** Nối tiếp lần lượt từng Epic trong Mục 5 (gồm Story, Traceability, ASCII Mockup, Flowchart, Sequence Diagram, BDD Acceptance Criteria).
   - **Phase 3:** Nối tiếp Mục 6, 7 và 8 (Data Models, NFR Technical Stories, DoR/DoD).
4. **Kiểm thử cú pháp tự động (Automated Verification):**
   - Chạy script kiểm tra: `node scripts/validate-mermaid.mjs docs/AGILE_SRS.md` (hoặc `python scripts/validate_mermaid.py docs/AGILE_SRS.md`).
   - Sửa toàn bộ lỗi parser nếu có cho đến khi pass 100%.