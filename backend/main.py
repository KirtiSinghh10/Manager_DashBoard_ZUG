from fastapi import FastAPI
from routes.analytics import router as analytics_router

app = FastAPI()

app.include_router(analytics_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend running 🚀"}