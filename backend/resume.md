

---

# 📌 Pull Request Notes – mypy + django-stubs corrections

## 🗂️ Contexte général

This contribution follows issue [#1199](https://github.com/activist-org/activist/issues/1199), which aims to progressively enable static type checking with `mypy` and `django-stubs` in the Django modules of the activist project.

The goal is to fix the errors raised when the `ignore_errors = true` option is temporarily disabled in `pyproject.toml`, in order to move towards a stricter and more reliable configuration.

---

## ✅ Fix 1: Models – `flags` fields

**Modified files:**

* `content/models.py`
* `events/models.py`
* `communities/organizations/models.py`
* `communities/groups/models.py`

**Problem:**

```bash
error: Need type annotation for "flags"  [var-annotated]
```

**Cause:** `mypy` cannot infer the type of dynamic `ManyToManyField` fields, even with `django-stubs`.

**Solution:** Explicitly add the `Any` annotation for the `flags` field:

```python
from typing import Any

flags: Any = models.ManyToManyField(
    "authentication.UserModel",
    through="ResourceFlag",  # or EventFlag, etc., depending on the file
)
```

This approach is common in Django projects using `mypy`, to locally disable type checking on dynamic fields while remaining compatible with overall static analysis.


---

## ✅ Fix 2: `ImageSerializer.create()` – Return Type Annotation

**Affected file:**

* `content/serializers.py`

**Problem:**

```bash
error: Return type "list[Image]" of "create" incompatible with return type "Image" in supertype "ModelSerializer"  [override]
```

**Cause:**
The `create()` method was overridden to handle multiple files sent in a single request. It returns a `list[Image]` instead of a single instance as expected by `ModelSerializer`.

**Solution:**
Annotate the return type as `Any` to resolve the error while preserving the existing behavior:

```python
from typing import Any

def create(self, validated_data: Dict[str, Any]) -> Any:
    ...
    return images
```

A future refactor could consider implementing a `create_many()` method to handle this case more cleanly.

---

## ✅ Fix 3: `EventSerializer.validate()` – Date Comparison

**Affected file:**

* `events/serializers.py`

**Problems:**

```bash
error: Unsupported operand types for > ("datetime" and "int")  [operator]
error: Unsupported operand types for < ("datetime" and "None")  [operator]
```

**Cause:**
The `validate()` method performs comparisons using `>` between objects potentially typed as `datetime`, `str`, `None`, or `int`. This causes type errors for `mypy`, as it cannot determine the precise types in all cases.

**Solution:**
Use `isinstance(..., datetime)` to ensure the operands are comparable before using `>` or `<`:

```python
from datetime import datetime

if isinstance(start_dt, datetime) and isinstance(end_dt, datetime):
    if start_dt > end_dt:
        raise serializers.ValidationError(...)

if isinstance(creation_dt, datetime) and isinstance(deletion_dt, datetime):
    if creation_dt > deletion_dt:
        raise serializers.ValidationError(...)
```

---

## ✅ Fix 4: `UserFlagViewSets` – API View Typing

**Affected file:**

* `authentication/views.py`

**Problem:**

```bash
error: Function is missing a return type annotation  [no-untyped-def]
```

**Cause:**
`mypy` requires all exposed methods to have explicit type annotations when using strict mode (`strict = true`).

**Solution:**
Add the `-> Response` type to each affected method:

```python
def create(self, request: Request) -> Response:
def list(self, request: Request) -> Response:
def retrieve(self, request: Request, pk: str | None) -> Response:
def delete(self, request: Request) -> Response:
```

---

## ✅ Fix 5: `OpenApiTypes` – Ignored Import

**Affected file:**

* `authentication/views.py`

**Problem:**

```bash
error: Module "drf_spectacular.utils" does not explicitly export attribute "OpenApiTypes"  [attr-defined]
```

**Cause:**
`drf-spectacular` exposes `OpenApiTypes` in a way that is not declared in its stubs, triggering a `mypy` error.

**Solution:**
Isolate the import with a `# type: ignore[attr-defined]`:

```python
from drf_spectacular.utils import OpenApiTypes  # type: ignore[attr-defined]
```


---


## ✅ Fix 6: `EventFaqViewSet.update()` – ID Lookup

**Affected file:**

* `events/views.py`

**Problem:**

```bash
error: Incompatible type for lookup 'id': (got "Any | None", expected "UUID | str")  [misc]
```

**Cause:**
The `update()` method retrieves an `id` via `data.get("id")`, whose type is uncertain (`Any | None`), which `mypy` rejects as an argument for `id=...`.

**Solution:**
Use `cast(UUID | str, ...)` to explicitly define the type and satisfy `mypy`:

```python
from typing import cast

faq_id = cast(UUID | str, data.get("id"))
faq = EventFaq.objects.filter(id=faq_id).first()
```

This makes the code clearer without altering its behavior, while ensuring compatibility with strict type checking.

---
## ✅ Fix 7: `GroupAPIView` – Typing and View Compliance

**Affected file:**

* `communities/groups/views.py`

**Encountered problems:**

```bash
error: Function is missing a return type annotation  [no-untyped-def]
error: Incompatible types in assignment (expression has type "tuple[type[IsAuthenticated]]", variable has type "tuple[type[IsAuthenticatedOrReadOnly]]")  [assignment]
error: Incompatible return value type (got "Sequence[_SupportsHasPermission]", expected "list[BasePermission]")  [return-value]
error: Incompatible return value type (got "type[GroupSerializer]", expected "GroupSerializer | GroupPOSTSerializer")  [return-value]
error: "GroupSerializer" not callable  [operator]
```

**Applied solutions:**

- Annotated the `permission_classes` field:

```python
permission_classes: Tuple[Type[BasePermission], ...] = (IsAuthenticatedOrReadOnly,)
```

- Correctly annotated the `get_permissions()` method:

```python
from rest_framework.permissions import _SupportsHasPermission
from collections.abc import Sequence

def get_permissions(self) -> Sequence[_SupportsHasPermission]:
    ...
```

- Fixed `get_serializer_class()` to return the correct types:

```python
def get_serializer_class(self) -> GroupSerializer | GroupPOSTSerializer:
    ...
```

- Added the constructor call to avoid the `"not callable"` error:

```python
serializer = self.get_serializer(page, many=True)
```

---


## ✅ Fix 8: `GroupFlagViewSet` – Typing of Exposed Methods

**Affected file:**

* `communities/groups/views.py`

**Problems:**

```bash
error: Function is missing a return type annotation  [no-untyped-def]
```

**Cause:**
The `GroupFlagViewSet` controller exposes the `create()`, `list()`, `retrieve()`, and `delete()` methods without explicit return type annotations, which violates `mypy` strict rules.

**Solution:**
Add the `-> Response` return type to each of these methods:

```python
def create(self, request: Request) -> Response:
def list(self, request: Request) -> Response:
def retrieve(self, request: Request, pk: str | None) -> Response:
def delete(self, request: Request) -> Response:
```

This ensures consistent typing across all `ModelViewSet`-based views and improves the clarity of the interface contract.


## ✅ Fix 9: `GroupFaqViewSet.update()` – ID Lookup

**Affected file:**

* `communities/groups/views.py`

**Problem:**

```bash
error: Incompatible type for lookup 'id': (got "Any | None", expected "UUID | str")  [misc]
```

**Cause:**
The `update()` method accesses `data.get("id")` to perform a query, but `mypy` cannot guarantee that this field is of type `UUID | str`.

**Solution:**
Use `cast(UUID | str, ...)` to explicitly define the type and satisfy `mypy`:

```python
from typing import cast
from uuid import UUID

faq_id = cast(UUID | str, data.get("id"))
faq = GroupFaq.objects.filter(id=faq_id).first()
```


## ✅ Fix 10: `OrganizationFaqViewSet` – Typing and ID Lookup

**Affected file:**

* `communities/organizations/views.py`

**Fixed problems:**

```bash
error: Function is missing a return type annotation  [no-untyped-def]
error: Incompatible type for lookup 'id': (got "Any | None", expected "UUID | str")  [misc]
```

**Causes:**

* The `retrieve()` and `delete()` methods were not annotated with `-> Response`, triggering a strict error.
* In the `update()` method, the `data.get("id")` identifier was of uncertain type (`Any | None`), causing a type conflict with `id=...` expected as `UUID | str`.

**Solutions:**

* Added the missing annotations:

```python
def retrieve(self, request: Request, pk: str | None) -> Response:
def delete(self, request: Request) -> Response:
```

* Explicitly cast `data.get("id")` using `cast()`:

```python
from typing import cast

faq_id = cast(UUID | str, data.get("id"))
faq = OrganizationFaq.objects.filter(id=faq_id).first()
```

---






