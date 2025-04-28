# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for the clear_dev_images.py script.
"""

import os
import unittest
from unittest.mock import patch

from core.management.commands import clear_dev_images


class TestClearImagesScript(unittest.TestCase):
    assert clear_dev_images.IMAGE_DIR == "/app/media/images"

    @patch("os.environ.get")
    @patch("os.listdir")
    @patch("os.path.isfile")
    @patch("os.remove")
    def test_development_env_clear_dev_images(
        self, mock_remove, mock_isfile, mock_listdir, mock_environ_get
    ):
        mock_environ_get.return_value = "development"

        mock_listdir.return_value = [
            "image.png",
            "image.jpg",
            "image.jpeg",
            "script.py",
        ]
        mock_isfile.side_effect = lambda path: path.endswith(
            ("png", "jpg", "jpeg", "py")
        )

        with patch("builtins.print") as mock_print:
            clear_dev_images.main()

        mock_remove.assert_any_call(
            os.path.join(clear_dev_images.IMAGE_DIR, "image.png")
        )
        mock_remove.assert_any_call(
            os.path.join(clear_dev_images.IMAGE_DIR, "image.jpg")
        )
        mock_remove.assert_any_call(
            os.path.join(clear_dev_images.IMAGE_DIR, "image.jpeg")
        )
        self.assertEqual(mock_remove.call_count, 3)

        mock_print.assert_any_call("Deleted: image.png")
        mock_print.assert_any_call("Deleted: image.jpg")
        mock_print.assert_any_call("Deleted: image.jpeg")

    @patch("os.environ.get")
    def test_non_development_env(self, mock_environ_get):
        mock_environ_get.return_value = "production"

        with patch("builtins.print") as mock_print:
            clear_dev_images.main()

        mock_print.assert_any_call(
            "Not in development environment. Skipping clearing images."
        )

    @patch("os.environ.get")
    @patch("os.listdir")
    def test_media_images_dir_not_found(self, mock_listdir, mock_environ_get):
        mock_environ_get.return_value = "development"

        mock_listdir.side_effect = FileNotFoundError

        with patch("builtins.print") as mock_print:
            clear_dev_images.main()

        mock_print.assert_any_call(
            f"Error: Directory not found: {clear_dev_images.IMAGE_DIR}"
        )
