from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
import uvicorn
import os
import logging

logger = logging.getLogger("uvicorn.error")

app = FastAPI()
base_dir = os.path.dirname(os.path.abspath(__file__))

# Основное приложение
app.mount("/", StaticFiles(directory=f"{base_dir}/fingrow_miniapp", html=True), name="fingrow_miniapp")

# Статические файлы для основного приложения
app.mount("/fingrow_miniapp/static", StaticFiles(directory=f"{base_dir}/fingrow_miniapp/static"), name="fingrow_static")

# Финсимулятор - статические файлы
app.mount("/finsimulator_web/static", StaticFiles(directory=f"{base_dir}/finsimulator_web/static"), name="finsimulator_static")

# Финсимулятор - корневой индекс
@app.get("/finsimulator_web")
def serve_finsimulator():
    return FileResponse(f"{base_dir}/finsimulator_web/index.html")

# 特定路径重定向到 /finsimulator_web
@app.get("/game/level/7")
def redirect_to_finsimulator():
    logger.info("Redirecting to finsimulator...")
    return RedirectResponse("/finsimulator_web")

# Запасной маршрут для SPA
@app.get("/{full_path:path}")
def catch_all(request: Request):
    logger.info(f"Request handled: {request.url}")
    return FileResponse(f"{base_dir}/fingrow_miniapp/index.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)