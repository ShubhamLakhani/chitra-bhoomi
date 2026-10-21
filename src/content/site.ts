/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to change copy, projects and contact details.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Images
 *  ------
 *  Every image slot points at a file inside /public. If that file exists at
 *  build time the photograph is shown; if not, an architectural drawing
 *  ("plate") is rendered in its place. To add a photo, drop the file at the
 *  path listed below — no code changes needed. See /public/images/README.md.
 *
 *  Copy status
 *  -----------
 *  Items marked PROPOSED are draft website copy written for the first version.
 *  They are not verified statements about the firm and should be reviewed
 *  with the business owner before launch.
 */

import type { PlateKind } from "@/components/ArchPlate";

export type SiteImage = {
  /** Path inside /public, e.g. "/images/work/residence-01.jpg" */
  src: string;
  alt: string;
  /** Drawing shown until the photograph is supplied */
  plate: PlateKind;
  /** CSS object-position for cropping the photograph, e.g. "50% 30%" */
  focus?: string;
};

export type Project = {
  slug: string;
  /** PLACEHOLDER titles — replace with real project names */
  title: string;
  category: string;
  summary: string;
  /** Optional facts. Leave undefined until confirmed — undefined fields are hidden. */
  location?: string;
  year?: string;
  scope?: string;
  status?: string;
  cover: SiteImage;
  gallery: SiteImage[];
  /** Controls the editorial layout slot in the Selected Work grid */
  layout: "feature" | "tall" | "portrait" | "wide";
};

export type Testimonial = {
  quote: string;
  name: string;
  context?: string;
};

/* ── Brand & contact (verified details supplied by the client) ─────────────── */

export const site = {
  name: "Chitra Bhoomi Architects",
  wordmark: { primary: "Chitra Bhoomi", secondary: "Architects" },
  disciplines: ["Architecture", "Interior Design", "Landscape Design"],
  city: "Surat, Gujarat",
  description:
    "Chitra Bhoomi Architects is an architecture, interior design and landscape design studio in Surat, Gujarat.",
  contact: {
    phoneDisplay: "090335 56459",
    phoneHref: "tel:+919033556459",
    addressLines: [
      "Vikash Shopper, 421",
      "Near Vraj Chowk, Zeal Park",
      "Nana Varachha, Surat",
      "Gujarat 395013",
    ],
    address: {
      street: "Vikash Shopper, 421, near Vraj Chowk, Zeal Park, Nana Varachha",
      locality: "Surat",
      region: "Gujarat",
      postalCode: "395013",
      country: "IN",
    },
    /** Not yet known — add when confirmed and it will appear in the contact section */
    email: undefined as string | undefined,
    instagram: "https://www.instagram.com/chitrabhoomi_architect/",
    instagramHandle: "@chitrabhoomi_architect",
    facebook: "https://www.facebook.com/people/Chitra-Bhoomi-Architecture/61577153332187/?sk=photos_by",
  },
  nav: [
    { label: "Work", href: "#work" },
    { label: "Studio", href: "#studio" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
};

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const hero = {
  headline: ["Spaces that", "shape the way", "we live."],
  supporting:
    "Thoughtful architecture, considered interiors, and landscapes designed around the way people live.",
  primaryCta: { label: "Explore Our Work", href: "#work" },
  secondaryCta: { label: "Start a Project", href: "#contact" },
  image: {
    src: "/images/hero.jpg",
    alt: "Contemporary multi-storey residence with a white facade, dark vertical louvers and glass balconies at dusk",
    plate: "facade-night",
    focus: "50% 40%",
  } satisfies SiteImage,
  /** Small caption beside the hero image. Replace once the project is named. */
  caption: { label: "Contemporary Residence", note: "Fig. 01" },
};

/* ── Selected Work — PLACEHOLDER titles until real project names arrive ───── */

export const projects: Project[] = [
  {
    slug: "contemporary-residence",
    title: "Contemporary Residence",
    category: "Architecture",
    summary:
      "A multi-storey home composed of white planes, dark vertical louvers and glass balconies, with stone and timber bringing warmth to the street edge.",
    layout: "feature",
    cover: {
      src: "/images/work/contemporary-residence-01.jpg",
      alt: "White residential facade with dark vertical louvers and glass balconies",
      plate: "facade",
    },
    gallery: [
      {
        src: "/images/work/contemporary-residence-02.jpg",
        alt: "Facade detail of louvers and timber soffit",
        plate: "facade-night",
      },
    ],
  },
  {
    slug: "refined-living-spaces",
    title: "Refined Living Spaces",
    category: "Interior Design",
    summary:
      "A living room shaped around soft light, fluted panelling and a calm, restrained palette of materials.",
    layout: "tall",
    cover: {
      src: "/images/work/refined-living-01.jpg",
      alt: "Living room with fluted wall panels, cove lighting and low seating",
      plate: "interior-living",
    },
    gallery: [],
  },
  {
    slug: "modern-residential-architecture",
    title: "Modern Residential Architecture",
    category: "Architecture",
    summary:
      "A layered street elevation that balances privacy and openness through screens, recesses and planted terraces.",
    layout: "portrait",
    cover: {
      src: "/images/work/modern-residential-01.jpg",
      alt: "Modern residence with a stone-clad fin, recessed balconies and a planted terrace",
      plate: "facade-alt",
    },
    gallery: [],
  },
  {
    slug: "contemporary-interiors",
    title: "Contemporary Interiors",
    category: "Interior Design",
    summary:
      "Bedrooms and private rooms detailed with backlit features, tactile finishes and quiet, practical storage.",
    layout: "wide",
    cover: {
      src: "/images/work/contemporary-interiors-01.jpg",
      alt: "Bedroom with an upholstered headboard wall and a circular backlit feature",
      plate: "interior-bedroom",
    },
    gallery: [],
  },
];

/* ── Studio philosophy — PROPOSED copy, review with the owner ─────────────── */

export const philosophy = {
  eyebrow: "Studio",
  statement:
    "Architecture is not just about the spaces we create. It is about the lives that unfold within them.",
  image: {
    src: "/images/studio.jpg",
    alt: "Studio drawing or photograph illustrating the practice's approach",
    plate: "section",
  } satisfies SiteImage,
  intro:
    "We begin with how a day is lived — where the morning light falls, how a family gathers, what needs to be close at hand — and let the building follow.",
  principles: [
    {
      title: "Light",
      text: "Openings, depth and shade are placed to bring in daylight while keeping rooms calm and comfortable.",
    },
    {
      title: "Material",
      text: "Stone, timber, plaster and glass are chosen for how they age, how they feel, and how they work together.",
    },
    {
      title: "Function",
      text: "Plans are organised around real routines, so that every room is easy to use and easy to live with.",
    },
    {
      title: "Proportion",
      text: "Careful dimensions and rhythm give a building its quiet sense of order, inside and out.",
    },
    {
      title: "Everyday living",
      text: "The measure of good design is how it feels on an ordinary day, years after the keys are handed over.",
    },
  ],
};

/* ── Services — PROPOSED descriptions ─────────────────────────────────────── */

export const services = [
  {
    title: "Architecture",
    text: "Homes and buildings conceived as a whole — from the first sketch of the site to the composition of the facade, the plan, and the way each floor meets the street.",
    focus: ["Residential buildings", "Planning & massing", "Facade design"],
    plate: "facade" as PlateKind,
  },
  {
    title: "Interior Design",
    text: "Interiors that carry the architecture inside: considered layouts, tactile materials, lighting and joinery designed for the people who use them.",
    focus: ["Living & private spaces", "Materials & finishes", "Lighting & joinery"],
    plate: "interior-living" as PlateKind,
  },
  {
    title: "Landscape Design",
    text: "Gardens, terraces and thresholds that soften the built edge, bring shade and greenery close, and connect daily life to the outdoors.",
    focus: ["Terraces & courtyards", "Planting", "Outdoor thresholds"],
    plate: "landscape" as PlateKind,
  },
];

/* ── Architecture in Motion — captions for the 3D study model ────────────── */

export const motionChapters = [
  {
    title: "Volume",
    text: "It begins as a quiet composition of white planes, lifted on a stone plinth and set back from the street.",
  },
  {
    title: "Facade",
    text: "Dark vertical louvers filter the sun. Glass balconies open each floor to the air and the street.",
  },
  {
    title: "Structure",
    text: "Peel back the skin and the frame appears — slabs, columns and the rhythm that orders the plan.",
  },
  {
    title: "Interior",
    text: "Inside, light, material and proportion settle into rooms made for everyday life.",
  },
  {
    title: "Landscape & Light",
    text: "Planting softens the edges. At dusk, the house turns its warmth outward.",
  },
];

/* ── Process — PROPOSED copy, not a verified description of the firm's method */

export const processSteps = [
  {
    title: "Discover",
    text: "We listen first — to your needs, your site, your budget and the way you hope to live.",
  },
  {
    title: "Develop",
    text: "Ideas become plans, models and views, refined together until the design feels right.",
  },
  {
    title: "Refine",
    text: "Materials, details, lighting and finishes are resolved so the design can be built well.",
  },
  {
    title: "Deliver",
    text: "We stay involved as the project takes shape, so what is built stays true to what was designed.",
  },
];

/* ── Testimonials — add ONLY verified quotes with the client's permission ─── */

export const testimonials: Testimonial[] = [];

/* ── Enquiry form ─────────────────────────────────────────────────────────── */

export const enquiry = {
  /**
   * Form submission endpoint (e.g. a Formspree or Web3Forms URL).
   * While this is empty, the form validates input but DOES NOT send anything,
   * and tells the visitor so.
   */
  endpoint: process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "",
  projectTypes: [
    "Architecture",
    "Interior Design",
    "Landscape Design",
    "More than one / Not sure yet",
  ],
};
