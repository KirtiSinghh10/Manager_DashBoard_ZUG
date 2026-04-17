from fastapi import APIRouter
from database import supabase
from services.forecast import generate_forecast

router = APIRouter()

# ─────────────────────────────────────────────
# 🔹 Dashboard API
# ─────────────────────────────────────────────
@router.get("/dashboard")
def dashboard_data():
    try:
        response = supabase.table("weekly_financials").select("*").execute()
        weekly = response.data or []

        return {
            "weekly": weekly
        }

    except Exception as e:
        return {
            "weekly": [],
            "error": str(e)
        }


# ─────────────────────────────────────────────
# 🔹 Forecast API
# ─────────────────────────────────────────────
@router.get("/forecast")
def get_forecast():
    try:
        response = supabase.table("weekly_financials").select("*").execute()
        data = response.data or []

        prediction = generate_forecast(data)

        return {
            "next_week_prediction": float(prediction)  # ✅ IMPORTANT FIX
        }

    except Exception as e:
        return {
            "next_week_prediction": 0,
            "error": str(e)
        }