.PHONY: setup dev dev-fe dev-be test test-fe test-be check synth clean help

help:
	@echo "RENAL-PULSE Developer Workflow:"
	@echo "  make setup     - Install backend and frontend dependencies"
	@echo "  make dev       - Run both backend (:8000) and frontend (:5173)"
	@echo "  make dev-fe    - Run Vite frontend dev server (:5174)"
	@echo "  make dev-be    - Run FastAPI backend dev server"
	@echo "  make test      - Run all tests (backend & frontend)"
	@echo "  make test-be   - Run backend pytest suite"
	@echo "  make test-fe   - Run frontend tests"
	@echo "  make check     - Run all type checks, linters, and tests"
	@echo "  make synth     - Generate 100 synthetic patient records"
	@echo "  make clean     - Remove caches and temporary files"

setup:
	@echo "==> Setting up backend virtual environment..."
	python3 -m venv backend/venv
	. backend/venv/bin/activate && pip install -r backend/requirements.txt
	@echo "==> Setting up frontend dependencies..."
	cd frontend && npm install

dev-be:
	@echo "==> Starting FastAPI backend on :8000..."
	. backend/venv/bin/activate && cd backend && uvicorn app.main:app --reload --port 8000

dev-fe:
	@echo "==> Starting Vite frontend on :5173..."
	cd frontend && npm run dev

test-be:
	@echo "==> Running backend test suite with pytest..."
	. backend/venv/bin/activate && pytest backend/tests -v

test-fe:
	@echo "==> Running frontend test suite..."
	cd frontend && npm run test

check: test-be test-fe
	@echo "==> All quality gates passed!"

synth:
	@echo "==> Generating synthetic cardiorenal patient cohort..."
	python3 scripts/generate_synthetic_patients.py

clean:
	rm -rf backend/venv frontend/node_modules frontend/dist .pytest_cache
	find . -type d -name __pycache__ -exec rm -rf {} +
