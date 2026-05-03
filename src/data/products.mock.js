const DEFAULT_PRINT_AREA = {
  x: 170,
  y: 180,
  width: 480,
  height: 520,
}

const makeViews = (front, back, sleeve) => [
  { id: 'front', label: 'Front', imageUrl: front, printArea: DEFAULT_PRINT_AREA },
  { id: 'back', label: 'Back', imageUrl: back || front, printArea: DEFAULT_PRINT_AREA },
  { id: 'sleeve', label: 'Sleeve', imageUrl: sleeve || front, printArea: DEFAULT_PRINT_AREA },
]

export const PRODUCTS_MOCK = [
  {
    id: 1,
    slug: 'classic-custom-hoodie',
    name: 'Classic Custom Hoodie',
    vendor: 'Frill Custom Apparel',
    category: 'hoodie',
    price: 2499,
    oldPrice: 3200,
    desc: 'Premium 320 GSM fleece hoodie — the canvas for your greatest design yet.',
    longDesc: 'Our most popular base garment featuring a double-lined hood and heavy-duty drawstrings.',
    badge: 'BESTSELLER',
    badgeVariant: 'new',
    stars: 4.9,
    reviews: 312,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    customizable: true,
    tags: ['bestseller', 'fleece', 'hoodie'],
    colors: [
      {
        id: 'purple',
        name: 'Royal Purple',
        hex: '#3B1F5E',
        views: makeViews(
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&auto=format&fit=crop&q=80'
        ),
      },
      {
        id: 'black',
        name: 'Midnight Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80'
        ),
      },
    ],
  },
  {
    id: 2,
    slug: 'signature-unisex-tee',
    name: 'Signature Unisex Tee',
    vendor: 'Frill Custom Apparel',
    category: 'tshirt',
    price: 1199,
    oldPrice: null,
    badge: 'CUSTOM',
    badgeVariant: 'custom',
    stars: 4.8,
    reviews: 580,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    desc: '180 GSM combed cotton — soft, durable, and print-ready.',
    customizable: true,
    tags: ['tshirt', 'cotton'],
    colors: [
      {
        id: 'white',
        name: 'Cloud White',
        hex: '#ffffff',
        views: makeViews(
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop&q=80'
        ),
      },
      {
        id: 'black',
        name: 'Jet Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop&q=80'
        ),
      },
    ],
  },
  {
    id: 3,
    slug: 'urban-oversized-tee',
    name: 'Urban Oversized Tee',
    vendor: 'Frill Streetwear',
    category: 'tshirt',
    price: 1599,
    oldPrice: 1899,
    badge: 'NEW DROP',
    badgeVariant: 'new',
    stars: 4.7,
    reviews: 145,
    sizes: ['S', 'M', 'L', 'XL'],
    desc: 'Dropped shoulders and a boxy fit for that high-end streetwear look.',
    customizable: true,
    tags: ['streetwear', 'oversized', 'tshirt'],
    colors: [
      {
        id: 'ink',
        name: 'Ink Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&auto=format&fit=crop&q=80'
        ),
      },
      {
        id: 'lavender',
        name: 'Lavender Mist',
        hex: '#5A3087',
        views: makeViews(
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&auto=format&fit=crop&q=80'
        ),
      },
    ],
  },
  {
    id: 4,
    slug: 'retro-varsity-jacket',
    name: 'Retro Varsity Jacket',
    vendor: 'Frill Custom Apparel',
    category: 'jacket',
    price: 4999,
    oldPrice: 6500,
    badge: 'PREMIUM',
    badgeVariant: 'custom',
    stars: 5.0,
    reviews: 89,
    sizes: ['M', 'L', 'XL', '2XL'],
    desc: 'Wool blend body with vegan leather sleeves. Fully customizable back embroidery.',
    customizable: true,
    tags: ['jacket', 'premium', 'winter'],
    colors: [
      {
        id: 'purple',
        name: 'Royal Purple',
        hex: '#3B1F5E',
        views: makeViews(
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80'
        ),
      },
      {
        id: 'black',
        name: 'Midnight Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80'
        ),
      },
    ],
  },
  {
    id: 5,
    slug: 'tech-zip-hoodie',
    name: 'Tech-Zip Hoodie',
    vendor: 'Frill Sport',
    category: 'hoodie',
    price: 2899,
    oldPrice: null,
    badge: null,
    badgeVariant: null,
    stars: 4.6,
    reviews: 210,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    desc: 'Sleek, moisture-wicking fabric with hidden zip pockets.',
    customizable: false,
    tags: ['hoodie', 'activewear', 'zip-up'],
    colors: [
      {
        id: 'charcoal',
        name: 'Charcoal',
        hex: '#2D1F45',
        views: makeViews(
          'https://images.unsplash.com/photo-1647771746277-eac927afab2c?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ),
      },
      {
        id: 'black',
        name: 'Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://images.unsplash.com/photo-1647771746277-eac927afab2c?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ),
      },
    ],
  },
]
