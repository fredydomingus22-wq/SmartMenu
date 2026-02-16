import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "online", "agent": "SmartMenu Analytics"}

@pytest.mark.asyncio
async def test_reason_implemented_action():
    # Note: This might require environment variables or mocks for Supabase/OpenAI
    # For now, we just test the structure
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/v1/reason", json={
            "tenant_id": "test-tenant",
            "action": "OPTIMIZE_MENU",
            "payload": {}
        })
    assert response.status_code == 200
    assert "suggested_changes" in response.json()
