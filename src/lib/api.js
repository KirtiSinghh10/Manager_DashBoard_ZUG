const BASE_URL = "http://127.0.0.1:8000/api";

export async function getDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard`);
  return res.json();
}

export async function getForecast() {
  const res = await fetch(`${BASE_URL}/forecast`);
  return res.json();
}