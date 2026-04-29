import { Product } from "@/context/StoreContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Linden Lounge Chair",
    price: 2850,
    originalPrice: 3200,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    category: "Seating",
    material: "Linen / Walnut",
    color: "Oat",
    description:
      "A sculptural lounge chair that marries Scandinavian restraint with artisanal warmth. Crafted from solid walnut with hand-woven linen upholstery.",
    dimensions: "W 82cm × D 88cm × H 76cm",
    tags: ["chair", "lounge", "walnut"],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Arden Coffee Table",
    price: 1650,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-l_brMXgpJhk?w=800&q=80",
    category: "Tables",
    material: "Marble / Brass",
    color: "Ivory",
    description:
      "A refined coffee table with a Calacatta marble top and polished brass base. A statement piece for the considered living room.",
    dimensions: "W 120cm × D 60cm × H 40cm",
    tags: ["table", "marble", "brass"],
    inStock: true,
    isNew: true,
  },
  {
    id: "3",
    name: "Kiso Dining Chair",
    price: 980,
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-2eZJFQpdEgU?w=800&q=80",
    category: "Seating",
    material: "Oak / Leather",
    color: "Cognac",
    description:
      "Understated dining elegance. Solid white oak frame with full-grain leather seat, designed for long, convivial meals.",
    dimensions: "W 48cm × D 52cm × H 82cm",
    tags: ["chair", "dining", "oak"],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "4",
    name: "Solen Floor Lamp",
    price: 720,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-Sv95HH3XUCw?w=800&q=80",
    category: "Lighting",
    material: "Brass / Linen",
    color: "Antique Brass",
    description:
      "An arched floor lamp with a hand-sewn linen shade. Warm ambient glow for reading nooks and living corners.",
    dimensions: "H 178cm × Base Ø 30cm",
    tags: ["lamp", "lighting", "brass"],
    inStock: true,
  },
  {
    id: "5",
    name: "Veld Bookshelf",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-l_brMXgpJhk?w=800&q=80",
    category: "Storage",
    material: "Walnut / Steel",
    color: "Dark Walnut",
    description:
      "An architectural bookshelf with solid walnut shelves and a matte black steel frame. For the collector and the curator.",
    dimensions: "W 180cm × D 35cm × H 210cm",
    tags: ["shelf", "storage", "walnut"],
    inStock: true,
    isNew: true,
  },
  {
    id: "6",
    name: "Havn Sofa",
    price: 5600,
    originalPrice: 6200,
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
    hoverImage: "https://images.unsplash.com/photo-Qw4x2Cu8zgo?w=800&q=80",
    category: "Seating",
    material: "Bouclé / Beech",
    color: "Stone",
    description:
      "Deep, enveloping comfort wrapped in premium bouclé fabric. A sofa designed to anchor a room and outlast every trend.",
    dimensions: "W 240cm × D 95cm × H 78cm",
    tags: ["sofa", "bouclé", "living"],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "7",
    name: "Rime Dining Table",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hoverImage: "https://images.unsplash.com/photo-idXQEOxhmvU?w=800&q=80",
    category: "Tables",
    material: "White Oak",
    color: "Natural Oak",
    description:
      "A generous dining table in solid white oak, with a beautifully grained surface that improves with age and use.",
    dimensions: "W 220cm × D 90cm × H 75cm",
    tags: ["table", "dining", "oak"],
    inStock: false,
  },
  {
    id: "8",
    name: "Nota Side Table",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-TovSmcuAfRM?w=800&q=80",
    category: "Tables",
    material: "Travertine / Steel",
    color: "Warm Stone",
    description:
      "A petite side table with a travertine top and slim steel legs. Effortlessly elegant beside any armchair.",
    dimensions: "Ø 40cm × H 55cm",
    tags: ["table", "side", "travertine"],
    inStock: true,
    isNew: true,
  },
  {
    id: "9",
    name: "Dusk Pendant Light",
    price: 890,
    image:
      "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?q=80&w=1234&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hoverImage: "https://images.unsplash.com/photo-NuDWyXrTT74?w=800&q=80",
    category: "Lighting",
    material: "Blown Glass / Brass",
    color: "Smoke",
    description:
      "Hand-blown smoked glass pendant with a brushed brass fitting. Creates a warm, intimate atmosphere over dining tables.",
    dimensions: "Ø 28cm × H 32cm",
    tags: ["pendant", "lighting", "glass"],
    inStock: true,
  },
  {
    id: "10",
    name: "Reed Armchair",
    price: 1980,
    image:
      "https://plus.unsplash.com/premium_photo-1683140609727-39afd54bda24?q=80&w=1038&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hoverImage: "https://images.unsplash.com/photo-df7jDxCcMNs?w=800&q=80",
    category: "Seating",
    material: "Velvet / Ash",
    color: "Sage",
    description:
      "An upright armchair with a subtle arch back and deep seat cushion. Upholstered in woven velvet for a quietly luxurious touch.",
    dimensions: "W 74cm × D 80cm × H 84cm",
    tags: ["chair", "velvet", "armchair"],
    inStock: true,
  },
  {
    id: "11",
    name: "Plane Writing Desk",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hoverImage: "https://images.unsplash.com/photo-VBHSu01o_s0?w=800&q=80",
    category: "Tables",
    material: "Ash / Leather",
    color: "Natural Ash",
    description:
      "A minimal writing desk with a leather-inlaid top and slim ash legs. For those who take the ritual of work seriously.",
    dimensions: "W 140cm × D 65cm × H 74cm",
    tags: ["desk", "writing", "ash"],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "12",
    name: "Moss Wool Rug",
    price: 1250,
    image:
      "https://images.unsplash.com/photo-1736580602219-03866c53ec2d?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hoverImage: "https://images.unsplash.com/photo-MBf6UIMMx2g?w=800&q=80",
    category: "Textiles",
    material: "Hand-knotted Wool",
    color: "Sage / Cream",
    description:
      "A hand-knotted New Zealand wool rug with a subtle geometric pattern. Grounding, warm, and made to last generations.",
    dimensions: "200cm × 300cm",
    tags: ["rug", "textile", "wool"],
    inStock: true,
  },
];

export const collections = [
  {
    id: "living",
    name: "Living",
    subtitle: "Spaces for gathering",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
  },
  {
    id: "dining",
    name: "Dining",
    subtitle: "Tables set for memory",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
  },
  {
    id: "study",
    name: "Study",
    subtitle: "Objects for thought",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
  },
];
