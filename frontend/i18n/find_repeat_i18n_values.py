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


def get_nested_dict_values(d):
    for v in d.values():
        if isinstance(v, dict):
            yield from get_nested_dict_values(v)
        else:
            yield v


all_json_keys = [
    k.lower().translate(str.maketrans("", "", string.punctuation))
    for k in list(get_nested_dict_values(en_us_json_dict))
]

json_repeat_key_counts = {
    k: v for k, v in dict(Counter(all_json_keys)).items() if v > 1
}

print(
    json.dumps(
        json_repeat_key_counts,
        indent=2,
    )
)
print(f"Number of repeat i18n values: {len(json_repeat_key_counts)}")
