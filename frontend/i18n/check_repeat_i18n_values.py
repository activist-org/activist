"""
i18n Check Repeat Values

Run `python i18n_check_repeat_values.py` to check if the en-US.json file has repeat strings.
If yes, combine them in a `_global` sub name at the lowest matching name level of `en-US.json`.
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

keys_to_remove = []
for repeat_value in json_repeat_value_counts:
    i18n_keys = [
        k
        for k, v in en_us_json_dict.items()
        if repeat_value == lower_and_remove_punctuation(value=v) and k[-len("_lower"):] != "_lower"
    ]

    # Needed as we're removing keys that are set to lowercase above.
    if len(i18n_keys) > 1:
        print(f"\nRepeat value: '{repeat_value}'")
        print(f"Number of instances: : {json_repeat_value_counts[repeat_value]}")
        print(f"Keys: {', '.join(i18n_keys)}")

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

    else:
        # Remove the key if the repeat is caused by a lowercase word.
        keys_to_remove.append(repeat_value)

for k in keys_to_remove:
    json_repeat_value_counts.pop(k, None)

if json_repeat_value_counts:
    if len(json_repeat_value_counts) == 1:
        value_to_be = "value is"

    else:
        value_to_be = "values are"

    print("")
    raise ValueError(f"{len(json_repeat_value_counts)} repeat i18n {value_to_be} present. Please combine given the suggestions above.")

else:
    print("\nSuccess: no repeat i18n values found.")
