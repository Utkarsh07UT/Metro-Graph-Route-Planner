import sys
from pathlib import Path

# Add backend to Python path
ROOT = Path(__file__).resolve().parent.parent / "backend"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import app
