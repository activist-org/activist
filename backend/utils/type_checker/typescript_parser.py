# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Module for parsing TypeScript interfaces and types.
"""

import re
from dataclasses import dataclass
from typing import Dict, List, Set


@dataclass
class TypeScriptInterface:
    """
    Represents a TypeScript interface with its fields and parent interfaces.
    """

    name: str
    fields: Set[str]
    parents: List[str]


class TypeScriptParser:
    """
    Parser for TypeScript interface files.
    """

    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        with open(file_path, "r", encoding="utf-8") as f:
            self.content = f.read()

    def parse_interfaces(self) -> Dict[str, TypeScriptInterface]:
        """
        Parse TypeScript interfaces from the file.
        """
        interfaces = {}
        interface_pattern = (
            r"(?:export\s+|declare\s+)?interface\s+(\w+)"
            r"(?:\s+extends\s+([^{]+))?\s*{([\s\S]*?)}"
        )

        for match in re.finditer(interface_pattern, self.content):
            name = match.group(1)
            parents = (
                [p.strip() for p in match.group(2).split(",")] if match.group(2) else []
            )
            fields = self._extract_fields(match.group(3))

            interfaces[name] = TypeScriptInterface(name, fields, parents)

        return interfaces

    def get_backend_only_fields(self) -> Set[str]:
        """
        Extract fields marked as backend-only in comments.
        """
        patterns = [
            r"//.*?Note:\s*(\w+)\s+is\s+backend\s+only",
            r"//.*?(\w+)\s+is\s+backend\s+only",
            r"//\s*@backend-only\s+(\w+)",
            r"//.*?backend-only:\s*(\w+)",
        ]
        return {
            match for pattern in patterns for match in re.findall(pattern, self.content)
        }

    @staticmethod
    def _extract_fields(interface_body: str) -> Set[str]:
        """
        Extract field names from interface body.
        """
        fields = set()

        # Regular fields
        fields.update(re.findall(r"(?://[^\n]*\n)*\s*(\w+)\s*[?]?\s*:", interface_body))

        # Readonly fields
        fields.update(re.findall(r"readonly\s+(\w+)\s*[?]?\s*:", interface_body))

        return fields
