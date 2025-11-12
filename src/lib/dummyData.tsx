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

export const actions = [
  { title: "Record Sale", icon: "ic:outline-list-alt", description: "Add a new sale quickly" },
  { title: "Add Goods", icon: "ic:outline-shopping-bag", description: "Add new items to your stock" },
  { title: "Manage Employees", icon: "ic:outline-person-add-alt", description: "View or add shop attendants" },
  { title: "View Report", icon: "ic:outline-remove", description: "See your shop's performance" },
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