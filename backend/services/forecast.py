import pandas as pd
from sklearn.linear_model import LinearRegression

def generate_forecast(data):
    if not data or len(data) < 2:
        return 0

    df = pd.DataFrame(data)

    # ✅ Convert week to datetime
    df["week"] = pd.to_datetime(df["week"])

    # ✅ Sort by week
    df = df.sort_values("week")

    # ✅ Create numeric feature (THIS FIXES YOUR ERROR)
    df["week_number"] = range(1, len(df) + 1)

    # ✅ Use ONLY numeric column
    X = df[["week_number"]]   # 👈 IMPORTANT
    y = df["profit"]

    # ✅ Train model
    model = LinearRegression()
    model.fit(X, y)

    # ✅ Predict next week
    next_week = [[len(df) + 1]]
    prediction = model.predict(next_week)

    return float(prediction[0])