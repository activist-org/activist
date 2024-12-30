import os
import pathlib
import re
from typing import Pattern
import pprint

API_PATTERNS = [
    re.compile(r"\$\{BASE_BACKEND_URL\}/\S+"),
    re.compile(r"localhost:8000/\S+"),
    re.compile(r"127.0.0.1:8000/\S+"),
]


def search_for_api_calls(
    file_path: str, api_pattern: list[Pattern[str]]
) -> dict | None:
    """
    Searches for API calls in a given file and returns a list of the API calls found.

    Parameters
    ----------
    file_path: str
        The path to the file to be searched.

    Returns
    -------
    dict
        A dict with the file name as the key and the API calls found in the file.
    """
    file_name = os.path.basename(file_path)

    api_calls = {file_name: []}
    with open(file_path, "r", encoding="utf-8") as file:
        try:
            for line in file:
                for pattern in api_pattern:
                    results = re.findall(pattern, line)

                    if results:
                        api_calls[file_name].extend(results)
        except UnicodeDecodeError:
            print(f"Skipping non-UTF-8 encoded line in {file_path}")

    if len(api_calls[file_name]) == 0:
        return None

    return api_calls


def search_for_api_calls_in_directory(dir_path: str, exclude: None | list[str]) -> list:
    """
    Searches for API calls in all files in a given directory and its subdirectories, and returns a list of the API calls found.

    Parameters
    ----------
    directory_path: str
        The path to the directory to be searched.

    Returns
    -------
    list
        A list of the API calls found in the files in the directory and its subdirectories.
    """
    api_calls = []
    for root, dirs, files in os.walk(dir_path, topdown=True):
        if exclude:
            dirs[:] = [d for d in dirs if d not in exclude]
            print(dirs)

        for file in files:
            if file.endswith((".vue", ".js", ".ts")):
                file_path = os.path.join(root, file)
                results = search_for_api_calls(
                    file_path=file_path, api_pattern=API_PATTERNS
                )
                if results is not None:
                    api_calls.append(results)

    return api_calls


def print_results(results: list[str]) -> None:
    print(
        f"API calls found in the frontend code:\n"
        f"-------------------------------------\n"
        f"Number of API calls: {len(results)}\n"
        f"Details:\n"
    )
    pprint.PrettyPrinter(indent=4, depth=3, compact=False).pprint(results)
    print("\n")


BASE_DIR = pathlib.Path(__file__).parent
FRONTEND_DIR = BASE_DIR / "frontend"

EXCLUDE_DIRS = [
    "node_modules",
    "dist",
    "public",
    "build",
    "test",
    "tests",
    "types",
    "test-e2e",
    ".nuxt",
]

results = search_for_api_calls_in_directory(dir_path=FRONTEND_DIR, exclude=EXCLUDE_DIRS)

print_results(results)
