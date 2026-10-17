# SPDX-License-Identifier: AGPL-3.0-or-later
from __future__ import annotations

import itertools

import pytest

from authentication import enums
from communities import permissions, services

# --- in-memory fakes ------------------------------------------------------


class _Rows(list):
    def filter(self, **kw):
        return _Rows(
            o for o in self if all(getattr(o, k, None) == v for k, v in kw.items())
        )

    def exclude(self, **kw):
        return _Rows(
            o for o in self if not all(getattr(o, k, None) == v for k, v in kw.items())
        )

    def first(self):
        return self[0] if self else None

    def count(self):
        return len(self)

    def exists(self):
        return bool(self)


class _Manager:
    def __init__(self, model):
        self.model = model
        self.rows = _Rows()

    def filter(self, **kw):
        return self.rows.filter(**kw)

    def create(self, **kw):
        obj = self.model(**kw)
        self.rows.append(obj)
        return obj

    def get_or_create(self, defaults=None, **kw):
        existing = self.filter(**kw).first()
        if existing is not None:
            return existing, False
        return self.create(**{**kw, **(defaults or {})}), True


_pk = itertools.count(1)


class _MemberBase:
    def __init__(self, user, role, **scope):
        self.user = user
        self.role = role
        self.pk = next(_pk)
        for k, v in scope.items():
            setattr(self, k, v)

    @property
    def role_level(self):
        return enums.MEMBERSHIP_ROLE_LEVELS[enums.MembershipRole(self.role)]

    def save(self, update_fields=None):
        pass


class FakeOrganizationMember(_MemberBase):
    pass


class FakeGroupMember(_MemberBase):
    pass


class FakeUser:
    def __init__(self, username="user", is_authenticated=True, is_admin=False):
        self.username = username
        self.is_authenticated = is_authenticated
        self.is_admin = is_admin


class FakeOrg:
    def __init__(self, name="Acme"):
        self.name = name


class FakeGroup:
    def __init__(self, org, name="Engineering"):
        self.org = org
        self.name = name


@pytest.fixture(autouse=True)
def _fake_models(monkeypatch):
    """Fresh membership tables per test, patched into the modules under test."""
    monkeypatch.setattr(
        FakeOrganizationMember,
        "objects",
        _Manager(FakeOrganizationMember),
        raising=False,
    )
    monkeypatch.setattr(
        FakeGroupMember, "objects", _Manager(FakeGroupMember), raising=False
    )
    for module in (permissions, services):
        monkeypatch.setattr(module, "OrganizationMember", FakeOrganizationMember)
        monkeypatch.setattr(module, "GroupMember", FakeGroupMember)


@pytest.fixture
def role():
    return enums.MembershipRole


@pytest.fixture
def org():
    return FakeOrg()


@pytest.fixture
def group(org):
    return FakeGroup(org=org)


@pytest.fixture
def anon_user():
    return FakeUser("anonymous", is_authenticated=False)


@pytest.fixture
def site_admin():
    return FakeUser("site-admin", is_admin=True)


@pytest.fixture
def make_user():
    return lambda username="user": FakeUser(username)


@pytest.fixture
def make_org():
    return lambda name="Other": FakeOrg(name)


@pytest.fixture
def make_group():
    return lambda org, name="Other group": FakeGroup(org, name)


@pytest.fixture
def make_org_member():
    def _make(org, role, username="org-member"):
        return FakeOrganizationMember.objects.create(
            org=org, user=FakeUser(username), role=role
        )

    return _make


@pytest.fixture
def make_group_member():
    def _make(group, role, username="group-member"):
        return FakeGroupMember.objects.create(
            group=group, user=FakeUser(username), role=role
        )

    return _make
