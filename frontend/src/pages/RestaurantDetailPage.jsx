import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiStar, HiClock, HiOutlineCurrencyRupee, HiArrowLeft, HiSearch } from 'react-icons/hi';
import ReviewCard from '../components/ReviewCard';
import { SkeletonMenuRow } from '../components/SkeletonLoader';

const RESTAURANT_DATA = {
  "1": {
    info: { name: "Meghana Foods", cuisines: "Biryani, Andhra, South Indian", rating: "4.4", deliveryTime: "31 mins", costForTwo: "₹500 for two", location: "Koramangala, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
    menus: [
      { category: "Biryani & Rice", items: [
        { id: 'm1', name: 'Chicken Boneless Biryani', price: 345, desc: 'Special boneless chicken chunks cooked with aromatic basmati rice and signature Andhra spices.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop' },
        { id: 'm2', name: 'Mutton Biryani',           price: 420, desc: 'Tender mutton marrow layered with fragrant biryani rice, fried onions and mint.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop' },
        { id: 'm3', name: 'Paneer Biryani',           price: 290, desc: 'Fresh paneer cubes layered with long grain basmati rice and whole spices.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop' },
      ]},
      { category: "South Indian Specials", items: [
        { id: 'm6', name: 'Pesarattu (Green Moong Dosa)', price: 130, desc: 'Crispy green moong dal crepe served with ginger chutney and upma stuffing.', isVeg: true,  isBestSeller: true,  image: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=400&auto=format&fit=crop' },
        { id: 'm7', name: 'Rasam Rice',                  price: 110, desc: 'Comforting thin pepper-tamarind soup served over soft steamed rice.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop' },
      ]},
      { category: "Andhra Starters", items: [
        { id: 'm4', name: 'Guntur Chicken Dry', price: 280, desc: 'Fiery deep fried chicken tossed with curry leaves and Guntur chillies.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&auto=format&fit=crop' },
        { id: 'm5', name: 'Chilli Paneer',     price: 240, desc: 'Stir fried paneer tossed in spicy soy sauce and bell peppers.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "2": {
    info: { name: "Empire Restaurant", cuisines: "North Indian, Mughlai, Kebabs", rating: "4.2", deliveryTime: "40 mins", costForTwo: "₹700 for two", location: "Church Street, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    menus: [
      { category: "Tandoor & Kebabs", items: [
        { id: 'e1', name: 'Empire Special Chicken Kebab', price: 280, desc: 'Signature crispy spiced chicken pieces with mint chutney.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop' },
        { id: 'e2', name: 'Tandoori Chicken (Half)',      price: 320, desc: 'Clay oven roasted chicken marinated in yogurt, lemon and tandoori masala.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&auto=format&fit=crop' },
        { id: 'e5', name: 'Seekh Kebab (4 pcs)',          price: 260, desc: 'Minced mutton mixed with herbs and spices, skewered and grilled in tandoor.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop' },
      ]},
      { category: "Curries & Bread", items: [
        { id: 'e3', name: 'Butter Chicken Masala', price: 350, desc: 'Rich creamy tomato gravy with tender roasted chicken — the classic favourite.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop' },
        { id: 'e4', name: 'Garlic Naan',           price: 70,  desc: 'Fluffy tandoor baked flatbread infused with garlic, butter and cilantro.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop' },
        { id: 'e6', name: 'Dal Makhani',           price: 220, desc: 'Slow-cooked black lentils simmered overnight in butter and cream.', isVeg: true,  isBestSeller: true,  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "3": {
    info: { name: "Truffles", cuisines: "American, Burgers, Pasta, Desserts", rating: "4.6", deliveryTime: "25 mins", costForTwo: "₹800 for two", location: "Indiranagar, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
    menus: [
      { category: "Gourmet Burgers", items: [
        { id: 't1', name: 'All American Cheese Burger', price: 250, desc: 'Juicy beef patty, cheddar cheese, lettuce, tomatoes and secret sauce on a brioche bun.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop' },
        { id: 't2', name: 'Crispy Veggie Burger',       price: 190, desc: 'Crispy potato & pea patty with eggless mayo and fresh lettuce on a sesame bun.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop' },
        { id: 't5', name: 'Smoky BBQ Chicken Burger',  price: 280, desc: 'Grilled chicken, smoked gouda, caramelised onions and BBQ sauce.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1619881590738-a111d176d906?w=400&auto=format&fit=crop' },
      ]},
      { category: "Pizzas & Pasta", items: [
        { id: 't3', name: 'Margarita Pizza (10")',  price: 350, desc: 'Classic Napoletana pizza with fresh basil, san marzano tomatoes and mozzarella.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop' },
        { id: 't4', name: 'Penne Alfredo',          price: 320, desc: 'Penne pasta in a rich creamy parmesan white sauce with garlic and mushrooms.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop' },
        { id: 't6', name: 'Spaghetti Arrabbiata',  price: 290, desc: 'Spicy tomato sauce with garlic, red chilli flakes and fresh basil.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&auto=format&fit=crop' },
      ]},
      { category: "Desserts", items: [
        { id: 't7', name: 'Chocolate Lava Cake', price: 180, desc: 'Warm chocolate cake with a gooey molten centre, served with vanilla ice cream.', isVeg: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "4": {
    info: { name: "Corner House Ice Cream", cuisines: "Desserts, Ice Cream, Shakes", rating: "4.8", deliveryTime: "20 mins", costForTwo: "₹400 for two", location: "Jayanagar, Bangalore" },
    coverImage: '',
    menus: [
      { category: "Signature Sundaes", items: [
        { id: 'c1', name: 'Death by Chocolate',   price: 290, desc: 'Dark chocolate cake, chocolate ice cream, chocolate sauce, cherries and peanuts.', isVeg: true, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop' },
        { id: 'c2', name: 'Cake Fudge',           price: 210, desc: 'Vanilla ice cream with hot chocolate fudge and rich sponge cake.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&auto=format&fit=crop' },
        { id: 'c4', name: 'Fresh Fruit Sundae',   price: 230, desc: 'Scoops of fruit sorbet topped with seasonal fresh fruits and berry coulis.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&auto=format&fit=crop' },
      ]},
      { category: "Shakes & Coolers", items: [
        { id: 'c3', name: 'Oreo Shake',           price: 150, desc: 'Thick creamy milkshake blended with Oreo cookies and vanilla ice cream.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop' },
        { id: 'c5', name: 'Mango Mastani',        price: 180, desc: 'Thick mango shake topped with ice cream, dry fruits and rose syrup.', isVeg: true, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "5": {
    info: { name: "A2B — Adyar Ananda Bhavan", cuisines: "South Indian, Sweets, Pure Veg", rating: "4.3", deliveryTime: "30 mins", costForTwo: "₹300 for two", location: "Whitefield, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=800&auto=format&fit=crop',
    menus: [
      { category: "Classic South Indian", items: [
        { id: 'a1', name: 'Masala Dosa',         price: 120, desc: 'Crispy golden rice crepe stuffed with spiced potato mash. Served with sambar and 3 chutneys.', isVeg: true, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=400&auto=format&fit=crop' },
        { id: 'a2', name: 'Idli Vada Combo',    price: 110, desc: 'Two soft idlis and one crispy medu vada served with sambar and coconut chutney.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop' },
        { id: 'a4', name: 'Ghee Pongal',        price: 130, desc: 'Karnataka-style rice and lentil porridge tempered with ghee, pepper and cashews.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop' },
        { id: 'a5', name: 'Set Dosa (3 pcs)',   price: 100, desc: 'Soft, fluffy, slightly fermented small dosas served with potato sabji and chutney.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=400&auto=format&fit=crop' },
        { id: 'a6', name: 'Bisibelebath',       price: 140, desc: 'Traditional Karnataka dish of rice, lentils and vegetables cooked in tamarind gravy.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop' },
      ]},
      { category: "Filter Coffee & Beverages", items: [
        { id: 'a7', name: 'Filter Coffee (Degree)', price: 60, desc: 'Authentic South Indian filter coffee served in a traditional brass tumbler-davara set.', isVeg: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop' },
        { id: 'a8', name: 'Badam Milk',            price: 80, desc: 'Warm saffron almond milk with cardamom and dry fruits.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop' },
      ]},
      { category: "Sweets & Mithai", items: [
        { id: 'a3', name: 'Gulab Jamun (2 pcs)', price: 90,  desc: 'Hot milk dumplings soaked in rose-flavoured sugar syrup, served warm.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop' },
        { id: 'a9', name: 'Kaju Katli (100g)',   price: 120, desc: 'Premium cashew fudge with silver vark — the classic Indian festive sweet.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "6": {
    info: { name: "California Burrito", cuisines: "Mexican, Healthy, Salads", rating: "4.5", deliveryTime: "25 mins", costForTwo: "₹500 for two", location: "HSR Layout, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop',
    menus: [
      { category: "Burritos & Bowls", items: [
        { id: 'cb1', name: 'Crispy Chicken Burrito', price: 260, desc: 'Flour tortilla wrapped with cilantro lime rice, beans, crispy chicken and pico de gallo.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop' },
        { id: 'cb2', name: 'BBQ Paneer Bowl',       price: 240, desc: 'Healthy bowl with brown rice, black beans, BBQ paneer and corn salsa.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop' },
        { id: 'cb4', name: 'Veggie Fajita Wrap',    price: 210, desc: 'Grilled bell peppers, onions and zucchini with sour cream in a warm flour tortilla.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop' },
      ]},
      { category: "Sides & Extras", items: [
        { id: 'cb3', name: 'Nachos with Guacamole', price: 180, desc: 'Crispy tortilla chips served with freshly made guacamole, salsa and sour cream.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop' },
        { id: 'cb5', name: 'Churros (4 pcs)',       price: 150, desc: 'Warm cinnamon fried dough sticks served with a rich chocolate dipping sauce.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "7": {
    info: { name: "Vidyarthi Bhavan", cuisines: "South Indian, Breakfast, Pure Veg", rating: "4.7", deliveryTime: "28 mins", costForTwo: "₹250 for two", location: "Gandhi Bazaar, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=800&auto=format&fit=crop',
    menus: [
      { category: "Vidyarthi Specials", items: [
        { id: 'vb1', name: 'Benne Masala Dosa',    price: 130, desc: 'The iconic 80-year-old recipe — crispy butter dosa with a generous potato masala stuffing.', isVeg: true, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1630383249896-483b1fbf6e5f?w=400&auto=format&fit=crop' },
        { id: 'vb2', name: 'Khali Dosa (Plain)',   price: 80,  desc: 'Crispy thin plain dosa with coconut chutney and sambar. Deceptively simple, absolutely perfect.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop' },
        { id: 'vb3', name: 'Rava Idli',            price: 90,  desc: 'Fluffy semolina idli with ghee, mustard seeds, curry leaves and cashews.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop' },
        { id: 'vb4', name: 'Kesari Bath',          price: 70,  desc: 'South Indian saffron semolina halwa with ghee, cashews and raisins. Warm and comforting.', isVeg: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&auto=format&fit=crop' },
      ]},
      { category: "Meals", items: [
        { id: 'vb5', name: 'South Indian Meals', price: 180, desc: 'Rice, sambar, rasam, kootu, poriyal, papadam, pickle and payasam — a complete thali.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop' },
      ]},
      { category: "Beverages", items: [
        { id: 'vb6', name: 'Filter Coffee',  price: 50, desc: 'Classic South Indian filter coffee with frothy milk and chicory blend.', isVeg: true, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop' },
        { id: 'vb7', name: 'Fresh Lime Soda', price: 60, desc: 'Chilled lime soda — sweet, salt, or both. The ultimate Bangalore thirst quencher.', isVeg: true, isBestSeller: false, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop' },
      ]},
    ]
  },

  "8": {
    info: { name: "Nandhana Palace", cuisines: "South Indian, Andhra, Biryani", rating: "4.4", deliveryTime: "35 mins", costForTwo: "₹600 for two", location: "Jayanagar, Bangalore" },
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
    menus: [
      { category: "Signature Biryani", items: [
        { id: 'np1', name: 'Nandhana Chicken Biryani', price: 320, desc: 'Dum-cooked Andhra style biryani with whole spices, mint and slow-cooked chicken.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop' },
        { id: 'np2', name: 'Prawn Biryani',            price: 380, desc: 'Succulent tiger prawns layered with saffron basmati and coastal spices.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop' },
        { id: 'np3', name: 'Veg Dum Biryani',          price: 240, desc: 'Mixed vegetables and paneer dum-cooked with basmati rice and whole spices.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format&fit=crop' },
      ]},
      { category: "Andhra Curries", items: [
        { id: 'np4', name: 'Gongura Mutton Curry', price: 360, desc: 'Andhra signature — tender mutton cooked in tangy, fiery gongura (sorrel) leaves gravy.', isVeg: false, isBestSeller: true,  image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop' },
        { id: 'np5', name: 'Chicken Chettinad',    price: 320, desc: 'Aromatic Tamil Nadu style chicken curry with freshly ground Chettinad spice paste.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop' },
        { id: 'np6', name: 'Pesarattu Curry',      price: 180, desc: 'Andhra style green moong dal gravy with ginger and green chillies.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop' },
      ]},
      { category: "South Indian Thali", items: [
        { id: 'np7', name: 'Andhra Meals (Full)',  price: 200, desc: 'Unlimited rice, sambar, 3 curries, rasam, curd, papad, pickle and payasam.', isVeg: false, isBestSeller: false, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop' },
        { id: 'np8', name: 'Veg Thali',           price: 160, desc: 'Rice, sambar, kootu, poriyal, papadam, pickle and sweet — wholesome and filling.', isVeg: true,  isBestSeller: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop' },
      ]},
    ]
  },
};

const DEMO_REVIEWS = [
  { user: { name: 'Priya Sharma' }, rating: 5, foodRating: 5, deliveryRating: 4, comment: 'Absolutely amazing! The food was perfectly cooked and arrived piping hot. Will definitely order again!', isVerified: true, createdAt: '2024-03-15' },
  { user: { name: 'Rahul Verma' }, rating: 4, foodRating: 4, deliveryRating: 5, comment: 'Great food, fast delivery. The portion size is very generous for the price!', isVerified: true, createdAt: '2024-03-10' },
  { user: { name: 'Ananya Krishnan' }, rating: 5, foodRating: 5, deliveryRating: 5, comment: 'Best food in Bangalore! The flavours are super authentic and the packaging is excellent. Highly recommend.', isVerified: false, createdAt: '2024-03-05' },
];

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { dispatch, getItemQty } = useCart();
  const [activeTab, setActiveTab] = useState('menu');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const data = RESTAURANT_DATA[id] || RESTAURANT_DATA["1"];
  const { info, coverImage, menus } = data;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [id]);

  const handleAdd = (item) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id: item.id, name: item.name, price: item.price, image: item.image, restaurantId: id, restaurantName: info.name }
    });
  };

  const handleRemove = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id } });
  };

  const filteredMenus = menus
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (vegOnly && !item.isVeg) return false;
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      {/* Hero Cover */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={coverImage} alt={info.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link to="/restaurants"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
          <HiArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Restaurant Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{info.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{info.cuisines}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">📍 {info.location}</p>
            </div>
            <div className="bg-green-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
              <HiStar className="w-4 h-4" />
              <span className="font-bold">{info.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-dashed border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiClock className="w-4 h-4 text-[#ff5200]" /> {info.deliveryTime}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineCurrencyRupee className="w-4 h-4 text-[#ff5200]" /> {info.costForTwo}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">10K+ ratings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-2xl p-1 mb-6 border border-gray-100 dark:border-gray-700">
          {['menu', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                activeTab === tab ? 'bg-[#ff5200] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
              {tab === 'menu' ? '🍽 Menu' : '⭐ Reviews'}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <>
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search menu…" className="input-base pl-9 h-10 text-sm" />
              </div>
              <button onClick={() => setVegOnly(v => !v)}
                className={`shrink-0 px-4 h-10 rounded-xl border-2 text-sm font-semibold transition-all ${
                  vegOnly
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-400'
                }`}>
                🌿 Veg
              </button>
            </div>

            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-6">
                    <div className="skeleton h-7 w-48 rounded" />
                    <SkeletonMenuRow /><SkeletonMenuRow />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredMenus.map((cat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-lg font-black text-gray-900 dark:text-white">
                        {cat.category} <span className="text-sm font-normal text-gray-400">({cat.items.length})</span>
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {cat.items.map(item => {
                        const qty = getItemQty(item.id);
                        return (
                          <div key={item.id} className="flex gap-4 p-5">
                            <div className="flex-1 min-w-0">
                              <div className={item.isVeg ? 'veg-dot mb-2' : 'nonveg-dot mb-2'} />
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h3>
                                {item.isBestSeller && (
                                  <span className="badge badge-orange text-[10px]">⭐ Bestseller</span>
                                )}
                              </div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">₹{item.price}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{item.desc}</p>
                            </div>

                            <div className="relative w-28 h-24 shrink-0">
                              <img src={item.image} alt={item.name}
                                className="w-full h-full object-cover rounded-xl"
                                loading="lazy"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop'; }} />

                              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24">
                                {qty === 0 ? (
                                  <button onClick={() => handleAdd(item)}
                                    className="w-full bg-white dark:bg-gray-800 border-2 border-[#ff5200] text-[#ff5200] font-black text-sm py-1.5 rounded-lg shadow-md hover:bg-[#ff5200] hover:text-white transition-all">
                                    ADD
                                  </button>
                                ) : (
                                  <div className="flex items-center justify-between bg-[#ff5200] rounded-lg shadow-md overflow-hidden">
                                    <button onClick={() => handleRemove(item)}
                                      className="text-white font-black text-lg px-2.5 py-1.5 hover:bg-orange-600 transition-colors">−</button>
                                    <span className="text-white font-black text-sm">{qty}</span>
                                    <button onClick={() => handleAdd(item)}
                                      className="text-white font-black text-lg px-2.5 py-1.5 hover:bg-orange-600 transition-colors">+</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredMenus.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="font-bold text-gray-700 dark:text-gray-200">No items match your search</p>
                    <button onClick={() => { setSearchQuery(''); setVegOnly(false); }}
                      className="btn-outline mt-4 px-6 py-2 text-sm">
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-6">
                <div className="text-center shrink-0">
                  <p className="text-5xl font-black text-gray-900 dark:text-white">{info.rating}</p>
                  <div className="flex gap-0.5 justify-center my-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <HiStar key={i} className={`w-5 h-5 ${i <= Math.round(info.rating) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">10K+ ratings</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-6">{star === 5 ? '60%' : star === 4 ? '25%' : star === 3 ? '10%' : star === 2 ? '3%' : '2%'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {DEMO_REVIEWS.map((r, i) => <ReviewCard key={i} review={r} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;