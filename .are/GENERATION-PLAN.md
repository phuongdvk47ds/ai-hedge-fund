# Documentation Generation Plan

Generated: 2026-11-02
Project: /home/user/ai-hedge-fund

## Summary

- **Total Tasks**: 157
- **File Tasks**: 138
- **Directory Tasks**: 19
- **Traversal**: Post-order (children before parents)

---

## Phase 1: File Analysis (Post-Order Traversal)

### Depth 3: hedge_fund/pipeline/fixtures/ (1 files)
- [ ] `hedge_fund/pipeline/fixtures/record_before_intraday.json`

### Depth 2: .github/ISSUE_TEMPLATE/ (2 files)
- [ ] `.github/ISSUE_TEMPLATE/bug_report.md`
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md`

### Depth 2: hedge_fund/backtesting/ (5 files)
- [ ] `hedge_fund/backtesting/__init__.py`
- [ ] `hedge_fund/backtesting/fund.py`
- [ ] `hedge_fund/backtesting/research.py`
- [ ] `hedge_fund/backtesting/test_fund.py`
- [ ] `hedge_fund/backtesting/test_research.py`

### Depth 2: hedge_fund/brokers/ (10 files)
- [ ] `hedge_fund/brokers/__init__.py`
- [ ] `hedge_fund/brokers/costs.py`
- [ ] `hedge_fund/brokers/models.py`
- [ ] `hedge_fund/brokers/paper.py`
- [ ] `hedge_fund/brokers/protocol.py`
- [ ] `hedge_fund/brokers/sim.py`
- [ ] `hedge_fund/brokers/test_costs.py`
- [ ] `hedge_fund/brokers/test_models.py`
- [ ] `hedge_fund/brokers/test_paper.py`
- [ ] `hedge_fund/brokers/test_sim.py`

### Depth 2: hedge_fund/data/ (11 files)
- [ ] `hedge_fund/data/__init__.py`
- [ ] `hedge_fund/data/bars.py`
- [ ] `hedge_fund/data/cached.py`
- [ ] `hedge_fund/data/client.py`
- [ ] `hedge_fund/data/models.py`
- [ ] `hedge_fund/data/protocol.py`
- [ ] `hedge_fund/data/sessions.py`
- [ ] `hedge_fund/data/test_bars.py`
- [ ] `hedge_fund/data/test_cached.py`
- [ ] `hedge_fund/data/test_client.py`
- [ ] `hedge_fund/data/test_client_contract.py`

### Depth 2: hedge_fund/features/ (7 files)
- [ ] `hedge_fund/features/__init__.py`
- [ ] `hedge_fund/features/breakpoints.py`
- [ ] `hedge_fund/features/intraday.py`
- [ ] `hedge_fund/features/snapshot.py`
- [ ] `hedge_fund/features/test_breakpoints.py`
- [ ] `hedge_fund/features/test_intraday.py`
- [ ] `hedge_fund/features/test_snapshot.py`

### Depth 2: hedge_fund/fund/ (6 files)
- [ ] `hedge_fund/fund/__init__.py`
- [ ] `hedge_fund/fund/example.yaml`
- [ ] `hedge_fund/fund/spec.py`
- [ ] `hedge_fund/fund/storage.py`
- [ ] `hedge_fund/fund/test_spec.py`
- [ ] `hedge_fund/fund/test_strategy_library.py`

### Depth 2: hedge_fund/llm/ (10 files)
- [ ] `hedge_fund/llm/__init__.py`
- [ ] `hedge_fund/llm/api_models.json`
- [ ] `hedge_fund/llm/cache.py`
- [ ] `hedge_fund/llm/client.py`
- [ ] `hedge_fund/llm/contract.py`
- [ ] `hedge_fund/llm/registry.py`
- [ ] `hedge_fund/llm/test_client.py`
- [ ] `hedge_fund/llm/test_contract.py`
- [ ] `hedge_fund/llm/test_watch.py`
- [ ] `hedge_fund/llm/watch.py`

### Depth 2: hedge_fund/paper/ (8 files)
- [ ] `hedge_fund/paper/__init__.py`
- [ ] `hedge_fund/paper/deployed.py`
- [ ] `hedge_fund/paper/ledger.py`
- [ ] `hedge_fund/paper/runner.py`
- [ ] `hedge_fund/paper/test_ledger.py`
- [ ] `hedge_fund/paper/test_runner.py`
- [ ] `hedge_fund/paper/test_tick.py`
- [ ] `hedge_fund/paper/tick.py`

### Depth 2: hedge_fund/pipeline/ (11 files)
- [ ] `hedge_fund/pipeline/__init__.py`
- [ ] `hedge_fund/pipeline/clock.py`
- [ ] `hedge_fund/pipeline/execution.py`
- [ ] `hedge_fund/pipeline/models.py`
- [ ] `hedge_fund/pipeline/session.py`
- [ ] `hedge_fund/pipeline/stages.py`
- [ ] `hedge_fund/pipeline/test_clock.py`
- [ ] `hedge_fund/pipeline/test_execution.py`
- [ ] `hedge_fund/pipeline/test_session.py`
- [ ] `hedge_fund/pipeline/test_stages.py`
- [ ] `hedge_fund/pipeline/test_timing.py`

### Depth 2: hedge_fund/portfolio/ (4 files)
- [ ] `hedge_fund/portfolio/__init__.py`
- [ ] `hedge_fund/portfolio/construction.py`
- [ ] `hedge_fund/portfolio/test_construction.py`
- [ ] `hedge_fund/portfolio/validation.py`

### Depth 2: hedge_fund/scorecard/ (5 files)
- [ ] `hedge_fund/scorecard/__init__.py`
- [ ] `hedge_fund/scorecard/analysts.py`
- [ ] `hedge_fund/scorecard/models.py`
- [ ] `hedge_fund/scorecard/strategies.py`
- [ ] `hedge_fund/scorecard/test_scorecard.py`

### Depth 2: hedge_fund/signals/ (11 files)
- [ ] `hedge_fund/signals/__init__.py`
- [ ] `hedge_fund/signals/base.py`
- [ ] `hedge_fund/signals/buffett.py`
- [ ] `hedge_fund/signals/druckenmiller.py`
- [ ] `hedge_fund/signals/graham.py`
- [ ] `hedge_fund/signals/llm_agent.py`
- [ ] `hedge_fund/signals/lynch.py`
- [ ] `hedge_fund/signals/munger.py`
- [ ] `hedge_fund/signals/pead.py`
- [ ] `hedge_fund/signals/test_llm_agents.py`
- [ ] `hedge_fund/signals/test_signals.py`

### Depth 2: hedge_fund/risk/ (3 files)
- [ ] `hedge_fund/risk/__init__.py`
- [ ] `hedge_fund/risk/limits.py`
- [ ] `hedge_fund/risk/test_limits.py`

### Depth 2: hedge_fund/strategies/ (4 files)
- [ ] `hedge_fund/strategies/deep-value.yaml`
- [ ] `hedge_fund/strategies/earnings-drift.yaml`
- [ ] `hedge_fund/strategies/fundamental-ls.yaml`
- [ ] `hedge_fund/strategies/inflections.yaml`

### Depth 2: hedge_fund/tui/ (26 files)
- [ ] `hedge_fund/tui/__init__.py`
- [ ] `hedge_fund/tui/__main__.py`
- [ ] `hedge_fund/tui/app.py`
- [ ] `hedge_fund/tui/app.tcss`
- [ ] `hedge_fund/tui/backtest.py`
- [ ] `hedge_fund/tui/builder.py`
- [ ] `hedge_fund/tui/conftest.py`
- [ ] `hedge_fund/tui/fixtures.py`
- [ ] `hedge_fund/tui/funds.py`
- [ ] `hedge_fund/tui/home.py`
- [ ] `hedge_fund/tui/keys.py`
- [ ] `hedge_fund/tui/palette.py`
- [ ] `hedge_fund/tui/paper.py`
- [ ] `hedge_fund/tui/paper_view.py`
- [ ] `hedge_fund/tui/report.py`
- [ ] `hedge_fund/tui/scorecard_view.py`
- [ ] `hedge_fund/tui/shared.py`
- [ ] `hedge_fund/tui/test_backtest.py`
- [ ] `hedge_fund/tui/test_builder.py`
- [ ] `hedge_fund/tui/test_funds.py`
- [ ] `hedge_fund/tui/test_home.py`
- [ ] `hedge_fund/tui/test_paper.py`
- [ ] `hedge_fund/tui/test_paper_view.py`
- [ ] `hedge_fund/tui/test_report.py`
- [ ] `hedge_fund/tui/test_scorecard_view.py`
- [ ] `hedge_fund/tui/widgets.py`

### Depth 2: hedge_fund/validation/ (1 files)
- [ ] `hedge_fund/validation/__init__.py`

### Depth 1: hedge_fund/ (7 files)
- [ ] `hedge_fund/README.md`
- [ ] `hedge_fund/__init__.py`
- [ ] `hedge_fund/conftest.py`
- [ ] `hedge_fund/models.py`
- [ ] `hedge_fund/paths.py`
- [ ] `hedge_fund/run.py`
- [ ] `hedge_fund/test_run.py`

### Depth 0: ./ (6 files)
- [ ] `LICENSE`
- [ ] `Makefile`
- [ ] `README.md`
- [ ] `ROADMAP.md`
- [ ] `VISION.md`
- [ ] `pyproject.toml`

---

## Phase 2: Directory AGENTS.md (Post-Order Traversal, 19 directories)

### Depth 3
- [ ] `hedge_fund/pipeline/fixtures/AGENTS.md`

### Depth 2
- [ ] `.github/ISSUE_TEMPLATE/AGENTS.md`
- [ ] `hedge_fund/backtesting/AGENTS.md`
- [ ] `hedge_fund/brokers/AGENTS.md`
- [ ] `hedge_fund/data/AGENTS.md`
- [ ] `hedge_fund/features/AGENTS.md`
- [ ] `hedge_fund/fund/AGENTS.md`
- [ ] `hedge_fund/llm/AGENTS.md`
- [ ] `hedge_fund/paper/AGENTS.md`
- [ ] `hedge_fund/pipeline/AGENTS.md`
- [ ] `hedge_fund/portfolio/AGENTS.md`
- [ ] `hedge_fund/scorecard/AGENTS.md`
- [ ] `hedge_fund/signals/AGENTS.md`
- [ ] `hedge_fund/risk/AGENTS.md`
- [ ] `hedge_fund/strategies/AGENTS.md`
- [ ] `hedge_fund/tui/AGENTS.md`
- [ ] `hedge_fund/validation/AGENTS.md`

### Depth 1
- [ ] `hedge_fund/AGENTS.md`

### Depth 0
- [ ] `./AGENTS.md` (root)
