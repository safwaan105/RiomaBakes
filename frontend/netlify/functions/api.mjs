import { getStore } from "@netlify/blobs";

const getBlobStore = () => getStore("rioma-bakes");

const PRODUCTS = [
  {
    id: "signature-blush-macarons",
    name: "Signature Blush Macarons",
    category: "cookies",
    description: "A dozen of our delicate rose and vanilla macarons with a velvety buttercream centre.",
    price: 28.0,
    image_url: "https://images.pexels.com/photos/34298814/pexels-photo-34298814.jpeg",
    tags: ["bestseller", "gift"],
    featured: true,
  },
  {
    id: "valentine-cupcake-box",
    name: "Valentine Cupcake Box",
    category: "cakes",
    description: "Six hand-piped cupcakes in rose, raspberry, and vanilla bean nestled in a couture pink box.",
    price: 34.0,
    image_url: "https://images.pexels.com/photos/31009878/pexels-photo-31009878.jpeg",
    tags: ["limited", "love"],
    featured: true,
  },
  {
    id: "vanilla-bean-cupcakes",
    name: "Vanilla Bean Cupcakes",
    category: "cakes",
    description: "Classic Madagascar vanilla cupcakes topped with swirls of silk Italian meringue buttercream.",
    price: 22.0,
    image_url: "https://images.pexels.com/photos/35227476/pexels-photo-35227476.jpeg",
    tags: ["classic"],
    featured: true,
  },
  {
    id: "blueberry-lattice-pie",
    name: "Blueberry Lattice Pie",
    category: "hampers",
    description: "A rustic lattice-top pie bursting with wild blueberries and a hint of lemon zest.",
    price: 32.0,
    image_url: "https://images.pexels.com/photos/5107179/pexels-photo-5107179.jpeg",
    tags: ["seasonal"],
    featured: false,
  },
  {
    id: "walnut-honey-baklava",
    name: "Walnut Honey Baklava",
    category: "cookies",
    description: "Flaky golden layers soaked in orange-blossom honey with toasted walnuts.",
    price: 26.0,
    image_url: "https://images.pexels.com/photos/8635161/pexels-photo-8635161.jpeg",
    tags: ["nutty"],
    featured: false,
  },
  {
    id: "classic-butter-croissants",
    name: "Classic Butter Croissants",
    category: "hampers",
    description: "Hand-laminated French butter croissants baked fresh every morning.",
    price: 18.0,
    image_url: "https://images.pexels.com/photos/35032379/pexels-photo-35032379.jpeg",
    tags: ["breakfast"],
    featured: false,
  },
  {
    id: "couture-wedding-cake",
    name: "Couture Wedding Cake",
    category: "custom",
    description: "Three-tier hand-painted wedding cake with gold leaf and sugar florals. Starts from.",
    price: 280.0,
    image_url: "https://images.pexels.com/photos/15346745/pexels-photo-15346745.jpeg",
    tags: ["bespoke", "weddings"],
    featured: true,
  },
  {
    id: "rainbow-macaron-tower",
    name: "Rainbow Macaron Tower",
    category: "custom",
    description: "A showstopping pastel macaron tower perfect for birthdays and soirees.",
    price: 140.0,
    image_url: "https://images.pexels.com/photos/20598678/pexels-photo-20598678.jpeg",
    tags: ["events", "showpiece"],
    featured: true,
  },
];

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const now = () => new Date().toISOString();

const response = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: HEADERS });

const badRequest = (detail) => response({ detail }, 400);
const notFound = () => response({ detail: "Not found" }, 404);

const normalizePath = (pathname) => pathname.replace(/^\/\.netlify\/functions\/api/, "") || "/";

const readJson = async (key, fallback) => {
  const store = getBlobStore();
  const raw = await store.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeCollection = async (key, value) => {
  const store = getBlobStore();
  await store.set(key, JSON.stringify(value));
};

const requireFields = (payload, fields) => {
  for (const field of fields) {
    if (!payload[field]) return field;
  }
  return null;
};

const makeChatReply = (message) => {
  const text = message.toLowerCase();
  const matchedProduct = PRODUCTS.find((product) =>
    text.includes(product.name.toLowerCase()) ||
    text.includes(product.id.replace(/-/g, " "))
  );

  if (matchedProduct) {
    return `Our ${matchedProduct.name} is ${matchedProduct.category} and starts at $${matchedProduct.price.toFixed(2)}. ${matchedProduct.description} You can order it directly from the shop or send a custom request if you want a tailored variation.`;
  }

  if (text.includes("delivery") || text.includes("deliver") || text.includes("same day")) {
    return "We confirm delivery details after checkout by WhatsApp or email. Share your city and preferred date in checkout notes and we will arrange the sweetest option available.";
  }

  if (text.includes("custom") || text.includes("bespoke") || text.includes("wedding") || text.includes("birthday")) {
    return "For bespoke cakes and event desserts, use the Custom Order page with your theme, servings, flavour, and inspiration image. We review every request personally and reply with a plan within 24 hours.";
  }

  if (text.includes("allergen") || text.includes("egg") || text.includes("nut") || text.includes("gluten")) {
    return "Please include allergy details in your order notes or custom request. We will confirm ingredient guidance before production, especially for nut-sensitive or celebration orders.";
  }

  if (text.includes("price") || text.includes("cost") || text.includes("budget")) {
    return "Our ready-to-order menu shows fixed starting prices, while custom cakes are quoted based on size, design, and finish. If you share your budget on the Custom Order form, we can suggest the prettiest fit.";
  }

  return "We offer cakes, cookies, hampers, macarons, and bespoke dessert tables. Ask me about flavours, delivery, custom orders, or a specific item from the shop and I will point you in the right direction.";
};

export default async (request) => {
  const url = new URL(request.url);
  const path = normalizePath(url.pathname);
  const method = request.method.toUpperCase();

  if (method === "GET" && path === "/products") {
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");
    let items = PRODUCTS;

    if (category) {
      items = items.filter((item) => item.category === category);
    }

    if (featured !== null) {
      const isFeatured = featured === "true";
      items = items.filter((item) => item.featured === isFeatured);
    }

    return response(items);
  }

  if (method === "GET" && path.startsWith("/products/")) {
    const productId = decodeURIComponent(path.split("/").pop() || "");
    const product = PRODUCTS.find((item) => item.id === productId);
    return product ? response(product) : notFound();
  }

  if (method === "POST" && path === "/orders") {
    const payload = await request.json();
    const missing = requireFields(payload, ["customer_name", "email", "phone", "address", "city"]);
    if (missing) return badRequest(`Missing field: ${missing}`);
    if (!Array.isArray(payload.items) || payload.items.length === 0) return badRequest("Order items are required");

    const orders = await readJson("orders.json", []);
    const order = {
      id: crypto.randomUUID(),
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      notes: payload.notes || "",
      items: payload.items,
      total: Number(payload.total || 0),
      status: "pending",
      created_at: now(),
    };

    orders.unshift(order);
    await writeCollection("orders.json", orders);
    return response(order, 201);
  }

  if (method === "POST" && path === "/custom-orders") {
    const payload = await request.json();
    const missing = requireFields(payload, ["customer_name", "email", "phone", "occasion", "theme", "flavour", "servings", "description"]);
    if (missing) return badRequest(`Missing field: ${missing}`);

    const customOrders = await readJson("custom-orders.json", []);
    const customOrder = {
      id: crypto.randomUUID(),
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      occasion: payload.occasion,
      theme: payload.theme,
      flavour: payload.flavour,
      servings: Number(payload.servings || 0),
      event_date: payload.event_date || "",
      budget: payload.budget || "",
      description: payload.description,
      reference_image: payload.reference_image || "",
      status: "new",
      created_at: now(),
    };

    customOrders.unshift(customOrder);
    await writeCollection("custom-orders.json", customOrders);
    return response(customOrder, 201);
  }

  if (method === "POST" && path === "/contact") {
    const payload = await request.json();
    const missing = requireFields(payload, ["name", "email", "subject", "message"]);
    if (missing) return badRequest(`Missing field: ${missing}`);

    const messages = await readJson("contact-messages.json", []);
    const contactMessage = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      subject: payload.subject,
      message: payload.message,
      created_at: now(),
    };

    messages.unshift(contactMessage);
    await writeCollection("contact-messages.json", messages);
    return response(contactMessage, 201);
  }

  if (method === "GET" && path === "/stats") {
    const orders = await readJson("orders.json", []);
    const customOrders = await readJson("custom-orders.json", []);

    return response({
      orders_delivered: 2480 + orders.length,
      happy_customers: 1860 + orders.length,
      custom_creations: 340 + customOrders.length,
      years_baking: 7,
    });
  }

  if (method === "POST" && path === "/chat") {
    const payload = await request.json();
    if (!payload.session_id || !payload.message) {
      return badRequest("session_id and message are required");
    }

    const sessions = await readJson("chat-sessions.json", {});
    const history = sessions[payload.session_id] || [];
    const reply = makeChatReply(payload.message);
    const updatedHistory = [
      ...history,
      { role: "user", text: payload.message, at: now() },
      { role: "assistant", text: reply, at: now() },
    ].slice(-12);

    sessions[payload.session_id] = updatedHistory;
    await writeCollection("chat-sessions.json", sessions);

    return response({ reply, session_id: payload.session_id });
  }

  if (method === "GET" && path === "/") {
    return response({ message: "Rioma Bakes Netlify API", status: "ok" });
  }

  return notFound();
};
