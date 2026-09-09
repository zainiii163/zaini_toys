import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Brand } from '../models/Brand';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { Banner } from '../models/Banner';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/toy-ecommerce';

const brands = [
  { name: 'LEGO', slug: 'lego', description: 'The world-famous building block brand', country: 'Denmark', website: 'https://www.lego.com' },
  { name: 'Hot Wheels', slug: 'hot-wheels', description: 'Die-cast toy cars by Mattel', country: 'USA', website: 'https://www.hotwheels.com' },
  { name: 'Barbie', slug: 'barbie', description: 'The iconic fashion doll brand', country: 'USA', website: 'https://www.barbie.com' },
  { name: 'Fisher-Price', slug: 'fisher-price', description: 'Educational toys for infants and toddlers', country: 'USA', website: 'https://www.fisher-price.com' },
  { name: 'Nerf', slug: 'nerf', description: 'Foam blasters and dart guns', country: 'USA', website: 'https://www.nerf.com' },
  { name: 'Play-Doh', slug: 'play-doh', description: 'Modeling compound for creative play', country: 'USA', website: 'https://www.hasbro.com' },
  { name: 'Crayola', slug: 'crayola', description: 'Art supplies and creative toys', country: 'USA', website: 'https://www.crayola.com' },
  { name: 'Tamagotchi', slug: 'tamagotchi', description: 'Virtual pet electronic toys', country: 'Japan', website: 'https://www.bandainamcoent.co.jp' },
  { name: 'Mega Bloks', slug: 'mega-bloks', description: 'Building blocks for young builders', country: 'Canada', website: 'https://www.megabloks.com' },
  { name: 'Funskool', slug: 'funskool', description: 'India\'s leading toy company', country: 'India', website: 'https://www.funskool.com' },
];

const categories = [
  { name: 'Building & Construction Toys', slug: 'building-toys', description: 'LEGO, Mega Bloks, and building sets', icon: '🧱', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=200&h=200&fit=crop', ageGroups: ['3-5', '6-8', '9-12'] },
  { name: 'Action Figures & Collectibles', slug: 'action-figures', description: 'Action figures, dolls, and collectible toys', icon: '🦸', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop', ageGroups: ['4-7', '8-12', '13+'] },
  { name: 'Outdoor & Sports Toys', slug: 'outdoor-toys', description: 'Toys for outdoor play and sports', icon: '⚽', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop', ageGroups: ['3-5', '6-8', '9-12'] },
  { name: 'Educational & STEM Toys', slug: 'educational-toys', description: 'Learning and science toys', icon: '🔬', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&h=200&fit=crop', ageGroups: ['3-5', '6-8', '9-12'] },
  { name: 'Arts & Crafts', slug: 'arts-crafts', description: 'Art supplies, craft kits, and creative toys', icon: '🎨', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop', ageGroups: ['3-5', '6-8', '9-12'] },
  { name: 'Dolls & Plush', slug: 'dolls-plush', description: 'Fashion dolls, stuffed animals, and plush toys', icon: '🧸', image: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=200&h=200&fit=crop', ageGroups: ['0-2', '3-5', '6-8'] },
  { name: 'Vehicles & Remote Control', slug: 'vehicles-rc', description: 'Toy cars, RC vehicles, and train sets', icon: '🚗', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop', ageGroups: ['3-5', '6-8', '9-12'] },
  { name: 'Board Games & Puzzles', slug: 'board-games', description: 'Family board games, card games, and puzzles', icon: '🎲', image: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=200&h=200&fit=crop', ageGroups: ['3-5', '6-8', '9-12', '13+'] },
  { name: 'Baby & Toddler Toys', slug: 'baby-toys', description: 'Safe toys for babies and toddlers', icon: '🍼', image: 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=200&h=200&fit=crop', ageGroups: ['0-2', '3-5'] },
  { name: 'Electronic & Interactive Toys', slug: 'electronic-toys', description: 'Electronic games, virtual pets, and interactive toys', icon: '🎮', image: 'https://images.unsplash.com/photo-1629236714692-9dddb8596d7f?w=200&h=200&fit=crop', ageGroups: ['5-8', '9-12', '13+'] },
];

const productImages: Record<string, string> = {
  'lego-city-fire-station': 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=600&fit=crop',
  'lego-creator-dinosaurs': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=600&fit=crop',
  'hot-wheels-ultimate-garage': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop',
  'hot-wheels-20-pack': 'https://images.unsplash.com/photo-1597404294079-407d70997db4?w=600&h=600&fit=crop',
  'barbie-dreamhouse': 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=600&h=600&fit=crop',
  'barbie-fashionista': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
  'fisher-price-smart-chair': 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=600&h=600&fit=crop',
  'nerf-elite-commander': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
  'nerf-rival-perses': 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=600&fit=crop',
  'play-doh-mega-pack': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
  'crayola-64-crayons': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
  'tamagotchi-original': 'https://images.unsplash.com/photo-1629236714692-9dddb8596d7f?w=600&h=600&fit=crop',
  'mega-bloks-first-builders': 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=600&fit=crop',
  'funskool-games-combo': 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b9e4?w=600&h=600&fit=crop',
  'lego-star-wars-falcon': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=600&fit=crop',
  'hot-wheels-track-builder': 'https://images.unsplash.com/photo-1597404294079-407d70997db4?w=600&h=600&fit=crop',
  'crayola-finger-paints': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
  'fisher-price-rock-stack': 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=600&h=600&fit=crop',
};

const products = [
  { name: 'LEGO City Fire Station Set', slug: 'lego-city-fire-station', sku: 'LEG-CITY-001', price: 8999, salePrice: 7999, description: 'Build and play with the LEGO City Fire Station! Includes fire truck, firefighter minifigures, and a burning building.', shortDescription: 'LEGO City Fire Station with minifigures', brand: 'lego', category: 'building-toys', ageMin: 6, ageMax: 12, stock: 25, isFeatured: true, isBestSeller: true, tags: ['lego', 'city', 'fire', 'building'], material: ['Plastic'], color: ['Red', 'Black', 'Yellow'] },
  { name: 'LEGO Creator 3-in-1 Mighty Dinosaurs', slug: 'lego-creator-dinosaurs', sku: 'LEG-CRE-002', price: 6499, description: 'Build a T-Rex, Triceratops, or Pterodactyl with this awesome 3-in-1 LEGO Creator set!', shortDescription: '3-in-1 dinosaur building set', brand: 'lego', category: 'building-toys', ageMin: 9, ageMax: 12, stock: 30, isFeatured: true, isNewArrival: true, tags: ['lego', 'creator', 'dinosaur'], material: ['Plastic'], color: ['Green', 'Brown'] },
  { name: 'Hot Wheels Ultimate Garage Playset', slug: 'hot-wheels-ultimate-garage', sku: 'HW-GAR-001', price: 12999, salePrice: 10999, description: 'The ultimate Hot Wheels garage with elevator, car wash, and room for 30+ cars!', shortDescription: 'Multi-level garage playset', brand: 'hot-wheels', category: 'vehicles-rc', ageMin: 5, ageMax: 12, stock: 15, isFeatured: true, isBestSeller: true, tags: ['hot-wheels', 'garage', 'cars'], material: ['Plastic', 'Die-cast Metal'], color: ['Blue', 'Orange'] },
  { name: 'Hot Wheels 20-Car Pack', slug: 'hot-wheels-20-pack', sku: 'HW-PACK-001', price: 4999, description: 'Collection of 20 unique Hot Wheels die-cast cars. Perfect for kids and collectors!', shortDescription: '20 unique die-cast cars', brand: 'hot-wheels', category: 'vehicles-rc', ageMin: 3, ageMax: 10, stock: 40, isBestSeller: true, tags: ['hot-wheels', 'cars', 'die-cast'], material: ['Die-cast Metal'], color: ['Multicolor'] },
  { name: 'Barbie Dreamhouse Playset', slug: 'barbie-dreamhouse', sku: 'BAR-DH-001', price: 24999, salePrice: 21999, description: 'The iconic Barbie Dreamhouse with 3 stories, elevator, pool, and working lights & sounds!', shortDescription: '3-story Dreamhouse with elevator', brand: 'barbie', category: 'dolls-plush', ageMin: 3, ageMax: 10, stock: 10, isFeatured: true, tags: ['barbie', 'dreamhouse', 'dollhouse'], material: ['Plastic'], color: ['Pink', 'White'] },
  { name: 'Barbie Fashionista Doll', slug: 'barbie-fashionista', sku: 'BAR-FA-001', price: 2999, description: 'Stylish Barbie doll with trendy outfit and accessories. Multiple skin tones and styles available!', shortDescription: 'Trendy fashion doll with outfit', brand: 'barbie', category: 'dolls-plush', ageMin: 3, ageMax: 10, stock: 50, tags: ['barbie', 'fashion', 'doll'], material: ['Plastic', 'Fabric'], color: ['Multicolor'] },
  { name: 'Fisher-Price Laugh & Learn Smart Stages Chair', slug: 'fisher-price-smart-chair', sku: 'FP-LS-001', price: 5499, description: 'Interactive learning chair with 50+ songs, sounds, and phrases. Grows with your child!', shortDescription: 'Interactive learning chair', brand: 'fisher-price', category: 'baby-toys', ageMin: 0, ageMax: 3, stock: 20, isNewArrival: true, tags: ['fisher-price', 'baby', 'learning'], material: ['Plastic'], color: ['Red', 'Blue'] },
  { name: 'Nerf Elite 2.0 Commander RD-6 Blaster', slug: 'nerf-elite-commander', sku: 'NERF-EC-001', price: 3999, description: 'Fire 6 darts in a row with this Elite 2.0 blaster! Includes 6 Elite darts.', shortDescription: '6-dart blaster with darts', brand: 'nerf', category: 'outdoor-toys', ageMin: 8, ageMax: 14, stock: 35, isBestSeller: true, tags: ['nerf', 'blaster', 'outdoor'], material: ['Plastic'], color: ['Orange', 'Blue'] },
  { name: 'Nerf Rival Perses MXIX-5000', slug: 'nerf-rival-perses', sku: 'NERF-RP-001', price: 14999, description: 'High-speed motorized blaster with 50 rounds! Fires at 100 fps.', shortDescription: 'Motorized rival blaster', brand: 'nerf', category: 'outdoor-toys', ageMin: 14, ageMax: 99, stock: 12, isFeatured: true, tags: ['nerf', 'rival', 'motorized'], material: ['Plastic'], color: ['Yellow', 'Black'] },
  { name: 'Play-Doh Mega Pack (10 Cans)', slug: 'play-doh-mega-pack', sku: 'PD-MP-001', price: 3499, description: '10 vibrant colors of Play-Doh compound for endless creative fun!', shortDescription: '10-pack modeling compound', brand: 'play-doh', category: 'arts-crafts', ageMin: 2, ageMax: 8, stock: 60, isBestSeller: true, tags: ['play-doh', 'crafts', 'creative'], material: ['Non-toxic compound'], color: ['Multicolor'] },
  { name: 'Crayola 64-Count Crayons', slug: 'crayola-64-crayons', sku: 'CR-64-001', price: 1999, description: 'Classic 64-count box with built-in sharpener. Includes unique colors!', shortDescription: '64 classic crayons with sharpener', brand: 'crayola', category: 'arts-crafts', ageMin: 3, ageMax: 12, stock: 80, tags: ['crayola', 'crayons', 'art'], material: ['Wax'], color: ['Multicolor'] },
  { name: 'Tamagotchi Original', slug: 'tamagotchi-original', sku: 'TAMA-OR-001', price: 4499, description: 'The original virtual pet is back! Feed, play, and care for your Tamagotchi.', shortDescription: 'Classic virtual pet', brand: 'tamagotchi', category: 'electronic-toys', ageMin: 8, ageMax: 99, stock: 25, isNewArrival: true, tags: ['tamagotchi', 'electronic', 'pet'], material: ['Plastic'], color: ['White', 'Pink'] },
  { name: 'Mega Bloks First Builders Big Building Bag', slug: 'mega-bloks-first-builders', sku: 'MB-FB-001', price: 2999, description: '80-piece mega building bag for little builders! Large blocks perfect for small hands.', shortDescription: '80-piece building blocks set', brand: 'mega-bloks', category: 'building-toys', ageMin: 1, ageMax: 5, stock: 45, tags: ['mega-bloks', 'baby', 'building'], material: ['Plastic'], color: ['Red', 'Blue', 'Green'] },
  { name: 'Funskool Board Games Combo', slug: 'funskool-games-combo', sku: 'FS-GC-001', price: 1499, description: 'Set of 3 classic board games: Ludo, Snake & Ladders, and Business. Family fun guaranteed!', shortDescription: '3 classic board games combo', brand: 'funskool', category: 'board-games', ageMin: 5, ageMax: 99, stock: 55, tags: ['funskool', 'board-games', 'family'], material: ['Cardboard', 'Plastic'], color: ['Multicolor'] },
  { name: 'LEGO Star Wars Millennium Falcon', slug: 'lego-star-wars-falcon', sku: 'LEG-SW-001', price: 19999, salePrice: 17999, description: 'Build the iconic Millennium Falcon with 7,541 pieces! Includes Han Solo, Chewbacca, and more.', shortDescription: '7541-piece Star Wars set', brand: 'lego', category: 'building-toys', ageMin: 10, ageMax: 99, stock: 8, isFeatured: true, tags: ['lego', 'star-wars', 'millennium-falcon'], material: ['Plastic'], color: ['Gray', 'Tan'] },
  { name: 'Hot Wheels Track Builder Unlimited', slug: 'hot-wheels-track-builder', sku: 'HW-TB-001', price: 7999, description: 'Create your own epic Hot Wheels tracks! Includes curves, straights, and a launcher.', shortDescription: 'Custom track building kit', brand: 'hot-wheels', category: 'vehicles-rc', ageMin: 6, ageMax: 12, stock: 22, isNewArrival: true, tags: ['hot-wheels', 'track', 'building'], material: ['Plastic'], color: ['Orange', 'Blue'] },
  { name: 'Crayola Washable Finger Paints (6 Pack)', slug: 'crayola-finger-paints', sku: 'CR-FP-001', price: 2499, description: '6 vibrant, washable finger paint colors. Non-toxic and easy to clean!', shortDescription: '6 vibrant washable paints', brand: 'crayola', category: 'arts-crafts', ageMin: 2, ageMax: 6, stock: 35, tags: ['crayola', 'paint', 'crafts'], material: ['Non-toxic paint'], color: ['Multicolor'] },
  { name: 'Fisher-Price Rock-a-Stack', slug: 'fisher-price-rock-stack', sku: 'FP-RS-001', price: 2499, description: 'Classic stacking rings toy with colorful spinning rings. A must-have for babies!', shortDescription: 'Classic stacking rings toy', brand: 'fisher-price', category: 'baby-toys', ageMin: 0, ageMax: 2, stock: 40, tags: ['fisher-price', 'baby', 'stacking'], material: ['Plastic'], color: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'] },
];

const coupons = [
  { code: 'WELCOME10', description: '10% off your first order', type: 'percentage', value: 10, minimumOrder: 1000, maximumDiscount: 500, usageLimit: 1000, perUserLimit: 1, firstOrderOnly: true },
  { code: 'SUMMER20', description: '20% off summer toys', type: 'percentage', value: 20, minimumOrder: 2000, maximumDiscount: 1000, usageLimit: 500, perUserLimit: 2 },
  { code: 'FLAT500', description: 'Rs. 500 off orders above Rs. 5000', type: 'fixed', value: 500, minimumOrder: 5000, usageLimit: 300, perUserLimit: 1 },
  { code: 'FREESHIP', description: 'Free shipping on all orders', type: 'free_shipping', value: 0, minimumOrder: 0, usageLimit: 2000, perUserLimit: 5 },
  { code: 'LEGO15', description: '15% off LEGO products', type: 'percentage', value: 15, minimumOrder: 3000, maximumDiscount: 2000, applicableTo: 'brands', usageLimit: 200, perUserLimit: 2 },
];

const banners = [
  { title: 'Summer Toy Sale!', subtitle: 'Up to 30% off on outdoor toys', link: '/shop?category=outdoor-toys', linkType: 'category', position: 'hero', sortOrder: 1, isActive: true, image: { url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=500&fit=crop', publicId: 'banner-summer-sale' } },
  { title: 'New LEGO Arrivals', subtitle: 'Check out the latest LEGO sets', link: '/shop?search=lego', linkType: 'custom', position: 'hero', sortOrder: 2, isActive: true, image: { url: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=1200&h=500&fit=crop', publicId: 'banner-lego-new' } },
  { title: 'Free Delivery', subtitle: 'On orders above Rs. 3,000', link: '/shop', linkType: 'custom', position: 'mid', sortOrder: 1, isActive: true, image: { url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=300&fit=crop', publicId: 'banner-free-delivery' } },
  { title: 'STEM Learning', subtitle: 'Educational toys for smart kids', link: '/shop?category=educational-toys', linkType: 'category', position: 'mid', sortOrder: 2, isActive: true, image: { url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=300&fit=crop', publicId: 'banner-stem' } },
];

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
    ]);
    console.log('✅ Cleared all collections\n');

    console.log('👤 Creating users...');
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('Admin@123', salt);
    const custPass = await bcrypt.hash('Customer@123', salt);
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@toystore.pk',
        phone: '+923001234567',
        password: adminPass,
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
        loyaltyPoints: 0,
        referralCode: 'ADMIN001',
      },
      {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        phone: '+923211234567',
        password: custPass,
        role: 'customer',
        isEmailVerified: true,
        isActive: true,
        loyaltyPoints: 150,
        loyaltyTier: 'bronze',
        referralCode: 'AHMED001',
        addresses: [
          {
            label: 'Home',
            fullName: 'Ahmed Khan',
            phone: '+923211234567',
            address: '123 Main Street, Gulshan-e-Iqbal',
            city: 'Karachi',
            area: 'Gulshan-e-Iqbal',
            postalCode: '75300',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        phone: '+923331234567',
        password: custPass,
        role: 'customer',
        isEmailVerified: true,
        isActive: true,
        loyaltyPoints: 350,
        loyaltyTier: 'silver',
        referralCode: 'FATIMA01',
        addresses: [
          {
            label: 'Home',
            fullName: 'Fatima Ali',
            phone: '+923331234567',
            address: '45 DHA Phase 5',
            city: 'Lahore',
            area: 'DHA',
            postalCode: '54792',
            isDefault: true,
          },
        ],
      },
    ]);
    const adminUser = users[0];
    const customer1 = users[1];
    const customer2 = users[2];
    console.log(`  ✅ Created ${users.length} users (admin@toystore.pk / Admin@123)`);

    console.log('🏷️  Creating brands...');
    const createdBrands = await Brand.insertMany(brands);
    console.log(`  ✅ Created ${createdBrands.length} brands`);

    console.log('📂 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`  ✅ Created ${createdCategories.length} categories`);

    const brandMap = Object.fromEntries(createdBrands.map((b) => [b.slug, b._id]));
    const categoryMap = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

    console.log('🧸 Creating products...');
    const createdProducts = await Product.insertMany(
      products.map((p) => ({
        ...p,
        brand: brandMap[p.brand],
        category: categoryMap[p.category],
        costPrice: Math.round(p.price * 0.6),
        ageRange: { min: p.ageMin, max: p.ageMax },
        recommendedAge: p.ageMin,
        images: [{ url: productImages[p.slug] || `https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop`, publicId: `product-${p.sku}`, alt: p.name, isPrimary: true }],
        availableStock: p.stock,
        isActive: true,
      })),
    );
    console.log(`  ✅ Created ${createdProducts.length} products`);

    console.log('🎟️  Creating coupons...');
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + 3);
    const createdCoupons = await Coupon.insertMany(
      coupons.map((c) => ({
        ...c,
        startDate: now,
        endDate: futureDate,
        isActive: true,
        applicableTo: c.applicableTo || 'all',
      })),
    );
    console.log(`  ✅ Created ${createdCoupons.length} coupons`);

    console.log('🖼️  Creating banners...');
    const createdBanners = await Banner.insertMany(
      banners.map((b) => ({
        ...b,
        startDate: now,
        endDate: futureDate,
      })),
    );
    console.log(`  ✅ Created ${createdBanners.length} banners`);

    console.log('📊 Updating category product counts...');
    for (const cat of createdCategories) {
      const count = createdProducts.filter((p) => p.category.toString() === cat._id.toString()).length;
      await Category.findByIdAndUpdate(cat._id, { productCount: count });
    }

    console.log('📊 Updating brand product counts...');
    for (const brand of createdBrands) {
      const count = createdProducts.filter((p) => p.brand.toString() === brand._id.toString()).length;
      await Brand.findByIdAndUpdate(brand._id, { productCount: count });
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('  Admin:   admin@toystore.pk / Admin@123');
    console.log('  Customer: ahmed@example.com / Customer@123');
    console.log('  Customer: fatima@example.com / Customer@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
