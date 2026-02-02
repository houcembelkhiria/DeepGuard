from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model

import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import os
import io
import shutil
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from mangum import Mangum
from supabase import create_client, Client


os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = FastAPI(title="DeepFake Detection API")
handler = Mangum(app)

# =========================
# Admin Initialization
# =========================
@app.on_event("startup")
def init_admin_user():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_password = os.environ.get("ADMIN_PASSWORD")

    if not all([supabase_url, supabase_key, admin_email, admin_password]):
        print("Skipping admin initialization: Missing env vars")
        return

    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        # Check if user exists (this is a simplified check, typically you'd query auth.users/listUsers via admin api)
        # However, supabase-py admin auth client usage:
        # We try to sign in; if fails, we create. Or typically just try create and catch error.
        
        try:
           # Attempt to create user. If already exists, it might raise validation error or return existing user.
           # Using admin.create_user to bypass email confirmation if needed, or just sign_up
           res = supabase.auth.admin.create_user({
               "email": admin_email,
               "password": admin_password,
               "email_confirm": True
           })
           print(f"Admin user processed: {res}")
        except Exception as e:
            print(f"Admin user creation skipped (likely exists): {str(e)}")

    except Exception as e:
        print(f"Failed to initialize admin: {e}")

# =========================
# CORS Middleware
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Configuration
# =========================
MODEL_PATH = os.path.join("model", "best_model.h5")

FILES_DIR = r"file_dir" # Change this to your actual files directory
# =========================
# Load model ONCE (inference mode)
# =========================
try:
    model = load_model(MODEL_PATH, compile=False)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None


# =========================
# ELA Processing Function
# =========================
def convert_to_ela_image(path: str, quality: int = 75) -> Image.Image:
    """
    Perform Error Level Analysis (ELA) on an image.
    """
    original = Image.open(path).convert("RGB")

    # Temporary compressed image
    temp_path = "temp_ela.jpg"
    original.save(temp_path, "JPEG", quality=quality)
    compressed = Image.open(temp_path)

    # Compute difference
    ela_image = ImageChops.difference(original, compressed)

    # Scale ELA image
    extrema = ela_image.getextrema()
    max_diff = max(ex[1] for ex in extrema) or 1
    scale = 255.0 / max_diff
    ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)

    # Cleanup
    if os.path.exists(temp_path):
        os.remove(temp_path)

    return ela_image

def process_and_predict(image_path: str, filename: str):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # ELA preprocessing
        ela = convert_to_ela_image(image_path, quality=95)
        ela = ela.resize((128, 128))
        ela_array = np.asarray(ela, dtype=np.float32) / 255.0
        ela_array = np.expand_dims(ela_array, axis=0)

        # Model prediction
        pred = model.predict(ela_array)[0]
        confidence_real = float(pred[0] * 100)
        confidence_fake = float(pred[1] * 100)

        result = "Fake" if confidence_fake > confidence_real else "Real"

        return {
            "file": filename,
            "prediction": result,
            "confidence": max(confidence_real, confidence_fake),
            "probabilities": {
                "real": confidence_real,
                "fake": confidence_fake
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


# =========================
# New Upload Endpoint
# =========================
@app.post("/predict")
async def predict_upload(file: UploadFile = File(...)):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    
    file_path = os.path.join(temp_dir, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        result = process_and_predict(file_path, file.filename)
        return result
        
    finally:
        # Cleanup uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

# =========================
# Legacy Endpoint (Backward Compatibility)
# =========================
@app.post("/predict/{folder}/{filename}")
def predict_image(folder,filename):
    image_path = os.path.join(FILES_DIR, folder,filename)
    if not os.path.isfile(image_path):
        print("File not found:", image_path)
        raise HTTPException(status_code=404, detail="File not found")
        
    return process_and_predict(image_path, filename)

# =========================
# Static Files & SPA Handling (Must be last)
# =========================
# Only mount if static directory exists (i.e. in Docker/Prod)
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Allow API routes to pass through if they weren't caught above, 
        # BUT since this is a catch-all, we must ensure API routes are defined first. 
        # (They are).
        # Check if file exists in static path, else serve index
        possible_path = os.path.join("static", full_path)
        if os.path.isfile(possible_path):
             return FileResponse(possible_path)
        return FileResponse("static/index.html")
