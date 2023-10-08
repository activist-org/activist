import os
import re

# Define the directory where your codebase is located
codebase_directory = './frontend'

# Define the file extensions to search for (e.g., .js, .vue, .ts)
file_extensions = ['.js', '.vue', '.ts']

# Define a regular expression pattern to match TypeScript type declarations
type_pattern = r'(\btype\s+[A-Z][a-zA-Z0-9_]+\s*=\s*[^;]+;)'

def replace_types_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Use a lambda function as the replacement to convert the match to lowercase
    new_content = re.sub(type_pattern, lambda match: match.group().lower(), content)
    
    if new_content != content:
        with open(file_path, 'w') as file:
            file.write(new_content)
        print(f"Modified types in: {file_path}")
    else:
        print(f"No changes made in: {file_path}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in file_extensions):
                file_path = os.path.join(root, file)
                replace_types_in_file(file_path)

if __name__ == "__main__":
    process_directory(codebase_directory)
