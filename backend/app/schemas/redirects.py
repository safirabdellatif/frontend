from __future__ import annotations

import re

from pydantic import BaseModel, field_validator

SLUG_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$")


class RedirectCreateRequest(BaseModel):
    slug: str
    target_path: str
    label: str = ""

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, value: str) -> str:
        slug = value.strip().lower()
        if not SLUG_RE.match(slug):
            raise ValueError("Slug must use lowercase letters, numbers, and hyphens only.")
        return slug

    @field_validator("target_path")
    @classmethod
    def validate_target_path(cls, value: str) -> str:
        path = value.strip()
        if not path.startswith("/"):
            raise ValueError("Target path must start with /.")
        if path.startswith("//") or "://" in path:
            raise ValueError("Target path must be an on-site path.")
        return path


class RedirectUpdateRequest(BaseModel):
    target_path: str
    label: str = ""
    is_active: bool = True

    @field_validator("target_path")
    @classmethod
    def validate_target_path(cls, value: str) -> str:
        path = value.strip()
        if not path.startswith("/"):
            raise ValueError("Target path must start with /.")
        if path.startswith("//") or "://" in path:
            raise ValueError("Target path must be an on-site path.")
        return path


class RedirectResponse(BaseModel):
    slug: str
    target_path: str
    label: str
    is_active: bool
    click_count: int
    created_at: str
    updated_at: str


class PublicRedirectResponse(BaseModel):
    slug: str
    target_path: str
