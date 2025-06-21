# 📌 Pull Request Notes – mypy + django-stubs corrections

## 🗂️ Contexte général

Cette contribution fait suite à l'issue [#1199](https://github.com/activist-org/activist/issues/1199) visant à activer progressivement la vérification des types statiques avec `mypy` et `django-stubs` dans les modules Django du projet activist.

L'objectif est de corriger les erreurs levées lorsque l'option `ignore_errors = true` est temporairement désactivée dans `pyproject.toml`, afin d'avancer vers une configuration plus stricte et fiable.

---

## ✅ Correction 1 : Modèles – champs `flags`

**Fichiers modifiés :**

* `content/models.py`
* `events/models.py`
* `communities/organizations/models.py`
* `communities/groups/models.py`

**Problème :**

```bash
error: Need type annotation for "flags"  [var-annotated]
```

**Cause :** `mypy` ne peut pas inférer le type des champs `ManyToManyField` dynamiques, même avec `django-stubs`.

**Solution :** ajout explicite de l'annotation `Any` pour le champ `flags` :

```python
from typing import Any
...
flags: Any = models.ManyToManyField(
    "authentication.UserModel",
    through="ResourceFlag",  # ou EventFlag, etc. selon le fichier
)
```

Cette approche est classique dans les projets Django utilisant `mypy`, pour désactiver localement la vérification de type sur des champs dynamiques tout en restant compatible avec l'analyse statique globale.

---

## ✅ Correction 2 : `ImageSerializer.create()` – Typage du retour

**Fichier concerné :**

* `content/serializers.py`

**Problème :**

```bash
error: Return type "list[Image]" of "create" incompatible with return type "Image" in supertype "ModelSerializer"  [override]
```

**Cause :**
La méthode `create()` a été surchargée pour gérer plusieurs fichiers envoyés dans une seule requête. Elle retourne une `list[Image]` au lieu d'une instance unique comme l'attend `ModelSerializer`.

**Solution :**
Annotation du type de retour en `Any` pour lever l'erreur tout en préservant le comportement existant :

```python
from typing import Any
...
def create(self, validated_data: Dict[str, Any]) -> Any:
    ...
    return images
```

Un refactoring ultérieur pourrait envisager une méthode `create_many()` pour gérer proprement ce cas.

---

## ✅ Correction 3 : `EventSerializer.validate()` – Comparaison de dates

**Fichier concerné :**

* `events/serializers.py`

**Problèmes :**

```bash
error: Unsupported operand types for > ("datetime" and "int")  [operator]
error: Unsupported operand types for < ("datetime" and "None")  [operator]
```

**Cause :**
La méthode `validate()` effectue des comparaisons avec `>` entre des objets potentiellement typés `datetime`, `str`, `None`, `int`. Cela crée des erreurs de typage pour `mypy`, car il ne peut pas déterminer les types précis dans tous les cas.

**Solution :**
Utilisation de `isinstance(..., datetime)` pour s'assurer que les opérandes sont comparables avant d'utiliser `>` ou `<` :

```python
from datetime import datetime
...
if isinstance(start_dt, datetime) and isinstance(end_dt, datetime):
    if start_dt > end_dt:
        raise serializers.ValidationError(...)

...
if isinstance(creation_dt, datetime) and isinstance(deletion_dt, datetime):
    if creation_dt > deletion_dt:
        raise serializers.ValidationError(...)
```

Cette modification rend le code plus robuste, plus clair, et compatible avec l'analyse stricte de `mypy`.

---

✅ Document à compléter au fur et à mesure des corrections suivantes (serializers, views, etc.).
