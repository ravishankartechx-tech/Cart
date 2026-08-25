const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const DeliveryPartner = require('./models/DeliveryPartner');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feastrocket';

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    console.log('🧹 Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
      Coupon.deleteMany({}),
      DeliveryPartner.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // ─── 1. Create Users ────────────────────────────────────────────────────────
    console.log('👤 Creating users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const hashedRestoPassword = await bcrypt.hash('resto123', 12);
    const hashedDeliveryPassword = await bcrypt.hash('delivery123', 12);
    const hashedUserPassword = await bcrypt.hash('user123', 12);

    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@feastrocket.com',
      password: hashedAdminPassword,
      role: 'admin',
      phone: '+91 99000 00001',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      addresses: [{ label: 'Office', street: '100 Feet Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' }],
    });

    const restoOwner = await User.create({
      name: 'Ravi Teja (Meghana Foods Owner)',
      email: 'restaurant@feastrocket.com',
      password: hashedRestoPassword,
      role: 'restaurant',
      phone: '+91 99000 00002',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    });

    const deliveryUser = await User.create({
      name: 'Arjun Ramesh',
      email: 'delivery@feastrocket.com',
      password: hashedDeliveryPassword,
      role: 'delivery',
      phone: '+91 98765 43210',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
    });

    const customer = await User.create({
      name: 'Priya Sharma',
      email: 'user@feastrocket.com',
      password: hashedUserPassword,
      role: 'user',
      phone: '+91 98123 45678',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
      addresses: [
        { label: 'Home', street: '42, 5th Cross, 6th Main, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
        { label: 'Work', street: 'Embassy GolfLinks Tech Park, Domlur', city: 'Bengaluru', state: 'Karnataka', pincode: '560071' },
      ],
    });

    // ─── 2. Create Delivery Partner Profile ─────────────────────────────────────
    console.log('🛵 Creating delivery partner profile...');
    await DeliveryPartner.create({
      user: deliveryUser._id,
      vehicleType: 'bike',
      vehicleNumber: 'KA 03 EN 4567',
      licenseNumber: 'KA0320210045892',
      isApproved: true,
      isAvailable: true,
      isOnline: true,
      currentLocation: { lat: 12.9716, lng: 77.5946, updatedAt: new Date() },
      completedOrders: 142,
      rating: 4.9,
      totalEarnings: 8450,
    });

    // ─── 3. Create Restaurants ──────────────────────────────────────────────────
    console.log('🏪 Creating restaurants...');
    const restaurantsData = [
      {
        owner: restoOwner._id,
        name: 'Meghana Foods',
        description: 'Authentic fiery Andhra style dum biryanis, kebabs and spicy curries.',
        cuisines: ['Biryani', 'Andhra', 'South Indian'],
        rating: 4.6,
        totalRatings: 1840,
        deliveryTime: '30-35 mins',
        costForTwo: 500,
        deliveryFee: 40,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Trending', 'Top Rated', 'Bestseller'],
        coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
        address: { street: '124, 5th Block, KHB Colony, Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560095', lat: 12.9352, lng: 77.6245 },
      },
      {
        owner: restoOwner._id,
        name: 'Truffles',
        description: 'Iconic burgers, gourmet pastas, delicious steaks and divine desserts.',
        cuisines: ['Burgers', 'American', 'Pasta', 'Desserts'],
        rating: 4.7,
        totalRatings: 3420,
        deliveryTime: '25-30 mins',
        costForTwo: 700,
        deliveryFee: 0,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Must Try', 'Trending'],
        coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
        address: { street: '28, 4th B Cross, 5th Block, Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560095', lat: 12.9341, lng: 77.6189 },
      },
      {
        owner: restoOwner._id,
        name: 'Empire Restaurant',
        description: 'Famous late-night destination for grilled kebabs, shawarmas and rich gravies.',
        cuisines: ['North Indian', 'Mughlai', 'Kebabs', 'Arabian'],
        rating: 4.3,
        totalRatings: 2150,
        deliveryTime: '35-40 mins',
        costForTwo: 650,
        deliveryFee: 30,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Late Night', 'Popular'],
        coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
        address: { street: '36, Church Street, Off Brigade Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', lat: 12.9742, lng: 77.6074 },
      },
      {
        owner: restoOwner._id,
        name: 'Corner House Ice Cream',
        description: 'Legendary ice cream parlour serving Death by Chocolate and rich sundaes.',
        cuisines: ['Desserts', 'Ice Cream', 'Shakes'],
        rating: 4.9,
        totalRatings: 4890,
        deliveryTime: '20-25 mins',
        costForTwo: 400,
        deliveryFee: 0,
        isApproved: true,
        isOpen: true,
        isPureVeg: true,
        tags: ['Iconic', 'Pure Veg', 'Top Rated'],
        coverImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop',
        address: { street: '4, 11th Main, 4th Block, Jayanagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560011', lat: 12.9298, lng: 77.5833 },
      },
      {
        owner: restoOwner._id,
        name: 'A2B — Adyar Ananda Bhavan',
        description: 'Authentic traditional South Indian breakfast, crispy dosas, filter coffee and sweets.',
        cuisines: ['South Indian', 'Sweets', 'Pure Veg', 'Breakfast'],
        rating: 4.4,
        totalRatings: 1650,
        deliveryTime: '25-30 mins',
        costForTwo: 350,
        deliveryFee: 25,
        isApproved: true,
        isOpen: true,
        isPureVeg: true,
        tags: ['Pure Veg', 'Breakfast'],
        coverImage: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=800&auto=format&fit=crop',
        address: { street: 'Outer Ring Road, Marathahalli', city: 'Bengaluru', state: 'Karnataka', pincode: '560037', lat: 12.9569, lng: 77.7011 },
      },
      {
        owner: restoOwner._id,
        name: 'La Piazza Trattoria',
        description: 'Hand-stretched woodfired pizzas, fresh handmade pastas and classic Italian gelato.',
        cuisines: ['Italian', 'Pizza', 'Pasta', 'Continental'],
        rating: 4.6,
        totalRatings: 940,
        deliveryTime: '30-40 mins',
        costForTwo: 900,
        deliveryFee: 50,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Gourmet', 'Woodfired'],
        coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop',
        address: { street: '12, Lavelle Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', lat: 12.9719, lng: 77.5963 },
      },
      {
        owner: restoOwner._id,
        name: 'Sakura Sushi & Ramen Bar',
        description: 'Premium sushi rolls, authentic Tonkotsu & Miso ramens, gyoza and matcha treats.',
        cuisines: ['Japanese', 'Sushi', 'Ramen', 'Asian'],
        rating: 4.8,
        totalRatings: 820,
        deliveryTime: '35-45 mins',
        costForTwo: 1200,
        deliveryFee: 60,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Japanese', 'Premium', 'Sushi'],
        coverImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop',
        address: { street: '100 Feet Road, HAL 2nd Stage, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', lat: 12.9784, lng: 77.6408 },
      },
      {
        owner: restoOwner._id,
        name: 'El Sombrero Mexican Grill',
        description: 'Fiery tacos, stuffed burritos, loaded nachos with house guacamole and salsa.',
        cuisines: ['Mexican', 'Tacos', 'Burritos', 'Salads'],
        rating: 4.5,
        totalRatings: 730,
        deliveryTime: '25-30 mins',
        costForTwo: 600,
        deliveryFee: 35,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Mexican', 'Spicy', 'Trending'],
        coverImage: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop',
        address: { street: '80 Feet Road, 4th Block, Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', lat: 12.9317, lng: 77.6291 },
      },
      {
        owner: restoOwner._id,
        name: 'Dragon Palace',
        description: 'Sizzling dim sums, wok-tossed Hakka noodles, crispy honey chilli chicken.',
        cuisines: ['Chinese', 'Dim Sum', 'Noodles', 'Asian'],
        rating: 4.4,
        totalRatings: 1120,
        deliveryTime: '30-35 mins',
        costForTwo: 650,
        deliveryFee: 40,
        isApproved: true,
        isOpen: true,
        isPureVeg: false,
        tags: ['Chinese', 'Dim Sum'],
        coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop',
        address: { street: 'Residency Road, Shanthala Nagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560025', lat: 12.9698, lng: 77.6033 },
      },
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurantsData);
    console.log(`✅ Inserted ${createdRestaurants.length} restaurants.`);

    // ─── 4. Create Menu Items ──────────────────────────────────────────────────
    console.log('🍽 Creating menu items...');
    const menuItems = [
      // Meghana Foods
      {
        restaurant: createdRestaurants[0]._id,
        category: 'Biryani & Rice',
        name: 'Special Chicken Boneless Biryani',
        description: 'Tender boneless chicken marinated in secret Andhra masala, layered with aromatic basmati rice and fried onions.',
        price: 345,
        isVeg: false,
        isBestSeller: true,
        spiceLevel: 'Hot',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
        tags: ['Bestseller', 'Chef Special'],
      },
      {
        restaurant: createdRestaurants[0]._id,
        category: 'Biryani & Rice',
        name: 'Hyderabadi Mutton Dum Biryani',
        description: 'Slow cooked succulent mutton pieces with saffron basmati rice, mint, coriander and whole spices.',
        price: 420,
        isVeg: false,
        isBestSeller: false,
        spiceLevel: 'Hot',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop',
        tags: ['Rich & Flavorful'],
      },
      {
        restaurant: createdRestaurants[0]._id,
        category: 'Biryani & Rice',
        name: 'Paneer Biryani',
        description: 'Soft cottage cheese cubes marinated in yogurt spices, dum cooked with fragrant basmati rice.',
        price: 290,
        isVeg: true,
        isBestSeller: false,
        spiceLevel: 'Medium',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop',
        tags: ['Pure Veg Choice'],
      },
      {
        restaurant: createdRestaurants[0]._id,
        category: 'Starters',
        name: 'Guntur Chicken Fry (Dry)',
        description: 'Spicy chicken chunks tossed with Guntur red chillies, curry leaves and roasted garlic.',
        price: 280,
        isVeg: false,
        isBestSeller: true,
        spiceLevel: 'Extra Hot',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop',
        tags: ['Spicy Favorite'],
      },
      {
        restaurant: createdRestaurants[0]._id,
        category: 'Starters',
        name: 'Chilli Paneer Dry',
        description: 'Crisp paneer cubes tossed in spicy chilli soy sauce with crunchy onions and bell peppers.',
        price: 240,
        isVeg: true,
        isBestSeller: false,
        spiceLevel: 'Medium',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop',
        tags: ['Popular Starter'],
      },

      // Truffles
      {
        restaurant: createdRestaurants[1]._id,
        category: 'Gourmet Burgers',
        name: 'All American Cheese Burger',
        description: 'Charbroiled juicy patty topped with aged cheddar cheese, crisp lettuce, tomato, gherkins and secret sauce on a brioche bun.',
        price: 260,
        isVeg: false,
        isBestSeller: true,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
        tags: ['Legendary Burger'],
      },
      {
        restaurant: createdRestaurants[1]._id,
        category: 'Gourmet Burgers',
        name: 'Crispy Veggie & Cheese Burger',
        description: 'Crisp vegetable patty with melted cheese, jalapenos and tangy garlic mayo on a toasted sesame bun.',
        price: 210,
        isVeg: true,
        isBestSeller: false,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop',
        tags: ['Veg Bestseller'],
      },
      {
        restaurant: createdRestaurants[1]._id,
        category: 'Pastas',
        name: 'Creamy Penne Alfredo with Mushroom',
        description: 'Al dente penne in a velvety parmesan and garlic cream sauce with sauteed button mushrooms and fresh parsley.',
        price: 320,
        isVeg: true,
        isBestSeller: true,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop',
        tags: ['Rich & Creamy'],
      },
      {
        restaurant: createdRestaurants[1]._id,
        category: 'Desserts',
        name: 'Gooey Dutch Chocolate Truffle Cake',
        description: 'Slice of dark chocolate fudge layered with decadent Belgian ganache.',
        price: 190,
        isVeg: true,
        isBestSeller: true,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop',
        tags: ['Must Try Dessert'],
      },

      // Corner House
      {
        restaurant: createdRestaurants[3]._id,
        category: 'Signature Sundaes',
        name: 'Death by Chocolate (DBC)',
        description: 'Layers of rich chocolate sponge cake, two scoops of vanilla ice cream, hot chocolate fudge, cherries and roasted peanuts.',
        price: 290,
        isVeg: true,
        isBestSeller: true,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop',
        tags: ['Bangalore Icon', 'Top Bestseller'],
      },
      {
        restaurant: createdRestaurants[3]._id,
        category: 'Signature Sundaes',
        name: 'Hot Chocolate Cake Fudge',
        description: 'Warm chocolate cake topped with vanilla ice cream and generous pouring of hot chocolate fudge.',
        price: 220,
        isVeg: true,
        isBestSeller: false,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop',
        tags: ['Classic Treat'],
      },

      // A2B
      {
        restaurant: createdRestaurants[4]._id,
        category: 'Tiffin & Dosa',
        name: 'Special Ghee Masala Dosa',
        description: 'Golden crispy rice crepe smeared with pure desi ghee and stuffed with spiced potato mash, served with 3 chutneys and sambar.',
        price: 120,
        isVeg: true,
        isBestSeller: true,
        spiceLevel: 'Medium',
        image: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=500&auto=format&fit=crop',
        tags: ['Pure Ghee', 'Authentic'],
      },
      {
        restaurant: createdRestaurants[4]._id,
        category: 'Tiffin & Dosa',
        name: 'Steamed Idli Vada Combo',
        description: 'Two fluffy steamed idlis and one crispy golden medu vada served with hot sambar and fresh coconut chutney.',
        price: 110,
        isVeg: true,
        isBestSeller: false,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop',
        tags: ['Breakfast Favorite'],
      },

      // La Piazza
      {
        restaurant: createdRestaurants[5]._id,
        category: 'Woodfired Pizza',
        name: 'Margherita con Bufala',
        description: 'San Marzano tomato base, fresh buffalo mozzarella, fragrant basil leaves and extra virgin olive oil.',
        price: 480,
        isVeg: true,
        isBestSeller: true,
        spiceLevel: 'Mild',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop',
        tags: ['Neapolitan Style'],
      },

      // Sakura Sushi
      {
        restaurant: createdRestaurants[6]._id,
        category: 'Sushi Rolls',
        name: 'Dragon Roll (8 pcs)',
        description: 'Prawn tempura and cucumber topped with sliced avocado, unagi sauce, spicy mayo and tobiko.',
        price: 650,
        isVeg: false,
        isBestSeller: true,
        spiceLevel: 'Medium',
        image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&auto=format&fit=crop',
        tags: ['Chef Signature'],
      },
    ];

    await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${menuItems.length} menu items.`);

    // ─── 5. Create Coupons ──────────────────────────────────────────────────────
    console.log('🏷 Creating promo coupons...');
    const coupons = [
      {
        code: 'WELCOME100',
        description: 'Flat ₹100 off on your first order above ₹300',
        discountType: 'flat',
        discountValue: 100,
        minOrderAmount: 300,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'FEAST50',
        description: '50% off up to ₹150 on delicious meals',
        discountType: 'percentage',
        discountValue: 50,
        maxDiscount: 150,
        minOrderAmount: 200,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'SUPER20',
        description: '20% flat discount on all partner restaurants',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 100,
        minOrderAmount: 150,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ];

    await Coupon.insertMany(coupons);
    console.log(`✅ Inserted ${coupons.length} coupons.`);

    // ─── 6. Create Sample Orders ────────────────────────────────────────────────
    console.log('📦 Creating sample orders...');
    const sampleOrder1 = await Order.create({
      user: customer._id,
      restaurant: createdRestaurants[0]._id,
      restaurantName: createdRestaurants[0].name,
      items: [
        { name: 'Special Chicken Boneless Biryani', price: 345, qty: 2, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop' },
        { name: 'Guntur Chicken Fry (Dry)', price: 280, qty: 1, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop' },
      ],
      subtotal: 970,
      deliveryFee: 40,
      discount: 100,
      taxes: 49,
      total: 959,
      couponCode: 'WELCOME100',
      status: 'delivered',
      deliveryAddress: customer.addresses[0],
      deliveryPartner: deliveryUser._id,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      rating: 5,
      review: 'Incredible flavours! Arrived hot and fresh within 25 minutes.',
    });

    const sampleOrder2 = await Order.create({
      user: customer._id,
      restaurant: createdRestaurants[1]._id,
      restaurantName: createdRestaurants[1].name,
      items: [
        { name: 'All American Cheese Burger', price: 260, qty: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop' },
        { name: 'Creamy Penne Alfredo with Mushroom', price: 320, qty: 1, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop' },
      ],
      subtotal: 580,
      deliveryFee: 0,
      discount: 0,
      taxes: 29,
      total: 609,
      status: 'preparing',
      deliveryAddress: customer.addresses[0],
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000),
    });

    console.log('✅ Created initial sample orders.');
    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('──────────────────────────────────────────────────');
    console.log('🔑 TEST ACCOUNTS:');
    console.log('  • Admin:      admin@feastrocket.com      / admin123');
    console.log('  • Restaurant: restaurant@feastrocket.com / resto123');
    console.log('  • Delivery:   delivery@feastrocket.com   / delivery123');
    console.log('  • Customer:   user@feastrocket.com       / user123');
    console.log('──────────────────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder Error:', err);
    process.exit(1);
  }
}

seed();
