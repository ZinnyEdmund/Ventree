export const stats = [
  { title: "Sales",  Icon: "ic:outline-monetization-on", value: "₦540,000,000", description: "What you have sold" },
  { title: "Expenses",  Icon: "ic:outline-monetization-on", value: "₦50,000", description: "What you spent" },
  {
    title: "Low Stock",
     Icon: "ic:outline-trending-down", value: "10 Items",
    description: "Almost Finished",
    variant: "warning" as const,
  },
  {
    title: "Profit",
     Icon: "ic:outline-trending-up", value: "₦100,000",
    description: "How much you made",
    variant: "success" as const,
  },
];

export const expenseStats = [
  { title: "Expenses",  Icon: "ic:outline-monetization-on", value: "₦50,000,000", description: "What you have sold" } ]

export const actions = [
  { title: "Record Sale", icon: "ic:outline-list-alt", description: "Add a new sale quickly", to:"/record-sales" },
  { title: "Add Goods", icon: "ic:outline-shopping-bag", description: "Add new items to your stock", to:"/stocks" },
  { title: "Manage Employees", icon: "ic:outline-person-add-alt", description: "View or add shop attendants", to:"/setup-shop" },
  { title: "Add Expenses", icon: "ic:outline-remove", description: "Add what you have spent", to:"/expenses" },
];

export const salesHistory = [
  {
    product: "Malt Drink",
    price: "₦2,400",
    soldBy: "Sold by Chika",
    time: "10 mins ago",
  },
  {
    product: "Rice (10kg)",
    price: "₦12,000",
    soldBy: "Sold by Uche",
    time: "1 hr ago",
  },
  {
    product: "Sugar",
    price: "₦800",
    soldBy: "Sold by You",
    time: "2 hrs ago",
  },
  {
    product: "Malt Drink",
    price: "₦2,400",
    soldBy: "Sold by Uche",
    time: "3 hrs ago",
  },
];

export const notifications = [
  "Sugar stock running low (3 left)",
  "Belloxi Biscuit has moved to best seller",
];

// Sales trend data
export const salesTrendData = [
  { day: "Mon", amount: 65000 },
  { day: "Tue", amount: 72000 },
  { day: "Wed", amount: 68000 },
  { day: "Thu", amount: 85000 },
  { day: "Fri", amount: 95000 },
  { day: "Sat", amount: 80000 },
  { day: "Sun", amount: 70000 },
];

// Best sellers data
export const bestSellers = [
  {
    product: "Premium Rice 50kg",
    unitsSold: 145,
    revenue: 725000,
    contribution: 28.5,
  },
  {
    product: "Vegetable Oil 5L",
    unitsSold: 230,
    revenue: 460000,
    contribution: 18.1,
  },
  {
    product: "Tomato Paste Carton",
    unitsSold: 180,
    revenue: 360000,
    contribution: 14.2,
  },
  {
    product: "Sugar 1kg Pack",
    unitsSold: 310,
    revenue: 310000,
    contribution: 12.2,
  },
  {
    product: "Salt 500g",
    unitsSold: 420,
    revenue: 210000,
    contribution: 8.3,
  },
];

// Low stock alerts
export const lowStockAlerts = [
  {
    product: "Premium Rice 50kg",
    currentStock: 12,
    status: "critical" as const,
  },
  {
    product: "Vegetable Oil 5L",
    currentStock: 18,
    status: "critical" as const,
  },
  {
    product: "Tomato Paste Carton",
    currentStock: 35,
    status: "low" as const,
  },
  { product: "Sugar 1kg Pack", currentStock: 42, status: "low" as const },
  { product: "Salt 500g", currentStock: 46, status: "low" as const },
];

export const expensesData = [
  {
    category: "Product Purchase",
    amount: 725000,
    percentage: 65,
    color: "#59DC59",
    date: "28/10/2025",
    note: "Stock replenishment",
  },
  {
    category: "Misc",
    amount: 50000,
    percentage: 5,
    color: "#6A8B77",
    date: "28/10/2025",
    note: "Office supplies & minor expenses",
  },
  {
    category: "Utilities",
    amount: 250000,
    percentage: 22,
    color: "#CDFC54",
    date: "28/10/2025",
    note: "Electricity, water, internet bills",
  },
  {
    category: "Delivery",
    amount: 90000,
    percentage: 8,
    color: "#073E1E",
    date: "28/10/2025",
    note: "Logistics and delivery costs",
  },
];

export const profitTrendData = [
  {
    period: "Week 1",
    revenue: 480000,
    expenses: 110000,
    profit: 370000,
  },
  // ... more weeks
];