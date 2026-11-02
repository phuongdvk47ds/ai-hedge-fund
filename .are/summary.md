# ARE Summary - ai-hedge-fund (aihf 2.6.4)

Nguồn: `npx agents-reverse-engineer@1.2.21 discover` (138 tệp được nhận diện, 35 tệp loại trừ) kết hợp duyệt trực tiếp mã nguồn.
Ghi chú công cụ: ARE 1.2.21 không có lệnh `scan`; lệnh `discover` sinh `GENERATION-PLAN.md` (đã lưu cùng thư mục). Tệp này là bản hợp nhất thủ công.

| Module | Vai trò | Tệp chính |
|---|---|---|
| hedge_fund/run.py | Entry point CLI (`aihf`), argparse, điều phối backtest / paper | run.py |
| hedge_fund/tui | Giao diện Textual: Home, Paper, Backtest, Builder, Funds, Report, Scorecard | app.py, home.py, paper.py, backtest.py, builder.py, funds.py, report.py, keys.py |
| hedge_fund/fund | Mandate (FundSpec), StrategySpec, Fund, lưu/đọc YAML | spec.py, storage.py, example.yaml |
| hedge_fund/strategies | Thư viện strategy YAML | deep-value, earnings-drift, fundamental-ls, inflections |
| hedge_fund/signals | AlphaModel: 5 LLM persona + PEAD | llm_agent.py, pead.py, buffett/graham/lynch/munger/druckenmiller.py |
| hedge_fund/llm | LLMClient protocol, make_llm, registry, prompt cache, Jev adapter | client.py, registry.py, cache.py, contract.py, api_models.json |
| hedge_fund/features | Snapshot cơ bản point-in-time, intraday context, breakpoints | snapshot.py, intraday.py, breakpoints.py |
| hedge_fund/data | DataClient protocol, FDClient (Financial Datasets), CachedDataClient, lưới phiên | client.py, cached.py, protocol.py, models.py, bars.py, sessions.py |
| hedge_fund/pipeline | `advance`, assess/execute, clock, order builder, record models | session.py, stages.py, clock.py, execution.py, models.py |
| hedge_fund/portfolio | Pha trộn tín hiệu, kiểm tra mục tiêu | construction.py, validation.py |
| hedge_fund/risk | Giới hạn rủi ro cứng | limits.py |
| hedge_fund/brokers | Broker protocol, SimBroker, PaperBroker, mô hình chi phí | protocol.py, sim.py, paper.py, costs.py, models.py |
| hedge_fund/paper | Deployed fund, ledger băm chuỗi, tick, runner | deployed.py, ledger.py, tick.py, runner.py |
| hedge_fund/backtesting | Vòng lặp `advance` trên lịch sử, lưu kết quả | fund.py, research.py |
| hedge_fund/scorecard | Chấm điểm analyst, quy kết P&L strategy | analysts.py, strategies.py, models.py |
| hedge_fund/validation | CPCV / PBO (khung rỗng, chỉ có docstring) | __init__.py |
| hedge_fund/paths.py | Vị trí dữ liệu người dùng `~/.hedge-fund/` | paths.py |

Dịch vụ ngoại vi: Financial Datasets API; Anthropic, OpenAI, DeepSeek, Google, xAI, Kimi (Moonshot), TypeSafe (Jev).
Không có: cơ sở dữ liệu quan hệ, ORM, migration, HTTP server, RBAC, message queue.
