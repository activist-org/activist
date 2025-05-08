# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Clear all images that are uploaded when in development mode.

Notes
-----
This script is ran in docker-compose.yaml when the backend is started up.
"""

# ATTN: This file should not be edited as it removes files from a specific local directory.

import os
from pathlib import Path

IMAGE_DIR = Path(__file__).resolve().parent.parent.parent.parent / "media" / "images"


def main() -> None:
    """
    Run functionality to clear uploaded images from the test images directory.
    """
    ENVIRONMENT = os.environ.get("ENVIRONMENT")

    if ENVIRONMENT == "development":
        print(f"In development environment. Clearing any images in {IMAGE_DIR}.")
        try:
            image_files_to_delete = [
                f
                for f in os.listdir(IMAGE_DIR)
                if os.path.isfile(os.path.join(IMAGE_DIR, f))
                and (f.lower()[-3:] in ["png", "jpg"] or f.lower()[-4:] in ["jpeg"])
            ]
            for filename in image_files_to_delete:
                file_path = os.path.join(IMAGE_DIR, filename)
                os.remove(file_path)
                print(f"Deleted: {filename}")

            if not image_files_to_delete:
                print("No images in directory to clear.")

            else:
                print("Image directory cleared.")

        except FileNotFoundError:
            print(f"Error: Directory not found: {IMAGE_DIR}")

        except Exception as e:
            print(f"An error occurred: {e}")

    else:
        print("Not in development environment. Skipping clearing images.")


if __name__ == "__main__":
    main()
