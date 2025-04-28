# SPDX-License-Identifier: AGPL-3.0-or-later
import os

IMAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "media", "images")
ENVIRONMENT = os.environ.get("ENVIRONMENT")

if ENVIRONMENT == "development":
    print(f"Clearing images in: {IMAGE_DIR}")
    try:
        files_to_delete = [f for f in os.listdir(IMAGE_DIR) if os.path.isfile(os.path.join(IMAGE_DIR, f))]
        for filename in files_to_delete:
            file_path = os.path.join(IMAGE_DIR, filename)
            os.remove(file_path)
            print(f"Deleted: {filename}")
        print("Image directory cleared.")
    except FileNotFoundError:
        print(f"Error: Directory not found: {IMAGE_DIR}")
    except Exception as e:
        print(f"An error occurred: {e}")
else:
    print("Not in development environment. Skipping image cleanup.")
