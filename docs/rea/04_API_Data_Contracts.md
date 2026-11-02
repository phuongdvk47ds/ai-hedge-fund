# 04. API DATA CONTRACTS - AI HEDGE FUND (aihf)

| Thuộc tính | Giá trị |
|---|---|
| Phạm vi | Toàn bộ định nghĩa Pydantic, dataclass, NamedTuple và Protocol dùng để kiểm tra dữ liệu vào và ra của hệ thống |
| Phương pháp | Quét cú pháp (`ast`) mọi tệp mã nguồn không phải kiểm thử trong `hedge_fund/`, đối chiếu với mã sử dụng |
| Ngày | 2026-11-02 |
| Nhãn | `[OK]` có trong mã; `[UNKNOWN]` không có bằng chứng; `[OPEN]` câu hỏi mở |

## 1. Phát hiện chính

| ID | Phát hiện |
|---|---|
| K-01 | Hệ thống không có API HTTP. "Request" và "response" được hiểu là bốn loại biên dữ liệu: (1) cấu hình đầu vào (YAML mandate, tham số CLI), (2) phản hồi từ provider dữ liệu, (3) trao đổi với LLM, (4) đầu ra JSON của CLI và tệp trạng thái |
| K-02 | Kho có 50 định nghĩa hợp đồng: 41 mô hình Pydantic `BaseModel`, 4 dataclass bất biến, 1 `NamedTuple`, 4 `Protocol` |
| K-03 | Chính sách kiểm tra phân đôi theo hướng dữ liệu: cấu hình do tác nhân cung cấp dùng `extra="forbid"` (nghiêm ngặt); phản hồi của provider dùng `extra="ignore"` (khoan dung) |
| K-04 | Hợp đồng đầu ra LLM không phải mô hình Pydantic; kiểm tra bằng mã (`LLMAgent._parse`) |
| K-05 | Hai mô hình không có nơi sử dụng: `QuantSignals` (`models.py`) và `Filing` (`data/models.py`, được xuất nhưng không có phương thức máy khách trả về) |
| K-06 | Mọi bản ghi đầu ra bền vững đều mang `schema_version = 2` (`Literal[2]`) |

## 2. Chính sách kiểm tra và tuần tự hóa

| Chính sách | Áp dụng cho | Hành vi | Bằng chứng |
|---|---|---|---|
| `extra="forbid"` | `FundSpec`, `StrategySpec`, `ModelSpec`, `BlendPolicy`, `TradingWindow`, `RiskLimits`, `TradingCosts`, `DeployedFund` | Khóa lạ bị từ chối | `fund/spec.py`, `risk/limits.py`, `brokers/costs.py`, `paper/deployed.py` |
| `extra="ignore"` | 10 mô hình trong `data/models.py` | Trường lạ từ provider bị bỏ qua | `data/models.py` |
| Mặc định Pydantic | Mọi mô hình còn lại | Trường lạ bị bỏ qua (mặc định `ignore`) | |
| `Literal[2]` cho `schema_version` | `FundSpec`, `DeployedFund`, `SessionRecord`, `DecisionRecord`, `CycleRecord`, `FundBacktestResult` | Bản ghi phiên bản khác bị từ chối khi nạp | |
| `model_serializer(wrap)` | `Signal`, `Order`, `RiskLimits`, `FundSpec` | Loại trường tùy chọn rỗng khỏi JSON để hash bản ghi cũ còn hợp lệ | `models.py`, `brokers/models.py`, `risk/limits.py`, `fund/spec.py` |
| `field_validator`, `model_validator` | `TradingWindow`, `ModelSpec`, `FundSpec` | Kiểm tra chéo trường (xem Mục 3.1) | `fund/spec.py` |
| Phép tính hash | `SessionRecord` | SHA-256 của JSON loại trừ `hash`; loại trừ `snapshot_times` khi null | `pipeline/session.py` |

## 3. Hợp đồng đầu vào: cấu hình do tác nhân cung cấp

### 3.1 Mandate (`FundSpec`) - tệp YAML

| Hợp đồng | Trường | Kiểu | Bắt buộc | Ràng buộc | Mặc định |
|---|---|---|---|---|---|
| `FundSpec` (`fund/spec.py`) | `schema_version` | `Literal[2]` | Có | Thiếu thì `load_spec` từ chối với thông báo "older format" | - |
| | `name` | `str` | Có | Là tên tệp `<name>.yaml` | - |
| | `strategies` | `list[StrategySpec]` | Có | `min_length=1`; tên duy nhất | - |
| | `risk` | `RiskLimits` | Có | | - |
| | `costs` | `TradingCosts` | Không | Không tuần tự hóa khi bằng mặc định | `TradingCosts()` |
| | `capital` | `float` | Không | `> 0` | 100000.0 |
| | `rebalance` | `Cadence` | Không | `minute`, `daily`, `weekly`, `monthly` | `weekly` |
| | `interval` | `float` | Không | `> 0`; chỉ với `minute`; tối thiểu 1 giây; không dài hơn cửa sổ | 1.0 |
| | `window` | `TradingWindow` | Không | Chỉ với `minute` | `09:30`-`16:00` |
| | `benchmark` | `str` | Không | Chuyển chữ hoa | `SPY` |
| `StrategySpec` | `name` | `str` | Có | | - |
| | `display_name` | `str \| None` | Không | | `None` |
| | `weight` | `float` | Không | `> 0` | 1.0 |
| | `models` | `list[ModelSpec]` | Có | `min_length=1` | - |
| | `blend` | `BlendPolicy` | Có | | - |
| `ModelSpec` | `name` | `str` | Có | Phải khai báo `investment_approach` và `horizon_days` trên lớp đăng ký | - |
| | `weight` | `float` | Không | `> 0` | 1.0 |
| | `params` | `dict[str, Any]` | Không | Tham số khởi tạo analyst | `{}` |
| `BlendPolicy` | `method` | `Literal["conviction_weighted"]` | Không | | `conviction_weighted` |
| | `gross_target` | `float` | Không | `> 0` | 1.0 |
| | `mode` | `PortfolioMode` | Có | `long_only`, `long_short`, `dollar_neutral` | - |
| `TradingWindow` | `start` | `str` | Không | `HH:MM`; trong `04:00`-`20:00` ET | `09:30` |
| | `end` | `str` | Không | Như `start`; `start < end` | `16:00` |
| `RiskLimits` (`risk/limits.py`) | `max_position_pct` | `float` | Có | `0 < x <= 1` | - |
| | `max_gross_exposure` | `float` | Có | `> 0` | - |
| | `max_net_exposure` | `float \| None` | Không | `> 0` | `None` |
| | `max_drawdown_pct` | `float \| None` | Không | `0 < x < 1` | `None` |
| | `max_adv_pct` | `float \| None` | Không | `0 < x <= 1` | `None` |
| `TradingCosts` (`brokers/costs.py`) | `spread_bps` | `float` | Không | `>= 0` | 5.0 |
| | `commission_per_share` | `float` | Không | `>= 0` | 0.005 |
| | `impact_coefficient` | `float` | Không | `>= 0` | 1.0 |
| | `min_trade_pct` | `float` | Không | `0 <= x < 1` | 0.005 |

Quy tắc chéo trường của `FundSpec`: `interval` và `window` chỉ hợp lệ khi `rebalance = minute`; `interval` tối thiểu 1 giây (`MIN_INTERVAL_SECONDS`) và không vượt thời lượng cửa sổ; tên strategy không trùng; `benchmark` chuyển chữ hoa.

### 3.2 Quỹ đã triển khai (`DeployedFund`) - `fund.yaml`

| Trường | Kiểu | Bắt buộc | Ràng buộc | Mặc định |
|---|---|---|---|---|
| `schema_version` | `Literal[2]` | Không | | 2 |
| `name` | `str` | Có | Khớp regex `[A-Za-z0-9][A-Za-z0-9._-]*` (kiểm tra ở `validate_fund_name`, không ở mô hình) | - |
| `spec` | `FundSpec` | Có | Bản chụp mandate | - |
| `universe` | `list[str]` | Có | Đã chuẩn hóa | - |
| `broker` | `Literal["paper"]` | Không | | `paper` |
| `created` | `str` | Có | `YYYY-MM-DD` | - |

### 3.3 Tham số CLI

Tham số CLI được `argparse` kiểm tra, không có mô hình Pydantic riêng.

| Lệnh | Tham số | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|---|
| `aihf` (toàn cục) | `--model` | `str` | Không | Ghi vào `HEDGE_FUND_LLM_MODEL` |
| `aihf backtest` | `mandate` | đường dẫn | Có | `load_spec` |
| | `--universe` | `str` | Có | Phân tách bằng dấu phẩy hoặc khoảng trắng; `normalize_universe` |
| | `--start`, `--end` | `str` | Không | `YYYY-MM-DD` (không kiểm tra định dạng ở argparse) |
| | `--out` | đường dẫn | Không | |
| `aihf paper create` | `name`, `--mandate`, `--universe` | `str` | Có | `validate_fund_name`, `load_spec`, `normalize_universe` |
| `aihf paper tick` | `name`, `--session`, `--again` | `str`, `str`, cờ | `name` có | `--session` phải là phiên kế tiếp chưa ghi |
| `aihf paper halt` | `name`, `--reason` | `str` | Có | |
| `aihf paper run/stop/status/scorecard/resume` | `name` | `str` | Có | Quỹ phải tồn tại |

## 4. Hợp đồng phản hồi của provider dữ liệu (`data/models.py`, `extra="ignore"`)

| Hợp đồng | Điểm cuối | Trường định danh và bắt buộc | Nhóm trường tùy chọn (`None` được phép) |
|---|---|---|---|
| `Price` | `/prices/` | `open`, `close`, `high`, `low` (`float`), `volume` (`int`), `time` (`str`) | Không có |
| `PriceSnapshot` | `/prices/snapshot/` | `ticker`, `price` (`float`), `time` | `day_change`, `day_change_percent` |
| `FinancialMetrics` | `/financial-metrics/` | `ticker`, `report_period`, `period` | `currency`, `filing_date`, `filing_datetime`; định giá (9 trường); biên lợi nhuận và sinh lời (6); hiệu quả (6); thanh khoản (4); đòn bẩy (3); tăng trưởng (7); trên cổ phiếu và chi trả (4) |
| `InsiderTrade` | `/insider-trades/` | `ticker`, `name`, `filing_date`, `is_board_director` (mặc định `False`) | `issuer`, `title`, `transaction_*`, `shares_owned_*`, `security_title` |
| `CompanyNews` | `/news/` | `ticker`, `title`, `source` | `date`, `url` |
| `CompanyFacts` | `/company/facts/` | `ticker`, `is_active` (mặc định `True`) | `name`, `cik`, `sector`, `industry`, `category`, `exchange`, `location`, `sec_filings_url`, `sic_*` |
| `EarningsData` | Lồng trong `Earnings`, `EarningsRecord` | Không có | 27 trường: doanh thu và EPS kèm ước tính và `*_surprise` (`BEAT`, `MISS`, `MEET`), lãi lỗ, bảng cân đối, dòng tiền, biến động `*_chg` |
| `Earnings` | `/earnings/` (`limit=1`) | `ticker`, `report_period` | `fiscal_period`, `currency`, `quarterly`, `annual` |
| `EarningsRecord` | `/earnings/` (lịch sử) | `ticker`, `report_period`, `source_type` | `filing_date`, `filing_datetime`, `filing_window`, `fiscal_period`, `currency`, `filing_url`, `accession_number`, `quarterly`, `annual` |
| `Filing` | Chưa có máy khách trả về | Không có trường bắt buộc | 9 trường tùy chọn `[OPEN]` |

Phân nhóm 45 trường `FinancialMetrics`:

| Nhóm | Trường |
|---|---|
| Vốn hóa và định giá | `market_cap`, `enterprise_value`, `price_to_earnings_ratio`, `price_to_book_ratio`, `price_to_sales_ratio`, `enterprise_value_to_ebitda_ratio`, `enterprise_value_to_revenue_ratio`, `free_cash_flow_yield`, `peg_ratio` |
| Biên và sinh lời | `gross_margin`, `operating_margin`, `net_margin`, `return_on_equity`, `return_on_assets`, `return_on_invested_capital` |
| Hiệu quả | `asset_turnover`, `inventory_turnover`, `receivables_turnover`, `days_sales_outstanding`, `operating_cycle`, `working_capital_turnover` |
| Thanh khoản | `current_ratio`, `quick_ratio`, `cash_ratio`, `operating_cash_flow_ratio` |
| Đòn bẩy | `debt_to_equity`, `debt_to_assets`, `interest_coverage` |
| Tăng trưởng | `revenue_growth`, `earnings_growth`, `book_value_growth`, `earnings_per_share_growth`, `free_cash_flow_growth`, `operating_income_growth`, `ebitda_growth` |
| Trên cổ phiếu và chi trả | `payout_ratio`, `earnings_per_share`, `book_value_per_share`, `free_cash_flow_per_share` |

Ràng buộc: các mô hình không có ràng buộc giá trị (không `gt`, `ge`); tính hợp lệ của số liệu (hữu hạn, dương) được kiểm tra ở tầng dùng (`exact_marks`, `session_closes`, `_mark_prices`).

## 5. Hợp đồng trao đổi với LLM

### 5.1 Phản hồi persona (kiểm tra bằng mã, không phải Pydantic)

Kiểm tra bởi `LLMAgent._parse`.

| Trường | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|
| `signal` | `str` | Có | Chữ thường thuộc `bullish`, `neutral`, `bearish` |
| `confidence` | số | Có (mặc định 0 nếu thiếu) | `0 <= x <= 100` |
| `reasoning` | `str` | Không | Mặc định chuỗi rỗng |
| `provider_metadata` | `dict` | Không | Nếu có phải là đối tượng |

JSON được trích bằng `extract_json` (dạng thuần, trong khối mã, hoặc nhúng trong văn bản).

### 5.2 Hợp đồng TypeSafe (Jev) - `llm/contract.py`, phiên bản 1

| Chiều | Cấu trúc |
|---|---|
| Yêu cầu | `{model, state: {investor_prompt, financial_snapshot}, questions: {direction (choice), bullish_strength (score), bearish_strength (score)}}` |
| Phản hồi bắt buộc | `answers.direction` kiểu `choice`; `answers.bullish_strength`, `answers.bearish_strength` kiểu `score` |
| Mỗi câu trả lời | `confidence` trong `[0, 1]`; `probabilities` có đúng các khóa (`bullish`, `bearish`, `neutral` hoặc `0`-`4`), mỗi giá trị trong `[0, 1]`, tổng bằng 1 sai số 0,001; câu `score` có `score` trong `[0, 4]` |
| Chuẩn hóa | `{signal: direction, confidence: 25 × score hoặc 0 nếu neutral, reasoning: chuỗi mẫu}`; phản hồi gốc giữ trong `provider_metadata.jev` |
| Lỗi | `JevContractError` (kế thừa `ValueError`) |

## 6. Hợp đồng miền lõi (trao đổi giữa các tầng, và ghi vào sổ cái)

### 6.1 Quan điểm, lệnh, giới hạn

| Hợp đồng | Trường | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|---|
| `Signal` (`models.py`) | `model_name` | `str` | Có | Khóa vào registry analyst |
| | `ticker`, `date` | `str` | Có | `date` dạng `YYYY-MM-DD` hoặc khóa thanh |
| | `value` | `float` | Có | Trong `[-1, 1]` (kiểm tra ở `blend_signals`) |
| | `reasoning` | `str \| None` | Không | |
| | `components` | `dict[str, float]` | Không | Phân rã định lượng |
| | `metadata` | `dict[str, Any]` | Không | `abstained`, `confidence`, `prompt_key`, `cached`, `snapshot_hash`... |
| | `horizon_days` | `int \| None` | Không | `> 0`; không tuần tự hóa khi null |
| `Position` (`brokers/models.py`) | `ticker`, `shares` | `str`, `int` | Có | `shares` có dấu |
| `Order` | `ticker`, `side`, `quantity`, `price` | `str`, `Literal["buy","sell"]`, `int`, `float` | Có | `quantity > 0` |
| | `adv`, `volatility` | `float \| None` | Không | Không tuần tự hóa khi null |
| `Fill` | `ticker`, `side`, `quantity`, `price` | | Có | |
| `Liquidity` (NamedTuple) | `adv`, `volatility` | `float` | Có | |
| `ClampEvent` (`risk/limits.py`) | `limit` | `Literal` | Có | `max_position_pct`, `max_gross_exposure`, `max_net_exposure`, `max_drawdown_pct`, `max_adv_pct` |
| | `ticker` | `str \| None` | Không | `None` cho giới hạn toàn sổ |
| | `before`, `after` | `float` | Có | |
| `RiskResult` | `weights`, `clamps`, `scale_factor` | `dict`, `list`, `float \| None` | `weights`, `clamps` có | |
| `BlendResult` (`portfolio/construction.py`) | `convictions`, `weights`, `eligible_scores`, `flat_reason` | `dict`, `dict`, `dict`, `Literal \| None` | `convictions`, `weights` có | `flat_reason` thuộc `no_eligible_positions`, `missing_long_side`, `missing_short_side` |

### 6.2 Bản ghi quyết định và thực thi (`pipeline/models.py`)

| Hợp đồng | Trường | Kiểu | Ràng buộc |
|---|---|---|---|
| `TickerSkip` | `ticker`, `reason` | `str` | Mã bị loại khỏi đánh giá |
| `StrategyRecord` | `name` | `str` | |
| | `slice` | `float` | Phần vốn đã chuẩn hóa |
| | `signals` | `list[Signal]` | |
| | `convictions`, `weights` | `dict[str, float]` | |
| | `eligible_scores`, `final_contribution` | `dict[str, float]` | Mặc định `{}` |
| | `flat_reason` | `FlatReason \| None` | |
| `DecisionRecord` | `schema_version` | `Literal[2]` | |
| | `fund`, `as_of` | `str` | |
| | `spec` | `FundSpec` | Bản chụp mandate |
| | `universe` | `list[str]` | |
| | `marks` | `dict[str, float]` | Giá đóng cửa dùng định cỡ |
| | `skipped` | `list[TickerSkip]` | |
| | `strategies` | `list[StrategyRecord]` | |
| | `target_weights`, `final_weights` | `dict[str, float]` | Trước và sau rủi ro |
| | `clamps` | `list[ClampEvent]` | |
| | `risk_scale_factor` | `float \| None` | |
| `CycleRecord` | Các trường của `DecisionRecord` cùng | | |
| | `equity_before`, `cash_before`, `cash`, `nav` | `float` | |
| | `orders`, `fills` | `list[Order]`, `list[Fill]` | |
| | `positions` | `dict[str, int]` | Sau khớp |
| | `original_assessment`, `refreshed_assessment` | `DecisionRecord \| None` | |
| | `execution_as_of` | `str \| None` | |
| | `execution_policy` | `Literal["next_close","next_bar"] \| None` | |
| | Thuộc tính tính toán | `traded_notional`, `slippage`, `spread_cost`, `impact`, `commission`, `trading_cost` | Không lưu |

### 6.3 Trạng thái và bản ghi phiên (`pipeline/session.py`)

| Hợp đồng | Trường | Kiểu | Ràng buộc |
|---|---|---|---|
| `FundState` | `positions` | `dict[str, int]` | Mặc định `{}` |
| | `cash` | `float` | Bắt buộc |
| | `last_session` | `str \| None` | |
| | `pending` | `DecisionRecord \| None` | Quyết định chờ thực thi |
| | `prev_hash` | `str \| None` | |
| | `halted` | `str \| None` | Lý do halt |
| | `peak_nav` | `float \| None` | |
| `SessionRecord` | `schema_version` | `Literal[2]` | |
| | `fund`, `session`, `benchmark` | `str` | |
| | `universe` | `list[str]` | |
| | `nav`, `cash`, `benchmark_close` | `float` | |
| | `positions` | `dict[str, int]` | |
| | `marks` | `dict[str, float]` | |
| | `rebalance` | `bool` | |
| | `executed` | `CycleRecord \| None` | |
| | `decision` | `DecisionRecord \| None` | |
| | `prev_hash` | `str \| None` | |
| | `hash` | `str` | Mặc định rỗng; gán sau `compute_hash` |
| | `code_version`, `mandate_hash` | `str` | |
| | `llm_model` | `str \| None` | |
| | `snapshot_times` | `dict[str, str] \| None` | Bỏ khỏi hash khi null |

## 7. Hợp đồng đầu ra của CLI

| Lệnh | Luồng | Hợp đồng đầu ra | Cấu trúc |
|---|---|---|---|
| `aihf backtest` | stdout | `FundBacktestResult` | Xem dưới |
| `aihf paper tick` | stdout | `SessionRecord` | Mục 6.3 |
| `aihf paper scorecard` | stdout | `Scorecard` | Xem dưới |
| `aihf paper status`, `list` | stdout | Văn bản, không phải JSON | Dòng trạng thái |
| Mọi lệnh | stderr | Văn bản (Rich) | Tóm tắt, bảng, lỗi |

| Hợp đồng | Trường | Kiểu | Ghi chú |
|---|---|---|---|
| `FundBacktestResult` (`backtesting/fund.py`) | `schema_version` | `Literal[2]` | |
| | `fund`, `start`, `end`, `rebalance`, `benchmark` | `str` | `rebalance` có thể là chuỗi mô tả nhịp phát lại của quỹ phút |
| | `universe` | `list[str]` | |
| | `capital` | `float` | |
| | `dates` | `list[str]` | |
| | `nav`, `benchmark_nav` | `list[float]` | Cùng độ dài `dates` |
| | `metrics` | `FundBacktestMetrics` | |
| | `records` | `list[SessionRecord]` | Một bản ghi mỗi phiên |
| | Thuộc tính tính toán | `cycles` | Các `CycleRecord` đã thực thi |
| `FundBacktestMetrics` | `total_return_pct`, `annualized_return_pct`, `sharpe_ratio`, `max_drawdown_pct`, `benchmark_return_pct`, `excess_return_pct` | `float` | Phân số, làm tròn 4 hoặc 6 chữ số, dù tên có hậu tố `_pct` |
| | `n_cycles`, `n_orders` | `int` | |
| | `traded_notional`, `trading_cost` | `float` | Mặc định 0.0 |
| `DailyValuation` | `as_of`, `nav`, `benchmark_nav` | `str`, `float`, `float` | Dùng cho callback bảng theo dõi |
| `ReplaySchedule` | `closes`, `execution_dates` | `dict[str, float]`, `dict[str, str \| None]` | Thuộc tính `assessment_dates`, `warm_dates` |
| `Scorecard` (`scorecard/models.py`) | `fund`, `first_session`, `last_session` | `str` | |
| | `analysts` | `list[AnalystScore]` | |
| | `strategies` | `list[StrategyScore]` | |
| | `fund_pnl`, `trading_cost` | `float` | |
| | `unattributed` | `float` (`computed_field`) | `fund_pnl − Σ P&L strategy` |
| `AnalystScore` | `name` | `str` | |
| | `horizon_days`, `n_views`, `n_directional`, `n_abstained`, `n_pending`, `n_dates` | `int` | |
| | `hit_rate`, `slugging`, `ic_mean`, `ic_std`, `ic_t_stat` | `float \| None` | `None` khi không có gì để đo |
| `StrategyScore` | `name` | `str` | |
| | `n_periods` | `int` | |
| | `pnl`, `return_pct`, `max_drawdown_pct` | `float` | `return_pct` là phân số |
| | `win_rate`, `share_of_pnl` | `float \| None` | |

## 8. Hợp đồng đặc trưng và ngữ cảnh

| Hợp đồng | Loại | Trường | Ghi chú |
|---|---|---|---|
| `PeriodFundamentals` (`features/snapshot.py`) | Pydantic | `report_period`, `filing_date`, 12 chỉ số tùy chọn (`market_cap`, `price_to_earnings_ratio`, `return_on_equity`, `gross_margin`, `operating_margin`, `net_margin`, `debt_to_equity`, `current_ratio`, `revenue_growth`, `earnings_per_share`, `book_value_per_share`, `free_cash_flow_per_share`) | Tập con của `FinancialMetrics` |
| `FundamentalsSnapshot` | Pydantic | `ticker`, `as_of`, `sector`, `industry`, `periods` (mới nhất trước), `roe_avg`, `net_margin_avg`, `gross_margin_trend`, `bvps_cagr`, `debt_to_equity_latest`, `market_cap_latest`, `eps_growth_yoy`, `size_percentile` | Thuộc tính `content_hash` (loại trừ `as_of`); phương thức `render(blind)` |
| `Headline` (`features/intraday.py`) | dataclass bất biến | `when`, `source`, `title` | `when` có múi giờ New York |
| `IntradayContext` | dataclass bất biến | `ticker`, `as_of`, `move_pct`, `market_pct`, `earnings`, `headlines` | `as_of` không bao giờ được hiển thị |
| `Marked` (`pipeline/clock.py`) | dataclass bất biến | `prices`, `times` | `times` là thời điểm in giá, `None` với giá lịch sử |
| `SavedFund` (`fund/storage.py`) | dataclass bất biến | `path`, `spec`, `error` | Mandate hợp lệ có `spec`, mandate lỗi có `error` |
| `QuantSignals` (`models.py`) | Pydantic | `ticker`, `date`, `signals`, `composite_score` | Không có nơi dùng `[OPEN]` |

## 9. Hợp đồng giao thức (Protocol)

| Giao thức | Tệp | Thành viên | Điều kiện hành vi |
|---|---|---|---|
| `DataClient` (`runtime_checkable`) | `data/protocol.py` | `get_prices`, `get_snapshot`, `get_financial_metrics`, `get_news`, `get_insider_trades`, `get_company_facts`, `get_earnings`, `get_earnings_history`, `get_market_cap` | Rỗng hoặc `None` là không có dữ liệu; lỗi hạ tầng phải ném ngoại lệ; chỉ số tài chính point-in-time |
| `Broker` (`runtime_checkable`) | `brokers/protocol.py` | `positions() -> dict[str, Position]`, `cash() -> float`, `place_order(Order) -> Fill` | Khớp trọn lệnh hoặc ném ngoại lệ; không có `equity()` |
| `LLMClient` (`runtime_checkable`) | `llm/client.py` | `model: str`, `complete(system, user) -> str` | Ném ngoại lệ khi lỗi truyền tải; tùy chọn `cache_key(agent, system, user)` |
| `Clock` | `pipeline/clock.py` | `is_complete`, `previous`, `marks -> Marked`, `session_date` | `marks` trả giá hữu hạn, dương cho đúng phiên, nếu không ném ngoại lệ |

## 10. Hợp đồng lỗi

Lỗi không có mô hình Pydantic; là lớp ngoại lệ.

| Lớp | Kế thừa | Trường | Nguồn |
|---|---|---|---|
| `FDClientError` | `Exception` | `status_code: int \| None`, `path: str \| None` | `data/client.py` |
| `LLMCallError` | `RuntimeError` | `diagnostic_record: dict \| None` | `llm/client.py` |
| `LLMParseError` | `ValueError` | | `llm/client.py` |
| `JevContractError` | `ValueError` | | `llm/contract.py` |
| `InsufficientData` | `ValueError` | | `features/snapshot.py` |
| `FundHalted`, `BookMismatch` | `RuntimeError` | | `pipeline/session.py` |
| `NothingDue` | `RuntimeError` | | `paper/tick.py` |
| `LedgerError` | `RuntimeError` | | `paper/ledger.py` |

Định dạng thông báo lỗi cấu hình: `<đường dẫn>: <trường>: <thông điệp>`, các lỗi nối bằng `; ` (`fund/spec.py: _validation_message`).

## 11. Quy tắc tương thích và phiên bản hóa

| ID | Quy tắc | Bằng chứng |
|---|---|---|
| V-01 | `schema_version` là `Literal[2]`; bản ghi hoặc mandate khác phiên bản bị từ chối khi nạp | `fund/spec.py`, `pipeline/session.py` |
| V-02 | Trường mới phải tùy chọn và bị loại khỏi JSON khi rỗng, để hash của bản ghi đã ghi còn khớp | `model_serializer` ở `Signal`, `Order`, `RiskLimits`, `FundSpec` |
| V-03 | Hợp đồng Jev có `JEV_CONTRACT_VERSION = 1`; đổi ngữ nghĩa câu hỏi hoặc ánh xạ phải tăng phiên bản vì phiên bản thuộc khóa cache | `llm/contract.py`, `JevLLM.cache_key` |
| V-04 | Mô hình provider bỏ qua trường lạ nên provider thêm trường không làm hỏng; provider đổi tên hoặc xóa trường bắt buộc (`ticker`, `report_period`, `period`, OHLCV) gây `ValidationError` | `data/models.py` |
| V-05 | Cache dữ liệu lưu `model_dump()` rồi dựng lại bằng `Model(**row)`; trường bắt buộc mới ở mô hình làm hỏng bản ghi cache cũ `[OPEN]` | `data/cached.py` |

## 12. Khoảng trống

| ID | Nội dung | Nhãn |
|---|---|---|
| G-01 | Không có API HTTP, OpenAPI hay phong bì phản hồi chung | `[OK]` |
| G-02 | Mô hình provider không có ràng buộc giá trị; kiểm tra số liệu nằm ở tầng dùng | `[OK]` |
| G-03 | `--start`, `--end` của `aihf backtest` không được kiểm tra định dạng ở argparse; sai định dạng gây `ValueError` của `date.fromisoformat` hoặc lỗi dữ liệu muộn hơn | `[OPEN]` |
| G-04 | Quy tắc tên quỹ nằm ở hàm `validate_fund_name`, không ở trường `DeployedFund.name` | `[OK]` |
| G-05 | `FundBacktestMetrics` đặt tên `*_pct` nhưng lưu phân số, không phải phần trăm | `[OK]` |
| G-06 | `QuantSignals` và `Filing` chưa có nơi dùng | `[OPEN]` |
| G-07 | Phản hồi LLM không có lược đồ hình thức (JSON Schema) | `[OK]` |
