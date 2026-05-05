const DEFAULT_PRINT_AREA = {
  x: 170,
  y: 180,
  width: 480,
  height: 520,
}

function createPrintArea() {
  return { ...DEFAULT_PRINT_AREA }
}

const makeViews = (front, back, sleeve) => [
  { id: 'front', label: 'Front', imageUrl: front, printArea: createPrintArea() },
  { id: 'back', label: 'Back', imageUrl: back || front, printArea: createPrintArea() },
  { id: 'sleeve', label: 'Sleeve', imageUrl: sleeve || front, printArea: createPrintArea() },
]

const RAW_PRODUCTS_MOCK = [
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
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80'
        ),
      },
      {
        id: 'black',
        name: 'Midnight Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80',
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
          'https://i.pinimg.com/1200x/e9/66/35/e96635bd54e47436ae446ba05c1de421.jpg'
        ),
      },
      {
        id: 'lavender',
        name: 'Lavender Mist',
        hex: '#5A3087',
        views: makeViews(
          'https://i.pinimg.com/736x/7c/83/f0/7c83f06af13e1792b4a90ad7755b1032.jpg'
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
          'https://i.pinimg.com/1200x/5a/ea/f6/5aeaf668443d3b7ce988effe2d17c0e3.jpg'
        ),
      },
      {
        id: 'black',
        name: 'Midnight Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://i.pinimg.com/1200x/da/1d/34/da1d34730d9bccbf558684d275fef9eb.jpg'
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
          'https://i.pinimg.com/1200x/00/3b/42/003b422d5a4943e1feebbb01162ad3a7.jpg'
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
  {
    id: 6,
    slug: 'urban-oversized-stripped-tee',
    name: 'Urban Oversized Stripped Tee',
    vendor: 'Frill Custom Apparel',
    category: 'tshirt',
    price: 1399,
    oldPrice: 1899,
    badge: 'SALE',
    badgeVariant: 'sale',
    stars: 4.7,
    reviews: 245,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    desc: '200 GSM heavyweight cotton - perfect for statement prints.',
    customizable: true,
    tags: ['tshirt', 'oversized', 'cotton'],
    colors: [
      {
        id: 'cream',
        name: 'Cream',
        hex: '#FFF8E7',
        views: makeViews(
          'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ),
      },
      {
        id: 'sage',
        name: 'Sage Green',
        hex: '#9CAF88',
        views: makeViews(
          'https://res.cloudinary.com/devz7t6qd/image/upload/v1777989991/nwgvrwjwf0bh4flccmkj.jpg'
        ),
      },
      {
        id: 'navy',
        name: 'Navy Blue',
        hex: '#0A3161',
        views: makeViews(
          'https://res.cloudinary.com/devz7t6qd/image/upload/v1777990094/pnvsf37uor2t5tzvzsor.jpg'
        ),
      },
    ],
  },
  {
    id: 7,
    slug: 'polo-performance-shirt',
    name: 'Polo Performance Shirt',
    vendor: 'Frill Sport',
    category: 'polo',
    price: 1599,
    oldPrice: null,
    badge: 'NEW',
    badgeVariant: 'new',
    stars: 4.5,
    reviews: 89,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    desc: 'Classic polo with moisture-wicking technology for active comfort.',
    customizable: true,
    tags: ['polo', 'activewear', 'performance'],
    colors: [
      {
        id: 'magenta',
        name: 'Magenta',
        hex: '#E5208C',
        views: makeViews(
          'https://i.pinimg.com/1200x/5c/ee/7f/5cee7f7399120dce0f15c387e19c6dc4.jpg'
        ),
      },
      {
        id: 'coral',
        name: 'Coral',
        hex: '#FF6B6B',
        views: makeViews(
          'https://images.unsplash.com/photo-1671438118097-479e63198629?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ),
      },
    ],
  },
  {
    id: 8,
    slug: 'premium-sweatshirt',
    name: 'Premium Sweatshirt',
    vendor: 'Frill Custom Apparel',
    category: 'hoodie',
    price: 1999,
    oldPrice: 2699,
    badge: 'SALE',
    badgeVariant: 'sale',
    stars: 4.8,
    reviews: 445,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    desc: '280 GSM fleece sweatshirt with embroidered branding',
    customizable: true,
    tags: ['sweatshirt', 'fleece', 'comfortable'],
    colors: [
      {
        id: 'heather-grey',
        name: 'Heather Grey',
        hex: '#8B8B8B',
        views: makeViews(
          'https://i.pinimg.com/1200x/7c/18/7a/7c187ae1a5669bfab50fd8487a398e2d.jpg'
        ),
      },
      {
        id: 'forest-green',
        name: 'Forest Green',
        hex: '#2D5016',
        views: makeViews(
          'https://i.pinimg.com/1200x/7c/18/7a/7c187ae1a5669bfab50fd8487a398e2d.jpg'
        ),
      },
      {
        id: 'wine',
        name: 'Wine',
        hex: '#722F37',
        views: makeViews(
          'https://i.pinimg.com/1200x/7c/18/7a/7c187ae1a5669bfab50fd8487a398e2d.jpg'
        ),
      },
    ],
  },
  {
    id: 9,
    slug: 'athletic-tank',
    name: 'Athletic Tank Top',
    vendor: 'Frill Sport',
    category: 'tshirt',
    price: 899,
    oldPrice: null,
    badge: null,
    badgeVariant: null,
    stars: 4.4,
    reviews: 156,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: '160 GSM lightweight tank - ideal for active lifestyle',
    customizable: false,
    tags: ['tank', 'activewear', 'lightweight'],
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#1a1a1a',
        views: makeViews(
          'https://i.pinimg.com/736x/25/69/4e/25694eae1afdff4f723e70fe4aa6bbe4.jpg'
        ),
      },
      {
        id: 'white',
        name: 'White',
        hex: '#ffffff',
        views: makeViews(
          'https://i.pinimg.com/736x/25/69/4e/25694eae1afdff4f723e70fe4aa6bbe4.jpg'
        ),
      },
      {
        id: 'charcoal',
        name: 'Charcoal',
        hex: '#4A4A4A',
        views: makeViews(
          'https://i.pinimg.com/736x/25/69/4e/25694eae1afdff4f723e70fe4aa6bbe4.jpg'
        ),
      },
    ],
  },
  {
    id: 10,
    slug: 'vintage-wash-tee',
    name: 'Vintage Wash Tee',
    vendor: 'Frill Custom Apparel',
    category: 'tshirt',
    price: 1299,
    oldPrice: 1699,
    badge: 'POPULAR',
    badgeVariant: 'custom',
    stars: 4.9,
    reviews: 678,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    desc: 'Soft-washed 150 GSM cotton tee with a comfortable lived-in feel',
    customizable: true,
    tags: ['tshirt', 'vintage', 'cotton', 'wash'],
    colors: [
      {
        id: 'stone-blue',
        name: 'Stone Blue',
        hex: '#6B9BD1',
        views: makeViews(
          'https://i.pinimg.com/1200x/9d/54/5f/9d545f9d450706ff9ce389b855daad48.jpg'
        ),
      },
      {
        id: 'ash',
        name: 'Ash',
        hex: '#A8A8A8',
        views: makeViews(
          'https://i.pinimg.com/736x/25/69/4e/25694eae1afdff4f723e70fe4aa6bbe4.jpg'
        ),
      },
      {
        id: 'rust',
        name: 'Rust',
        hex: '#B7632D',
        views: makeViews(
          'https://i.pinimg.com/736x/25/69/4e/25694eae1afdff4f723e70fe4aa6bbe4.jpg'
        ),
      },
    ],
  },
]

function getPrimaryImage(product) {
  return product.colors?.[0]?.views?.[0]?.imageUrl || ''
}

function getGalleryImages(product) {
  return (product.colors || [])
    .map((color) => color.views?.[0]?.imageUrl)
    .filter(Boolean)
}

export const PRODUCTS_MOCK = RAW_PRODUCTS_MOCK.map((product) => ({
  ...product,
  img: getPrimaryImage(product),
  imgs: getGalleryImages(product),
}))
