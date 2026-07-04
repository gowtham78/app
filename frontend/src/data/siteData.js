// Centralised site data — sourced from suntekdesigns.com

export const SITE = {
  brand: "Suntek Designs",
  tagline: "Interior design and renovation, crafted with precision since 2007.",
  founded: 2007,
  founder: "MKM Aslam",
  phone: "+65 8463 7889",
  phoneHref: "tel:+6584637889",
  whatsapp: "6584637889",
  whatsappUrl: "https://wa.me/6584637889",
  email: "suntekdesigns@gmail.com",
  addresses: {
    showroom: "160 Changi Rd, #04-04 HexaCube, Singapore 419728",
    workshop: "1 Tampines North Dr. 1, #03-18, Singapore 528559",
  },
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/channel/UCfNU4eV0ez6ko5KlKs_IrTA",
  },
};

export const STATS = [
  { value: 16, suffix: "+", label: "Years of Experience" },
  { value: 3500, suffix: "+", label: "Transformed Spaces" },
  { value: 800, suffix: "+", label: "Happy Clients" },
  { value: 3, suffix: "+", label: "Offices Worldwide" },
];

export const HERO_PANORAMA =
  "https://images.unsplash.com/photo-1648881806148-e5c51179c826?crop=entropy&cs=srgb&fm=jpg&q=90&w=3200";

export const PROJECTS = [
  {
    id: "bayshore",
    title: "The Bayshore",
    location: "Bedok, Singapore",
    category: "Condominium",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1704040686428-7534b262d0d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  },
  {
    id: "tampines",
    title: "Blk 712 Tampines",
    location: "Tampines St 71",
    category: "HDB Resale",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1711873316332-acb6930211e1?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  },
  {
    id: "seahorizon",
    title: "The Sea Horizon",
    location: "Pasir Ris",
    category: "Condominium",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  },
  {
    id: "jurong",
    title: "Blk 469 Jurong West",
    location: "Jurong West",
    category: "HDB Executive Maisonette",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1724582586458-a51791349977?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  },
  {
    id: "central-green",
    title: "The Central Green",
    location: "Toa Payoh",
    category: "Condominium",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1724582586495-d050726cf354?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  },
  {
    id: "sengkang",
    title: "450B Sengkang",
    location: "Sengkang",
    category: "HDB BTO",
    year: "2022",
    image:
      "https://images.unsplash.com/photo-1704040686413-2c607dbd2f06?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  },
];

export const SERVICES = [
  {
    id: "design",
    title: "Interior Design & Planning",
    description:
      "Concept development, spatial layout, mood boards and material palettes — tailored to how you live.",
    image:
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  },
  {
    id: "carpentry",
    title: "Carpentry & Custom Built-ins",
    description:
      "Every cabinet, wardrobe and feature wall is designed and produced in our own workshop for full control over quality.",
    image:
      "https://images.unsplash.com/photo-1724582586458-a51791349977?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  },
  {
    id: "renovation",
    title: "Renovation Works",
    description:
      "Hacking, masonry, tiling, flooring and structural finishing — end-to-end renovation managed under one roof.",
    image:
      "https://images.unsplash.com/photo-1711873316332-acb6930211e1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  },
  {
    id: "mep",
    title: "Electrical & Plumbing",
    description:
      "Licensed electrical rewiring, lighting design, plumbing and water testing that meets BCA & HDB standards.",
    image:
      "https://images.unsplash.com/photo-1724582586495-d050726cf354?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  },
  {
    id: "finishing",
    title: "Finishing & Painting",
    description:
      "Ceiling, painting, doors, windows and detailed finishing — the quiet craftsmanship that defines a premium interior.",
    image:
      "https://images.unsplash.com/photo-1704040686428-7534b262d0d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  },
  {
    id: "commercial",
    title: "Commercial & Residential",
    description:
      "From HDB flats and condominiums to retail, F&B and corporate offices across Singapore.",
    image:
      "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  },
];

export const WHY = [
  { title: "16+ Years of Experience", body: "A long-standing Singapore studio that has evolved with design trends while holding onto craftsmanship." },
  { title: "HDB & BCA Registered", body: "Every project meets Singapore's regulatory standards for safety, compliance and quality." },
  { title: "In-House Carpentry Workshop", body: "Full control over quality, timelines and customisation — no middlemen." },
  { title: "Transparent Pricing", body: "Honest, itemised quotations with clear deliverables. No hidden fees, no surprises." },
  { title: "Professional Team", body: "A dedicated crew of designers, project managers and craftsmen who deliver on time." },
  { title: "Customer-focused Delivery", body: "We stay involved from first sketch to final handover — and long after." },
];

export const PROCESS = [
  { n: "01", title: "Meet Your Designer", body: "We understand your space, lifestyle, requirements and budget over a relaxed on-site or studio consultation." },
  { n: "02", title: "Design & Plan", body: "Concept, layouts, material palettes, 3D visualisation and a fully transparent quotation." },
  { n: "03", title: "Build & Transform", body: "Our in-house team manages every trade — carpentry, electrical, tiling, painting — from start to finish." },
  { n: "04", title: "Reveal & Handover", body: "We walk you through your completed space and stay on-call long after you move in." },
];

export const TESTIMONIALS = [
  {
    quote:
      "A dedicated team, passionate about transforming our home into a functional, beautiful and personal space. With a keen eye for detail and total commitment to quality — from concept to completion.",
    name: "Leewt Pool",
    meta: "Residential, Singapore",
  },
  {
    quote:
      "Before-and-after magic by Imran and the Suntek team. Our place is relatively old, there was much to do, and they went out of their way to accommodate every requirement.",
    name: "Samuel Ng",
    meta: "HDB Resale, Singapore",
  },
  {
    quote:
      "Absolutely exceptional. Professional, meticulous with detail and endlessly patient. Practical tips, creative ideas and dedication — they transformed our 28-year-old resale place into our dream home.",
    name: "Tan Stella",
    meta: "Resale Apartment, Singapore",
  },
  {
    quote:
      "From start to finish the process was smooth, professional and stress-free. Kitchen, bathrooms, vinyl flooring and finishing — every detail brought to life with modern, timeless craft.",
    name: "Taufik Shaikh",
    meta: "Full Home Renovation, Singapore",
  },
  {
    quote:
      "Top-notch quality with no hidden fees. Their commitment to customer satisfaction is genuinely commendable.",
    name: "Nazir Nathaniel Hub-Khan",
    meta: "Residential, Singapore",
  },
];

export const BEFORE_AFTER = {
  before:
    "https://images.unsplash.com/photo-1634586648651-f1fb9ec10d90?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
  after:
    "https://images.unsplash.com/photo-1704040686428-7534b262d0d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
};

export const CTA_IMAGE =
  "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=srgb&fm=jpg&q=90&w=2600";
