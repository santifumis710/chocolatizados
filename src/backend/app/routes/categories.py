"""Read-only categories endpoint backed by a JSON file."""

import json
from functools import lru_cache
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/categories", tags=["categories"])


class CategoryImages(BaseModel):
    semi: str
    white: str
    milk: str


class Category(BaseModel):
    id: str
    title: str
    weight: str
    size: str
    images: CategoryImages


@lru_cache(maxsize=1)
def _load() -> List[Category]:
    candidates = [
        Path(__file__).resolve().parents[2] / "data" / "categories.json",
        Path.cwd() / "src" / "backend" / "data" / "categories.json",
        Path.cwd() / "data" / "categories.json",
    ]
    for path in candidates:
        if path.exists():
            with path.open("r", encoding="utf-8") as f:
                raw = json.load(f)
            return [Category(**item) for item in raw]
    raise FileNotFoundError("categories.json not found")


@router.get("", response_model=List[Category])
@router.get("/", response_model=List[Category])
async def list_categories() -> List[Category]:
    try:
        return _load()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
