from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove, new_session
from PIL import Image
import io
import base64
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI(title="BG Remover API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-load sessions for better performance
# Keeping it to a reasonable set to avoid OOM on smaller machines
MODELS = {
    "u2net": new_session("u2net"),
    "u2netp": new_session("u2netp"),
    "birefnet-general": new_session("birefnet-general"),
    "birefnet-general-lite": new_session("birefnet-general-lite"),
    "isnet-general-use": new_session("isnet-general-use"),
}

def process_image(image_bytes: bytes, model_name: str) -> str:
    try:
        session = MODELS.get(model_name)
        if not session:
            # Fallback or dynamic load if we wanted to support more
            session = new_session(model_name)
        
        output_bytes = remove(image_bytes, session=session)
        
        # Convert to base64 for easy frontend display without file storage
        # (For production, uploading to S3/Cloud storage and returning URL is better)
        encoded_string = base64.b64encode(output_bytes).decode('utf-8')
        return f"data:image/png;base64,{encoded_string}"
    except Exception as e:
        print(f"Error processing {model_name}: {str(e)}")
        return None

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    
    # Run processing in parallel (using threads since onnxruntime releases GIL often, but CPU bound)
    results = {}
    
    # Using ThreadPoolExecutor to run model inference concurrently if possible
    # Note: Global Interpreter Lock (GIL) might limit true parallelism for Python code,
    # but underlying C++ libraries (onnxruntime) often release GIL.
    loop = asyncio.get_event_loop()
    
    tasks = []
    for model_name in MODELS.keys():
        tasks.append(
            loop.run_in_executor(None, process_image, contents, model_name)
        )
    
    processed_images = await asyncio.gather(*tasks)
    
    for model_name, result in zip(MODELS.keys(), processed_images):
        results[model_name] = result

    # Also return the original image for comparison
    original_b64 = base64.b64encode(contents).decode('utf-8')
    results["original"] = f"data:{file.content_type};base64,{original_b64}"

    return JSONResponse(content=results)

@app.get("/models")
def get_models():
    return list(MODELS.keys())

# Mount static files (Frontend)
import os
from fastapi.staticfiles import StaticFiles

# Mount specific assets if needed or just root
# We mount root last so API routes take precedence
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
