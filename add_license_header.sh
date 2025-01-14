#!/bin/bash

# Comments for different file types
PYTHON_COMMENT="# SPDX-License-Identifier: AGPL-3.0-or-later"
JS_TS_COMMENT="// SPDX-License-Identifier: AGPL-3.0-or-later"
VUE_COMMENT="<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->"

# File extensions to process
EXTENSIONS=("py" "js" "ts" "vue")

# Process each file based on its extension
for EXT in "${EXTENSIONS[@]}"; do
    FILES=$(find . -type f -name "*.${EXT}")
    for FILE in $FILES; do
        case $EXT in
            py)
                HEADER=$PYTHON_COMMENT
                ;;
            js|ts)
                HEADER=$JS_TS_COMMENT
                ;;
            vue)
                HEADER=$VUE_COMMENT
                ;;
        esac

        # Check if the header is already present in the file
        if ! grep -q "$HEADER" "$FILE"; then
            # Prepend the appropriate header
            echo -e "$HEADER\n$(cat "$FILE")" > "$FILE"
            echo "Added header to $FILE"
        fi
    done
done

