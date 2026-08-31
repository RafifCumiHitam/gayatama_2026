import pytest
import io
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.core.config import settings

# Setup SQLite in-memory test database for fast isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_auth_and_documents_flow():
    # 1. Register User A
    reg_a = client.post("/api/v1/auth/register", json={
        "email": "userA@example.com",
        "password": "Password123!",
        "display_name": "User A"
    })
    assert reg_a.status_code == 201
    assert reg_a.json()["email"] == "userA@example.com"

    # Duplicate registration check
    reg_dup = client.post("/api/v1/auth/register", json={
        "email": "userA@example.com",
        "password": "Password123!"
    })
    assert reg_dup.status_code == 400

    # 2. Login User A
    login_a = client.post("/api/v1/auth/login", json={
        "email": "userA@example.com",
        "password": "Password123!"
    })
    assert login_a.status_code == 200
    token_a = login_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 3. Authenticated /auth/me
    me_response = client.get("/api/v1/auth/me", headers=headers_a)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "userA@example.com"

    # 4. Upload valid PDF document as User A
    import fitz
    doc_fitz = fitz.open()
    doc_fitz.new_page().insert_text((50, 50), "Test PDF content for ReadAble Phase 1A")
    pdf_bytes = doc_fitz.tobytes()
    doc_fitz.close()

    files = {"file": ("test_doc.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    upload_res = client.post("/api/v1/documents", headers=headers_a, files=files)
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    doc_id = doc_data["id"]
    assert doc_data["original_filename"] == "test_doc.pdf"
    assert doc_data["processing_status"] == "COMPLETED"
    assert doc_data["latest_job"]["status"] == "COMPLETED"

    # 5. List documents for User A
    list_res = client.get("/api/v1/documents", headers=headers_a)
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # 6. Register & Login User B
    client.post("/api/v1/auth/register", json={
        "email": "userB@example.com",
        "password": "Password123!"
    })
    login_b = client.post("/api/v1/auth/login", json={
        "email": "userB@example.com",
        "password": "Password123!"
    })
    token_b = login_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 7. Security Check: User B cannot access User A's document
    doc_b_res = client.get(f"/api/v1/documents/{doc_id}", headers=headers_b)
    assert doc_b_res.status_code == 404

    # 8. Delete document as User A
    del_res = client.delete(f"/api/v1/documents/{doc_id}", headers=headers_a)
    assert del_res.status_code == 200

    # 9. Verify deletion
    doc_deleted_res = client.get(f"/api/v1/documents/{doc_id}", headers=headers_a)
    assert doc_deleted_res.status_code == 404
