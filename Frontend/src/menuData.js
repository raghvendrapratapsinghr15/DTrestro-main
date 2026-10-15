// ============================================================
//  MENU DATA FILE — Downtown Restaurant
//   Edit THIS file to add/remove/update menu items.
//
//  Each item has:
//    id        — unique number
//    name      — dish name
//    desc      — short description (keep it under 2 lines)
//    price     — price string, e.g. "₹250"
//    category  — "Starters" | "Main Course" | "Fast Food" | "Desserts" | "Drinks"
//    isVeg     — true = veg (green dot), false = non-veg (red dot)
//    image     — image path inside /public folder, e.g. "/dinner1.jpeg"
//    badge     — "Popular" | "Chef's Special" | "" (empty = no badge)
// ============================================================

export const menuData = [
  // ─── STARTERS ────────────────────────────────────────────────
  {
    id: 1,
    name: "Crispy Veg Platter",
    desc: "A colourful mix of golden spring rolls, crunchy corn bites & smoky paneer tikka. Great for sharing!",
    price: "₹299",
    category: "Starters",
    isVeg: true,
    image: "/sandwich.png",
    badge: "Popular",
  },
  {
    id: 2,
    name: "Grilled Chicken Wings",
    desc: "Tender, juicy wings soaked in smoky BBQ marinade and grilled over an open flame. Lick-your-fingers good.",
    price: "₹349",
    category: "Starters",
    isVeg: false,
    image: "/dinner1.jpeg",
    badge: "Chef's Special",
  },
  {
    id: 3,
    name: "Mussels Soup",
    desc: "Silky, rich broth brimming with plump fresh mussels, garlic, cream and a hint of white wine.",
    price: "₹249",
    category: "Starters",
    isVeg: false,
    image: "/dinner4.png",
    badge: "",
  },
  {
    id: 4,
    name: "Hummus & Pita",
    desc: "Velvety smooth chickpea hummus drizzled with olive oil, served with warm toasted pita bread.",
    price: "₹199",
    category: "Starters",
    isVeg: true,
    image: "/breakfast1.png",
    badge: "",
  },

  // ─── MAIN COURSE ─────────────────────────────────────────────
  {
    id: 5,
    name: "Roasted Lamb Rump",
    desc: "Slow-roasted lamb with a herb crust, rich rosemary jus and a side of buttery seasonal vegetables.",
    price: "₹799",
    category: "Main Course",
    isVeg: false,
    image: "/dinner1.jpeg",
    badge: "Chef's Special",
  },
  {
    id: 6,
    name: "Citrus Cured Salmon",
    desc: "Delicate Norwegian salmon, bright citrus cure, silky dill cream and tangy pickled cucumber. Light and luxurious.",
    price: "₹699",
    category: "Main Course",
    isVeg: false,
    image: "/dinner2.png",
    badge: "Popular",
  },
  {
    id: 7,
    name: "Pan Seared Sea Bass",
    desc: "Crispy-skin sea bass fillet over grilled asparagus, finished with a zesty lemon butter sauce.",
    price: "₹749",
    category: "Main Course",
    isVeg: false,
    image: "/breakfast1.png",
    badge: "",
  },
  {
    id: 8,
    name: "Italian Spaghetti",
    desc: "Al-dente spaghetti tossed in our classic slow-cooked marinara, topped with fresh basil and parmesan.",
    price: "₹399",
    category: "Main Course",
    isVeg: true,
    image: "/dinner5.png",
    badge: "Popular",
  },
  {
    id: 9,
    name: "Paneer Butter Masala",
    desc: "Soft pillowy paneer cubes in a rich, creamy tomato-butter gravy. Pairs perfectly with naan.",
    price: "₹299",
    category: "Main Course",
    isVeg: true,
    image: "/dinner3.png",
    badge: "",
  },

  // ─── FAST FOOD ───────────────────────────────────────────────
  {
    id: 10,
    name: "Beef Burger Meal",
    desc: "Two juicy beef patties, melted cheddar, crisp lettuce, pickles — served with a mountain of golden fries.",
    price: "₹449",
    category: "Fast Food",
    isVeg: false,
    image: "/lunch1.png",
    badge: "Popular",
  },
  {
    id: 11,
    name: "Margherita Pizza",
    desc: "Hand-stretched dough, tangy tomato sauce, 100% mozzarella and fresh basil. Simple, perfect, classic.",
    price: "₹349",
    category: "Fast Food",
    isVeg: true,
    image: "/dinner6.png",
    badge: "",
  },
  {
    id: 12,
    name: "Loaded French Fries",
    desc: "Crispy golden fries smothered in cheesy sauce, jalapeños and cool sour cream. A snack that hits hard.",
    price: "₹199",
    category: "Fast Food",
    isVeg: true,
    image: "/sandwich.png",
    badge: "",
  },
  {
    id: 13,
    name: "Grilled Fish Wrap",
    desc: "Flaky grilled fish, crunchy cabbage slaw and smoky chipotle mayo wrapped in a warm toasted tortilla.",
    price: "₹329",
    category: "Fast Food",
    isVeg: false,
    image: "/dinner6.png",
    badge: "Chef's Special",
  },

  // ─── DESSERTS ─────────────────────────────────────────────────
  {
    id: 14,
    name: "Chocolate Brownie",
    desc: "Warm, gooey fudge brownie with a scoop of vanilla ice cream and a pour of hot chocolate sauce.",
    price: "₹249",
    category: "Desserts",
    isVeg: true,
    image: "/dinner3.png",
    badge: "Popular",
  },
  {
    id: 15,
    name: "Strawberry Delight",
    desc: "Fresh strawberries filled with sweet cream cheese and drizzled generously with dark chocolate. Gorgeous and delicious.",
    price: "₹199",
    category: "Desserts",
    isVeg: true,
    image: "/dinner3.png",
    badge: "Chef's Special",
  },
  {
    id: 16,
    name: "Mango Panna Cotta",
    desc: "Silky Italian panna cotta with a bright mango coulis on top. Light, refreshing and impossible to resist.",
    price: "₹179",
    category: "Desserts",
    isVeg: true,
    image: "/breakfast1.png",
    badge: "",
  },

  // ─── DRINKS ───────────────────────────────────────────────────
  {
    id: 17,
    name: "Cold Coffee",
    desc: "Chilled espresso blended with fresh cream, chocolate syrup and crushed ice. The ultimate afternoon pick-me-up.",
    price: "₹149",
    category: "Drinks",
    isVeg: true,
    image: "/dinner2.png",
    badge: "Popular",
  },
  {
    id: 18,
    name: "Mango Mint Cooler",
    desc: "Fresh mango juice muddled with cool mint, squeezed lime and bubbly soda. Sweet, tangy and super refreshing.",
    price: "₹129",
    category: "Drinks",
    isVeg: true,
    image: "/dinner2.png",
    badge: "",
  },
  {
    id: 19,
    name: "Virgin Mojito",
    desc: "Crushed mint, fresh lime juice, sugar syrup and soda — poured over ice for the most refreshing sip.",
    price: "₹119",
    category: "Drinks",
    isVeg: true,
    image: "/dinner2.png",
    badge: "",
  },
  {
    id: 20,
    name: "Masala Chai Latte",
    desc: "Fragrant Indian spices — cardamom, ginger, cinnamon — blended with strong tea and steamed milk. Pure comfort.",
    price: "₹99",
    category: "Drinks",
    isVeg: true,
    image: "/dinner2.png",
    badge: "Chef's Special",
  },
];

// ─── CATEGORIES — add/remove category tabs here ──────────────
export const categories = ["All", "Starters", "Main Course", "Fast Food", "Desserts", "Drinks"];
