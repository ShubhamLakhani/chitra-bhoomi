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
  /** "visualisation" for 3D renders, "photograph" for camera images — renders are labelled on the site */
  kind?: "visualisation" | "photograph";
  /** Brightness where text overlaps the image (hero only); "light" keeps the headline in ink */
  tone?: "light" | "dark";
  /** Pixel size of the web copy, so the project view can show the full frame */
  width?: number;
  height?: number;
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
  layout: "feature" | "tall" | "portrait" | "wide" | "closing";
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
  /** The firm's advertised services, and the official service line shown with the logo */
  disciplines: ["Architecture", "Interior Design", "Structure"],
  serviceLine: "Architects | Interior Design | Structure",
  city: "Surat, Gujarat",
  description:
    "Chitra Bhoomi Architects is a studio for architecture, interior design and structure in Surat, Gujarat.",
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
    "Thoughtful architecture, considered interiors and sound structure, designed around the way people live.",
  primaryCta: { label: "Explore Our Work", href: "#work" },
  secondaryCta: { label: "Start a Project", href: "#contact" },
  image: {
    src: "/images/hero-contemporary-residence.jpg",
    alt: "Architectural visualisation of a three-storey residence with a brick-toned vertical fin, timber soffits, glass balconies and a lattice screen at street level",
    plate: "facade-night",
    focus: "51% 50%",
    kind: "visualisation",
    tone: "light",
    width: 3200,
    height: 1777,
  } satisfies SiteImage,
  /** Small caption beside the hero image. Replace once the project is named. */
  caption: { label: "Contemporary Residence", note: "Fig. 01" },
};

/* ── Selected Work — generic titles; project names and facts to be confirmed ─
 *  Images are architectural visualisations supplied by the studio. Source
 *  references (CB-xxx) live in the private review folder, not in this repo. */

const vis = (src: string, alt: string, width: number, height: number, focus?: string): SiteImage => ({
  src,
  alt,
  plate: "facade",
  kind: "visualisation",
  width,
  height,
  focus,
});

export const projects: Project[] = [
  {
    slug: "contemporary-residence",
    title: "Contemporary Residence",
    category: "Architecture",
    summary:
      "A three-storey residence composed of a brick-toned vertical fin, timber-lined soffits and glass balconies, with a lattice screen giving the street-level frontage privacy.",
    layout: "feature",
    cover: vis(
      "/images/work/contemporary-residence-view-02.jpg",
      "Architectural visualisation of the residence from the street, showing the brick-toned fin, glass balconies and white side wall",
      2400,
      1333,
      "59% 50%",
    ),
    gallery: [
      vis(
        "/images/hero-contemporary-residence.jpg",
        "Architectural visualisation of the residence's front elevation, with timber soffits, glass balconies and a lattice screen",
        3200,
        1777,
      ),
      vis(
        "/images/work/contemporary-residence-view-03.jpg",
        "Architectural visualisation of the residence from the opposite side of the street, framed by trees",
        2400,
        1333,
      ),
    ],
  },
  {
    slug: "apartment-balcony-bath",
    title: "Bath & Balcony",
    category: "Interior Design",
    summary:
      "A bathroom in patterned marble-look tile with copper fittings behind a black-framed glass screen, alongside a covered balcony that brings planting and a swing seat to the edge of the view.",
    layout: "tall",
    cover: vis(
      "/images/work/apartment-balcony-bath-shower-room.jpg",
      "Architectural visualisation of a bathroom seen through a black-framed glass screen, with a copper shower, marble-look tiles and a vanity beyond",
      1800,
      2400,
    ),
    gallery: [
      vis(
        "/images/work/apartment-balcony-bath-balcony.jpg",
        "Architectural visualisation of a covered balcony with a timber-slat ceiling, a hanging swing seat and wall planters",
        1920,
        1080,
      ),
    ],
  },
  {
    slug: "refined-living-spaces",
    title: "Refined Living Spaces",
    category: "Interior Design",
    summary:
      "A living room composed around a long, low sofa, textured walls, framed artwork and timber screens, in a quiet palette of grey, white and warm wood.",
    layout: "portrait",
    cover: vis(
      "/images/work/refined-living-spaces-living-room.jpg",
      "Architectural visualisation of a living room with a long white sofa, framed artwork and timber screen panels",
      2400,
      1481,
      "50% 50%",
    ),
    gallery: [],
  },
  {
    slug: "contemporary-interiors",
    title: "Contemporary Interiors",
    category: "Interior Design",
    summary:
      "A bedroom detailed with a stone-look feature wall, slim brass inlays, a backlit headboard and an illuminated mirror.",
    layout: "wide",
    cover: vis(
      "/images/work/contemporary-interiors-bedroom.jpg",
      "Architectural visualisation of a bedroom with a stone-look feature wall, brass inlays, a backlit headboard and a lit mirror",
      2400,
      1350,
    ),
    gallery: [],
  },
  {
    slug: "apartment-living-dining",
    title: "Apartment Living & Dining",
    category: "Interior Design",
    summary:
      "An open living and dining space: a corner sofa set against a full-height window, sculptural bird wall lights, and a dining table beside an L-shaped kitchen.",
    layout: "closing",
    cover: vis(
      "/images/work/apartment-living-dining-living-room.jpg",
      "Architectural visualisation of a living room with a corner sofa, full-height window, sculptural bird wall lights and indoor plants",
      2400,
      1350,
      "50% 55%",
    ),
    gallery: [
      vis(
        "/images/work/apartment-living-dining-kitchen-dining.jpg",
        "Architectural visualisation of a kitchen and dining area with a marble-topped table, upholstered chairs, dark timber storage and a window over the counter",
        1920,
        1080,
      ),
    ],
  },
];

/* ── Studio philosophy — PROPOSED copy, review with the owner ─────────────── */

export const philosophy = {
  eyebrow: "Studio",
  statement:
    "Architecture is not just about the spaces we create. It is about the lives that unfold within them.",
  image: {
    src: "/images/studio.jpg",
    alt: "Section through a multi-storey house",
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
    title: "Structure",
    text: "Structure considered as part of the design from the first drawing, so the frame, spans and supports work with the architecture and the building can be built soundly.",
    focus: ["Structural planning", "Frame & spans", "Buildability"],
    plate: "section" as PlateKind,
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
    title: "Material & Light",
    text: "Stone, timber and glass settle into the changing light. At dusk, the house turns its warmth outward.",
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
    "Structure",
    "More than one / Not sure yet",
  ],
};
