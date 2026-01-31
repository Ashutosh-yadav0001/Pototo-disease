
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("../saved_models/1")

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# Minimum confidence threshold - if model is less confident than this,
# the image is likely not a potato leaf
CONFIDENCE_THRESHOLD = 0.50

# Expected image size for the model
IMAGE_SIZE = 256

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data))
    # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    # Resize to expected size
    image = image.resize((IMAGE_SIZE, IMAGE_SIZE))
    return np.array(image)

def is_valid_leaf_image(image: np.ndarray) -> tuple[bool, str]:
    """
    Basic validation to check if image might be a leaf.
    Returns (is_valid, error_message)
    """
    # Check if image has reasonable color distribution for a leaf
    # Leaves typically have significant green channel values
    
    if len(image.shape) != 3 or image.shape[2] != 3:
        return False, "Invalid image format. Please upload a color image."
    
    # Calculate average color channels
    avg_red = np.mean(image[:, :, 0])
    avg_green = np.mean(image[:, :, 1])
    avg_blue = np.mean(image[:, :, 2])
    
    # Check for very dark or very bright images (likely not a leaf photo)
    brightness = (avg_red + avg_green + avg_blue) / 3
    if brightness < 30:
        return False, "Image is too dark. Please upload a clearer photo of a potato leaf."
    if brightness > 240:
        return False, "Image is too bright/overexposed. Please upload a clearer photo."
    
    return True, ""

@app.post("/predict")
async def predict(
        file: UploadFile = File(...)
):
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Please upload an image file.")
    
    try:
        image = read_file_as_image(await file.read())
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not process the image. Please upload a valid image file.")
    
    # Basic image validation
    is_valid, error_msg = is_valid_leaf_image(image)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL.predict(img_batch)
    
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))
    
    # Check if confidence is above threshold
    # If model is not confident, the image is likely not a potato leaf
    if confidence < CONFIDENCE_THRESHOLD:
        raise HTTPException(
            status_code=400, 
            detail="Oops! This doesn't look like a potato leaf 🌿 Please upload a clear photo of a potato plant leaf for accurate disease detection."
        )
    
    return {
        'class': predicted_class,
        'confidence': confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)