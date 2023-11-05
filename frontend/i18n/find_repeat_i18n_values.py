"""
Find Repeat i18n Values

Run `python find_repeat_i18n_values.py` to check if the en-US.json file has repeat strings.
If yes, combine them in the `_common` sub object at the lowest shared depth of `en-US.json`.
"""


from collections import Counter
import json
from pathlib import Path
import string

this_directory = str(Path(__file__).parent.resolve())

with open(f"{this_directory}/en-US.json") as f:
    en_us_json_dict = json.loads(f.read())

def lower_and_remove_punctuation(value):
    return value.lower().translate(str.maketrans("", "", string.punctuation))

all_json_values = [
    lower_and_remove_punctuation(value=v)
    for v in list(en_us_json_dict.values())
]

json_repeat_value_counts = {
    k: v for k, v in dict(Counter(all_json_values)).items() if v > 1
}

for repeat_value in json_repeat_value_counts:
    i18n_keys = [
        k
        for k, v in en_us_json_dict.items()
        if repeat_value == lower_and_remove_punctuation(value=v)
    ]

    print(f"\nRepeat value: '{repeat_value}'")
    print(f"Number of instances: : {json_repeat_value_counts[repeat_value]}")
    print(f"Keys: {', '.join(list(i18n_keys))}")

    common_prefix = ""
    min_key_length = min(len(k) for k in i18n_keys)
    common_character = True
    while common_character:
        for i in range(min_key_length):
            if len({k[i] for k in i18n_keys}) == 1:
                common_prefix += i18n_keys[0][i]
            else:
                common_character = False
                break

        common_character = False

    if common_prefix := '.'.join(common_prefix.split('.')[:-1]):
        print(f"Suggested new key: {common_prefix}._global.IDENTIFIER_KEY")
    else:
        print("Suggested new key: _global.IDENTIFIER_KEY")

if json_repeat_value_counts:
    print(f"\nNumber of repeat i18n values: {len(json_repeat_value_counts)}")

else:
    print("\nNo repeat i18n values found.")
