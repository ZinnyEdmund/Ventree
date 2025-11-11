export const stats = [
  { title: "Sales",  Icon: "mdi:monetization_on", value: "₦540,000,000", description: "What you have sold" },
  { title: "Expenses",  Icon: "", value: "₦50,000", description: "What you spent" },
  {
    title: "Low Stock",
     Icon: "", value: "10 Items",
    description: "Almost Finished",
    variant: "warning" as const,
  },
  {
    title: "Profit",
     Icon: "", value: "₦100,000",
    description: "How much you made",
    variant: "success" as const,
  },
];

export const actions = [
  { title: "Record Sale", description: "Add a new sale quickly" },
  { title: "Add Goods", description: "Add new items to your stock" },
  { title: "Manage Employees", description: "View or add shop attendants" },
  { title: "View Report", description: "See your shop's performance" },
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