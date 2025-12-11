#!/usr/bin/env python
"""
Start both frontend and backend servers with a single command.
Run this from the project root or from anywhere - it will find the directories.
"""

import subprocess
import os
import sys
import time
from pathlib import Path

def find_project_root():
    """Find the controleFinanceiro directory"""
    current = Path.cwd()
    
    # If we're already in controleFinanceiro, use it
    if current.name == "controleFinanceiro":
        return current
    
    # Search parent directories
    for parent in current.parents:
        potential = parent / "controleFinanceiro"
        if potential.exists() and (potential / "backend").exists() and (potential / "frontend").exists():
            return potential
    
    # Try to find it in common locations
    home = Path.home()
    for root, dirs, files in os.walk(home / "OneDrive" / "Área de Trabalho"):
        if "controleFinanceiro" in dirs:
            potential = Path(root) / "controleFinanceiro"
            if (potential / "backend").exists() and (potential / "frontend").exists():
                return potential
    
    print("❌ Could not find controleFinanceiro directory")
    sys.exit(1)

def start_backend(project_root):
    """Start FastAPI backend in background"""
    backend_dir = project_root / "backend"
    
    if sys.platform == "win32":
        # Windows PowerShell
        cmd = f'cd "{backend_dir}" && .\.venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000'
        process = subprocess.Popen(
            ["powershell", "-Command", cmd],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    else:
        # Mac/Linux
        cmd = f'cd "{backend_dir}" && source .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000'
        process = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    
    return process

def start_frontend(project_root):
    """Start Vite frontend in background"""
    frontend_dir = project_root / "frontend"
    
    if sys.platform == "win32":
        # Windows PowerShell
        cmd = f'cd "{frontend_dir}" && npm run dev'
        process = subprocess.Popen(
            ["powershell", "-Command", cmd],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    else:
        # Mac/Linux
        cmd = f'cd "{frontend_dir}" && npm run dev'
        process = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    
    return process

def main():
    print("\n" + "="*70)
    print("🚀 Iniciando Controle Financeiro".center(70))
    print("="*70 + "\n")
    
    project_root = find_project_root()
    print(f"📁 Projeto encontrado em: {project_root}\n")
    
    print("⏳ Iniciando Backend (FastAPI)...")
    backend = start_backend(project_root)
    time.sleep(2)
    
    print("✅ Backend iniciado em http://127.0.0.1:8000")
    print("   Docs: http://127.0.0.1:8000/docs\n")
    
    print("⏳ Iniciando Frontend (Vite)...")
    frontend = start_frontend(project_root)
    time.sleep(2)
    
    print("✅ Frontend iniciado em http://localhost:5173\n")
    
    print("="*70)
    print("🎉 TUDO RODANDO!".center(70))
    print("="*70)
    print("\n📱 Abra seu navegador em: http://localhost:5173")
    print("📚 API Docs em: http://127.0.0.1:8000/docs")
    print("\n⚠️  Pressione Ctrl+C para parar os servidores\n")
    
    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\n\n⛔ Parando servidores...")
        backend.terminate()
        frontend.terminate()
        time.sleep(1)
        backend.kill()
        frontend.kill()
        print("✅ Servidores parados!")
        sys.exit(0)

if __name__ == "__main__":
    main()
