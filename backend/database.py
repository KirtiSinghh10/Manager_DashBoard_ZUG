from supabase import create_client
import os
from dotenv import load_dotenv

# ✅ correct relative path
load_dotenv(dotenv_path=".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("DEBUG URL:", SUPABASE_URL)
print("DEBUG KEY:", SUPABASE_KEY)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)