import os
import sys
from pathlib import Path

# Limpar DB se existir antes de testes
db_path = Path(__file__).parent.parent.parent / "controle_financeiro.db"
if db_path.exists():
    os.remove(db_path)
