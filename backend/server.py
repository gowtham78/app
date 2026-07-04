from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Suntek Designs")
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL", "suntekdesigns@gmail.com")

app = FastAPI(title="Suntek Designs API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class EnquiryCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=40)
    property_type: Optional[str] = None
    project_type: Optional[str] = None
    estimated_budget: Optional[str] = None
    preferred_start_date: Optional[str] = None
    message: Optional[str] = Field(default=None, max_length=4000)
    # honeypot — should be empty
    website: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def phone_ok(cls, v: str) -> str:
        if not re.match(r"^[+\d\s\-()]{5,}$", v.strip()):
            raise ValueError("Invalid phone number")
        return v.strip()


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    property_type: Optional[str] = None
    project_type: Optional[str] = None
    estimated_budget: Optional[str] = None
    preferred_start_date: Optional[str] = None
    message: Optional[str] = None
    status: str = "new"
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Email helper ----------
def build_enquiry_email_html(e: Enquiry) -> str:
    def row(label, value):
        if not value:
            return ""
        return f"""
        <tr>
          <td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:13px;color:#5C5C5C;width:180px;border-bottom:1px solid #EEE7DA;">{label}</td>
          <td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:14px;color:#1A1A1A;border-bottom:1px solid #EEE7DA;">{value}</td>
        </tr>
        """

    created = e.created_at.strftime("%d %b %Y, %H:%M UTC")
    return f"""
    <html>
      <body style="margin:0;padding:0;background:#FDFBF7;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF7;padding:32px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #EEE7DA;">
                <tr>
                  <td style="padding:32px;border-bottom:1px solid #EEE7DA;">
                    <div style="font-family:Georgia,serif;font-size:11px;letter-spacing:3px;color:#A68A64;text-transform:uppercase;">Suntek Designs</div>
                    <div style="font-family:Georgia,serif;font-size:26px;color:#1A1A1A;margin-top:8px;">New Project Enquiry</div>
                    <div style="font-family:Arial,sans-serif;font-size:13px;color:#5C5C5C;margin-top:6px;">Received {created}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0 24px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      {row("Full Name", e.full_name)}
                      {row("Email", e.email)}
                      {row("Phone", e.phone)}
                      {row("Property Type", e.property_type)}
                      {row("Project Type", e.project_type)}
                      {row("Estimated Budget", e.estimated_budget)}
                      {row("Preferred Start", e.preferred_start_date)}
                    </table>
                  </td>
                </tr>
                {"" if not e.message else f'''
                <tr>
                  <td style="padding:8px 32px 32px 32px;">
                    <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;color:#A68A64;text-transform:uppercase;margin-bottom:8px;">Message</div>
                    <div style="font-family:Arial,sans-serif;font-size:14px;color:#1A1A1A;line-height:1.6;white-space:pre-wrap;">{e.message}</div>
                  </td>
                </tr>
                '''}
                <tr>
                  <td style="padding:20px 32px;background:#FDFBF7;border-top:1px solid #EEE7DA;font-family:Arial,sans-serif;font-size:12px;color:#8C867B;">
                    Enquiry ID: {e.id}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """


async def send_enquiry_email(e: Enquiry) -> bool:
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not configured; skipping email send")
        return False
    payload = {
        "to": [NOTIFY_EMAIL],
        "subject": f"New Enquiry — {e.full_name}",
        "html": build_enquiry_email_html(e),
        "from_name": EMAIL_FROM_NAME,
        "contact_email": e.email,
    }
    try:
        async with httpx.AsyncClient(timeout=20) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return True
    except Exception as ex:
        logger.error(f"Failed to send enquiry email: {ex}")
        return False


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Suntek Designs API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.post("/enquiries")
async def create_enquiry(payload: EnquiryCreate):
    # honeypot: silently accept but do nothing
    if payload.website:
        logger.info("Honeypot triggered — dropping enquiry silently")
        return {"success": True, "message": "Thank you. We’ve received your project details and our team will contact you shortly."}

    enquiry = Enquiry(**payload.model_dump(exclude={"website"}))

    # Persist first — form must succeed even if email fails
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.enquiries.insert_one(doc)
    except Exception as ex:
        logger.error(f"Failed to save enquiry: {ex}")
        raise HTTPException(status_code=500, detail="Could not save enquiry, please try again.")

    # Fire off email — non-blocking-ish (awaited but tolerant)
    email_sent = await send_enquiry_email(enquiry)
    if email_sent:
        await db.enquiries.update_one({"id": enquiry.id}, {"$set": {"email_sent": True}})

    return {
        "success": True,
        "id": enquiry.id,
        "email_sent": email_sent,
        "message": "Thank you. We’ve received your project details and our team will contact you shortly.",
    }


@api_router.get("/enquiries")
async def list_enquiries(limit: int = 50):
    rows = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return rows


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
