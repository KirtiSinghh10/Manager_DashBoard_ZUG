import pandas as pd
from sklearn.linear_model import LinearRegression

def forecast(data):
    if not data:
        return 0

    df = pd.DataFrame(data)

    X = df[['week']]
    y = df['profit']

    model = LinearRegression()
    model.fit(X, y)

    next_week = [[df['week'].max() + 1]]
    prediction = model.predict(next_week)

    return float(prediction[0])