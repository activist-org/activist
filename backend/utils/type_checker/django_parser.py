# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Module for parsing Django models and extracting field information.
"""

import ast
from typing import Dict, Set


class DjangoModelVisitor(ast.NodeVisitor):
    """
    AST visitor to extract fields from Django models.
    """

    DJANGO_FIELD_TYPES = {
        "Field",
        "CharField",
        "TextField",
        "IntegerField",
        "BooleanField",
        "DateTimeField",
        "ForeignKey",
        "ManyToManyField",
        "OneToOneField",
        "EmailField",
        "URLField",
        "FileField",
        "ImageField",
        "DecimalField",
        "AutoField",
    }

    def __init__(self) -> None:
        self.models: Dict[str, Set[str]] = {}
        self.current_model: str | None = None

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        """
        Check class definitions, specifically those that inherit from other classes.

        Parameters
        ----------
        node : ast.ClassDef
            A class definition from Python AST (Abstract Syntax Tree).
            It contains information about the class, such as its name, base classes, body, decorators, etc.
        """
        # Only process classes that inherit from something.
        if node.bases:
            self.current_model = node.name
            if self.current_model not in self.models:
                self.models[self.current_model] = set()

            self.generic_visit(node)

        self.current_model = None

    def visit_Assign(self, node: ast.Assign) -> None:
        """
        Check assignment statements within a class.

        Parameters
        ----------
        node : ast.Assign
            An assignment definition from Python AST (Abstract Syntax Tree).
            It represents an assignment statement (e.g., x = 42).
        """
        if not self.current_model:
            return

        for target in node.targets:
            if (
                isinstance(target, ast.Name)
                and not target.id.startswith("_")
                and isinstance(node.value, ast.Call)
                and hasattr(node.value.func, "attr")
            ) and any(
                field_type in node.value.func.attr
                for field_type in self.DJANGO_FIELD_TYPES
            ):
                self.models[self.current_model].add(target.id)


def extract_model_fields(models_file: str) -> Dict[str, Set[str]]:
    """
    Extract fields from Django models file.

    Parameters
    ----------
    models_file : str
        A models.py file that defines Django models.

    Returns
    -------
    Dict[str, Set[str]]
        The fields from the models file extracted into a dictionary for future processing.
    """
    with open(models_file, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read())

    visitor = DjangoModelVisitor()
    visitor.visit(tree)

    return visitor.models
