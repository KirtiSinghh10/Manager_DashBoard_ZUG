from fastapi import APIRouter
from database import supabase
from services.forecast import forecast   # 👈 THIS IMPORT

router = APIRouter()

# 🔹 Dashboard data
@router.get("/dashboard")
def dashboard_data():
    weekly = supabase.table("weekly_financials").select("*").execute().data
    return {"weekly": weekly}


# 🔹 Forecast route (THIS is your code)
@router.get("/forecast")
def get_forecast():
    data = supabase.table("weekly_financials").select("*").execute().data  # 👈 NOT "your_table_name"
    
    prediction = forecast(data)
    
    return {
        "next_week_prediction": prediction
    }