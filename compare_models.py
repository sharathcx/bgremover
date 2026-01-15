import os
import time
import glob
from pathlib import Path
from rembg import remove, new_session
from PIL import Image
import io

# Configuration
INPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(INPUT_DIR, 'comparison_results')
SUPPORTED_EXTENSIONS = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.bmp']

# List of models to compare
# Note: 'birefnet-general' is the recommended high-quality model
# 'u2net' is the standard, 'u2netp' is lightweight
MODELS_TO_TEST = [
    'u2net',
    'u2netp',
    'birefnet-general',
    'birefnet-general-lite',
    'isnet-general-use'
]

def get_image_files(directory):
    files = []
    for ext in SUPPORTED_EXTENSIONS:
        files.extend(glob.glob(os.path.join(directory, ext)))
        files.extend(glob.glob(os.path.join(directory, ext.upper())))
    return sorted(list(set(files))) # Remove duplicates and sort

def compare_models():
    # Create output directory
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created output directory: {OUTPUT_DIR}")

    image_files = get_image_files(INPUT_DIR)
    
    if not image_files:
        print(f"No images found in {INPUT_DIR}")
        return

    print(f"Found {len(image_files)} images: {[os.path.basename(f) for f in image_files]}")
    print("-" * 50)

    for img_path in image_files:
        img_name = os.path.basename(img_path)
        img_stem = Path(img_path).stem
        
        # Create a subfolder for this specific image's results
        img_result_dir = os.path.join(OUTPUT_DIR, img_stem)
        if not os.path.exists(img_result_dir):
            os.makedirs(img_result_dir)

        print(f"\nProcessing: {img_name}")
        
        try:
            with open(img_path, 'rb') as f:
                img_data = f.read()
        except Exception as e:
            print(f"Error reading {img_name}: {e}")
            continue

        for model_name in MODELS_TO_TEST:
            print(f"  > Running model: {model_name}...", end=" ", flush=True)
            
            output_filename = f"{img_stem}_{model_name}.png"
            output_path = os.path.join(img_result_dir, output_filename)
            
            # Skip if already exists (optional, currently overwriting)
            # if os.path.exists(output_path):
            #     print("Skipped (already exists)")
            #     continue

            try:
                start_time = time.time()
                
                # Initialize session for the model
                session = new_session(model_name)
                
                # Process image
                output_data = remove(img_data, session=session)
                
                # Save result
                with open(output_path, 'wb') as o:
                    o.write(output_data)
                
                end_time = time.time()
                duration = end_time - start_time
                
                print(f"Done! ({duration:.2f}s)")
                
            except Exception as e:
                print(f"FAILED! Error: {e}")

    print("\n" + "=" * 50)
    print(f"Comparison complete! Results saved in '{OUTPUT_DIR}'")
    print("=" * 50)

if __name__ == "__main__":
    compare_models()
