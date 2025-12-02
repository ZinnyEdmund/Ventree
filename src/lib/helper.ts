document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(theme);
  });
  
export function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  export function transformTimestamp(timestamp: string) {
    const isoDate = new Date(timestamp)

    // Extracting components
    const year = isoDate.getFullYear()
    const month = isoDate.getMonth() + 1 // Month is zero-based
    const day = isoDate.getDate()
    const hours = isoDate.getHours()
    const minutes = isoDate.getMinutes()
    const seconds = isoDate.getSeconds()

    // Formatting the date and time
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`

    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
        seconds < 10 ? '0' : ''
    }${seconds}`

    return `${formattedDate} ${formattedTime}`
}

export const formatPriceInDollar = (price: number) => {
    const dollarsAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price / 100)
    return dollarsAmount
}

export const formatPriceInNaira = (price: number) => {
    const nairaAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(price)
    return nairaAmount
}

export function truncateTextWithStringMethod(text: string, maxLength: number) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Format date to DD/MM/YYYY format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const cleanObject = (obj: any): any => {
  // Handle null, undefined, and empty strings
  if (obj === null || obj === undefined || obj === "") return undefined;
  
  // Handle primitives (non-objects)
  if (typeof obj !== "object") return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map(item => cleanObject(item))
      .filter(item => item !== undefined);
    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }
  
  // Handle objects
  const cleanedObj: Record<string, any> = {};
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue; // Skip inherited properties
    
    const cleanedValue = cleanObject(obj[key]);
    
    // Only add to cleanedObj if value is not undefined
    if (cleanedValue !== undefined) {
      cleanedObj[key] = cleanedValue;
    }
  }
  
  // Return undefined if object is empty after cleaning, otherwise return the cleaned object
  return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
};

export const calculateProfitMargin = (profit: number, revenue: number): number => {
  if (revenue === 0) return 0; // avoid division by zero
  return (profit / revenue) * 100;
};