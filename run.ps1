Write-Host "Starting MetroGraph Route Planner on http://localhost:8000..." -ForegroundColor Cyan
Start-Process "http://localhost:8000"
python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000
