import subprocess


def run_check(script_name):
    try:
        subprocess.run(["python", f"./frontend/i18n/check/{script_name}"], check=True)
        print(f"{script_name} ran successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_name}: {e}")
        raise


def main():
    checks = [
        "i18n_check_key_identifiers.py",
        "i18n_check_non_source_keys.py",
        "i18n_check_repeat_values.py",
        "i18n_check_unused_keys.py",
    ]

    for check in checks:
        run_check(check)


if __name__ == "__main__":
    main()
