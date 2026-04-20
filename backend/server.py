from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Rioma Bakes API")
api_router = APIRouter(prefix="/api")


# ========== Models ==========
def now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # cakes | cookies | hampers | custom
    description: str
    price: float
    image_url: str
    tags: List[str] = []
    featured: bool = False
    created_at: str = Field(default_factory=now_utc_iso)


class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    quantity: int


class OrderCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    notes: Optional[str] = ""
    items: List[CartItem]
    total: float


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    email: str
    phone: str
    address: str
    city: str
    notes: Optional[str] = ""
    items: List[CartItem]
    total: float
    status: str = "pending"
    created_at: str = Field(default_factory=now_utc_iso)


class CustomOrderCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    occasion: str
    theme: str
    flavour: str
    servings: int
    event_date: str
    budget: Optional[str] = ""
    description: str
    reference_image: Optional[str] = ""  # base64 data URL


class CustomOrder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    email: str
    phone: str
    occasion: str
    theme: str
    flavour: str
    servings: int
    event_date: str
    budget: Optional[str] = ""
    description: str
    reference_image: Optional[str] = ""
    status: str = "new"
    created_at: str = Field(default_factory=now_utc_iso)


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = ""
    subject: str
    message: str
    created_at: str = Field(default_factory=now_utc_iso)


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str
    session_id: str


# ========== Seed Products ==========
SEED_PRODUCTS = [
    {
        "name": "Signature Blush Macarons",
        "category": "cookies",
        "description": "A dozen of our delicate rose and vanilla macarons with a velvety buttercream centre.",
        "price": 28.0,
        "image_url": "https://images.pexels.com/photos/34298814/pexels-photo-34298814.jpeg",
        "tags": ["bestseller", "gift"],
        "featured": True,
    },
    {
        "name": "Valentine Cupcake Box",
        "category": "cakes",
        "description": "Six hand-piped cupcakes in rose, raspberry, and vanilla bean — nestled in a couture pink box.",
        "price": 34.0,
        "image_url": "https://images.pexels.com/photos/31009878/pexels-photo-31009878.jpeg",
        "tags": ["limited", "love"],
        "featured": True,
    },
    {
        "name": "Vanilla Bean Cupcakes",
        "category": "cakes",
        "description": "Classic Madagascar vanilla cupcakes topped with swirls of silk Italian meringue buttercream.",
        "price": 22.0,
        "image_url": "https://images.pexels.com/photos/35227476/pexels-photo-35227476.jpeg",
        "tags": ["classic"],
        "featured": True,
    },
    {
        "name": "Blueberry Lattice Pie",
        "category": "hampers",
        "description": "A rustic lattice-top pie bursting with wild blueberries and a hint of lemon zest.",
        "price": 32.0,
        "image_url": "https://images.pexels.com/photos/5107179/pexels-photo-5107179.jpeg",
        "tags": ["seasonal"],
        "featured": False,
    },
    {
        "name": "Walnut Honey Baklava",
        "category": "cookies",
        "description": "Flaky golden layers soaked in orange-blossom honey with toasted walnuts.",
        "price": 26.0,
        "image_url": "https://images.pexels.com/photos/8635161/pexels-photo-8635161.jpeg",
        "tags": ["nutty"],
        "featured": False,
    },
    {
        "name": "Classic Butter Croissants",
        "category": "hampers",
        "description": "Hand-laminated French butter croissants baked fresh every morning.",
        "price": 18.0,
        "image_url": "https://images.pexels.com/photos/35032379/pexels-photo-35032379.jpeg",
        "tags": ["breakfast"],
        "featured": False,
    },
    {
        "name": "Couture Wedding Cake",
        "category": "custom",
        "description": "Three-tier hand-painted wedding cake with gold leaf and sugar florals. Starts from.",
        "price": 280.0,
        "image_url": "https://images.pexels.com/photos/15346745/pexels-photo-15346745.jpeg",
        "tags": ["bespoke", "weddings"],
        "featured": True,
    },
    {
        "name": "Rainbow Macaron Tower",
        "category": "custom",
        "description": "A showstopping pastel macaron tower — perfect for birthdays and soirées.",
        "price": 140.0,
        "image_url": "https://images.pexels.com/photos/20598678/pexels-photo-20598678.jpeg",
        "tags": ["events", "showpiece"],
        "featured": True,
    },
]


@app.on_event("startup")
async def seed_products():
    existing = await db.products.count_documents({})
    if existing == 0:
        docs = [Product(**p).model_dump() for p in SEED_PRODUCTS]
        await db.products.insert_many(docs)
        logging.info(f"Seeded {len(docs)} products")


# ========== Routes ==========
@api_router.get("/")
async def root():
    return {"message": "Rioma Bakes API", "status": "ok"}


@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    docs = await db.products.find(query, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    order = Order(**payload.model_dump())
    doc = order.model_dump()
    await db.orders.insert_one(doc)
    # Remove any _id mongo may have added on the same dict reference
    doc.pop("_id", None)
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    docs = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/custom-orders", response_model=CustomOrder)
async def create_custom_order(payload: CustomOrderCreate):
    custom = CustomOrder(**payload.model_dump())
    await db.custom_orders.insert_one(custom.model_dump())
    return custom


@api_router.get("/custom-orders", response_model=List[CustomOrder])
async def list_custom_orders():
    docs = await db.custom_orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return msg


# ========== AI Chat ==========
SYSTEM_PROMPT = (
    "You are Rioma, the warm and charming AI concierge for Rioma Bakes — a luxury boutique bakery. "
    "Rioma Bakes specialises in artisanal cakes, cookies, macarons, hampers, and bespoke custom orders for "
    "weddings, birthdays and events. Answer customer questions about products, pricing, delivery, custom orders, "
    "ingredients, and allergens in a friendly, elegant, and concise tone (2-4 sentences). Encourage customers to "
    "place their order via the website cart or fill in the Custom Order form for bespoke requests. If asked about "
    "things outside baking, politely steer the conversation back to desserts and Rioma Bakes."
)


def _format_product_names(products: List[dict], limit: int = 3) -> str:
    names = [p.get("name", "").strip() for p in products if p.get("name")]
    return ", ".join(names[:limit])


def _contains_any(text: str, keywords: List[str]) -> bool:
    return any(word in text for word in keywords)


async def generate_chat_reply(message: str) -> str:
    text = re.sub(r"\s+", " ", message.strip().lower())
    featured_products = await db.products.find(
        {"featured": True}, {"_id": 0, "name": 1, "price": 1, "category": 1}
    ).to_list(20)
    all_products = await db.products.find(
        {}, {"_id": 0, "name": 1, "price": 1, "category": 1, "tags": 1}
    ).to_list(100)

    if _contains_any(text, ["birthday", "recommend", "suggest", "best", "popular"]):
        birthday_items = [
            p for p in all_products
            if p.get("category") in {"cakes", "custom"} or "birthday" in " ".join(p.get("tags", []))
        ]
        picks = birthday_items or featured_products or all_products
        names = _format_product_names(picks)
        return (
            f"For birthdays, I’d start with {names}. "
            "If you want something more personal, our Custom Order form is the best route for colours, flavour, and serving size."
        )

    if _contains_any(text, ["custom", "bespoke", "wedding", "theme", "servings", "tier"]):
        return (
            "We’d love to create something bespoke for you. "
            "Please use the Custom Order form with your occasion, theme, flavour, servings, event date, and any reference image, and we’ll take it from there."
        )

    if _contains_any(text, ["delivery", "deliver", "shipping", "pickup", "pick up"]):
        return (
            "You can place ready-to-order items through the cart, and we’ll use your checkout details for delivery coordination. "
            "For larger celebration cakes or custom work, please send the event date and city through the Custom Order form so we can confirm availability."
        )

    if _contains_any(text, ["allergen", "allergy", "egg", "nuts", "gluten", "dairy", "ingredients"]):
        return (
            "If you have any allergen or ingredient concern, please include it before ordering so we can guide you carefully. "
            "For custom cakes especially, note every dietary requirement in the Custom Order form and we’ll advise on the safest options."
        )

    if _contains_any(text, ["price", "cost", "budget", "how much"]):
        featured = sorted(featured_products or all_products, key=lambda p: p.get("price", 0))
        if featured:
            sample = ", ".join(
                f"{p['name']} from ${p['price']:.0f}" for p in featured[:3] if p.get("name")
            )
            return (
                f"Our menu pricing varies by design and size; a few favourites are {sample}. "
                "For bespoke cakes, share your budget and servings in the Custom Order form and we’ll guide you to the right design."
            )

    if _contains_any(text, ["cake", "cakes", "cupcake", "cupcakes"]):
        cake_items = [p for p in all_products if p.get("category") in {"cakes", "custom"}]
        names = _format_product_names(cake_items or featured_products or all_products)
        return (
            f"Our cake selection includes {names}. "
            "You can order ready-to-order pieces through the cart, or use the Custom Order form if you want something made just for your event."
        )

    if _contains_any(text, ["cookie", "cookies", "macaron", "macarons", "hamper", "gift"]):
        treat_items = [
            p for p in all_products
            if p.get("category") in {"cookies", "hampers"} or "gift" in " ".join(p.get("tags", []))
        ]
        names = _format_product_names(treat_items or featured_products or all_products)
        return (
            f"A few lovely picks are {names}. "
            "You can add them straight to the cart, and if you need gifting help or a larger celebration assortment, send us the details through the contact or custom order form."
        )

    return (
        "I can help with cakes, cookies, hampers, custom orders, pricing, delivery, and dietary notes. "
        "Tell me what you’re planning and I’ll point you to the best order option on the site."
    )


@api_router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    try:
        history_doc = await db.chat_sessions.find_one(
            {"session_id": payload.session_id}, {"_id": 0}
        )
        history = history_doc.get("messages", []) if history_doc else []
        reply = await generate_chat_reply(payload.message)

        history.append({"role": "user", "text": payload.message, "at": now_utc_iso()})
        history.append({"role": "assistant", "text": reply, "at": now_utc_iso()})

        await db.chat_sessions.update_one(
            {"session_id": payload.session_id},
            {"$set": {"session_id": payload.session_id, "messages": history, "updated_at": now_utc_iso()}},
            upsert=True,
        )
        return ChatResponse(reply=reply, session_id=payload.session_id)
    except Exception as e:
        logging.exception("chat failed")
        raise HTTPException(status_code=500, detail=f"chat error: {e}")


# ========== Stats ==========
@api_router.get("/stats")
async def get_stats():
    orders_count = await db.orders.count_documents({})
    custom_count = await db.custom_orders.count_documents({})
    # Fun baseline numbers + live counts
    return {
        "orders_delivered": 2480 + orders_count,
        "happy_customers": 1860 + orders_count,
        "custom_creations": 340 + custom_count,
        "years_baking": 7,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
