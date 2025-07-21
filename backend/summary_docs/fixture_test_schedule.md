# Préparation à la contribution : Fixture d’authentification généralisée pour les tests (issue #1270)

## 1. Objectif de la contribution

Créer une fixture Pytest centrale qui permet d’obtenir facilement un client DRF déjà authentifié dans tous les tests, afin de ne plus dupliquer les logiques de création d’utilisateur, login et injection du token.  
La fixture devra être utilisable dans toutes les apps du backend et placée à un endroit stratégique (`backend/conftest.py`).

---

## 2. Synthèse de l’existant

### a. Fichiers et structure des tests

- Chaque app du backend (authentication, content, communities, events, etc.) possède son propre dossier de tests.
- Le seul `conftest.py` existant se trouve dans `core/tests/unit/` et ne sert qu’à fournir un `APIClient` neutre et à désactiver le throttling dans ce sous-dossier.
- Il **n’existe pas encore de fixture globale** pour un client authentifié utilisable dans tous les tests.

### b. Fonctionnement actuel dans les tests

- Beaucoup de tests (notamment dans `authentication/tests/test_auth.py` et `authentication/tests/flag/`) créent un client DRF, effectuent un login manuel (POST sur `/v1/auth/sign_in`) pour obtenir un token, puis injectent ce token via `client.credentials(...)`.
- Ce pattern est répété dans de nombreux fichiers/tests → **redondance**.

### c. PR précédente (#1280)

- Un contributeur avait proposé une fixture similaire, mais la PR n’a pas été mergée, principalement à cause :
    - de tests écrits contre des endpoints qui n’existent pas,
    - de l’absence de généralisation dans l’ensemble du projet,
    - de conflits de branche et de tests échoués.
- Les mainteneurs valident l’idée, mais attendent une approche plus propre et intégrée.

---

## 3. Stratégie retenue

1. **Documentation & investigation** :
    - Revue de l’arborescence du backend.
    - Analyse de la présence/portée des `conftest.py`.
    - Mapping des tests qui bénéficieraient d’une fixture d’authentification.
    - Lecture critique de la PR #1280 et de ses erreurs.

2. **Définition des besoins** :
    - Une fixture qui retourne un `APIClient` déjà authentifié (via token ou `force_authenticate` selon le besoin).
    - Accessible globalement à tous les tests du backend.
    - Utilisable d’abord dans `authentication/tests/test_auth.py` et les tests du dossier `flag/`, puis généralisable.

3. **Prochaine étape** :
    - Création d’une branche dédiée (`feature/authenticated-test-client-fixture` ou similaire).
    - Ecriture de la fixture dans `backend/conftest.py`.
    - Refactoring de quelques tests existants pour démontrer l’usage.
    - Documentation de l’approche, et explication des choix faits dans la PR.

---

## 4. Décisions clés pour la suite

- Ne pas repartir exactement sur le code de la PR précédente, mais s’appuyer sur les leçons tirées (endpoints réels, intégration propre, factorisation progressive).
- Documenter chaque étape et les motivations (clarté, DRY, DX).
- Prévenir dans l’issue #1270 que la démarche s’appuie sur une investigation poussée de l’existant, et vise à proposer une solution plus robuste et intégrée.

---

**Auteur du document** :  
hericlibong  
**Date** : 2025-07-20



# Contribution Plan: Universal authenticated_client Fixture for Activist Tests

## 1. Objective

Implement a reusable pytest fixture to provide an authenticated DRF APIClient for all backend tests, eliminating redundant authentication code and improving developer experience (DX).

---

## 2. Analysis of the Existing Codebase

- Each backend app (authentication, content, communities, events, etc.) has its own test folder.
- Previously, there was no global fixture for authenticated API clients—each test managed authentication manually.
- Our review of authentication/tests/test_auth.py and flag/ subfolder revealed heavy repetition: manual user creation, login, and token injection.
- A previous PR (#1280) attempted to introduce such a fixture, but failed due to:
    - Endpoint mismatches (testing against non-existent endpoints)
    - Partial/generalized usage
    - Merge conflicts and failing tests
- Maintainers approved the *principle* of a global fixture, provided it works with actual endpoints and improves DX.

---

## 3. Approach Taken

- Audited which tests genuinely require an authenticated client (versus anonymous ones).
    - Ex: test_delete_user truly needs a logged-in client; test_sign_up does not.
- Implemented a fixture named `authenticated_client` in `backend/conftest.py`.
    - The fixture creates a test user, force-sets a known password, saves, and logs in to obtain a token.
    - The client is then returned with credentials set for authenticated requests.
- Refactored `test_delete_user` to use the fixture, reducing boilerplate and clarifying intent.

**Early errors encountered:**
- Initial test runs failed because UserFactory does not preserve a usable plaintext password for login.
- Solution: Explicitly set and save a known password after creating the user.
- Docker Compose was also not picking up local changes until a full rebuild and container restart.

---

## 4. Developer Environment Notes

- All development and test operations should use Docker Compose as specified in CONTRIBUTING.md:
    ```bash
    docker compose --env-file .env.dev up backend --build -d
    docker exec -it django_backend sh
    pytest
    ```
- If you see deprecation warnings from factory_boy or DRF, these are upstream and unrelated to this contribution.

---

## 5. Next Steps

- Refactor additional tests in other apps (e.g. flag/, events/) to use the `authenticated_client` fixture.
- Document why only some tests use the authenticated fixture (others remain anonymous by design).

---

## 6. Acknowledgement

This contribution builds upon the investigation of PR #1280 and related reviewer feedback.  
Special care was taken to generalize the fixture for all apps, and to document both the technical and organizational challenges encountered.
