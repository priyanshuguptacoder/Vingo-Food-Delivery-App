import pizza1 from "../assets/food/pizza/1.jpg"
import pizza2 from "../assets/food/pizza/2.jpg"
import pizza3 from "../assets/food/pizza/3.jpg"

import burger1 from "../assets/food/burgers/1.jpg"
import burger2 from "../assets/food/burgers/2.jpg"
import burger3 from "../assets/food/burgers/3.jpg"

import sandwich1 from "../assets/food/sandwiches/1.jpg"
import sandwich2 from "../assets/food/sandwiches/2.jpg"
import sandwich3 from "../assets/food/sandwiches/3.jpg"

import biryani1 from "../assets/food/biryani/1.jpg"
import biryani2 from "../assets/food/biryani/2.jpg"
import biryani3 from "../assets/food/biryani/3.jpg"

import north1 from "../assets/food/north-indian/1.jpg"
import north2 from "../assets/food/north-indian/2.jpg"
import north3 from "../assets/food/north-indian/3.jpg"

import chinese1 from "../assets/food/chinese/1.jpg"
import chinese2 from "../assets/food/chinese/2.jpg"
import chinese3 from "../assets/food/chinese/3.jpg"

import snacks1 from "../assets/food/snacks/1.jpg"
import snacks2 from "../assets/food/snacks/2.jpg"
import snacks3 from "../assets/food/snacks/3.jpg"

import desserts1 from "../assets/food/desserts/1.jpg"
import desserts2 from "../assets/food/desserts/2.jpg"
import desserts3 from "../assets/food/desserts/3.jpg"

import south1 from "../assets/food/south-indian/1.jpg"
import south2 from "../assets/food/south-indian/2.jpg"
import south3 from "../assets/food/south-indian/3.jpg"

import defaultFood from "../assets/image2.webp"
import defaultShop from "../assets/image11.jpg"

const foodImages = {
    pizza: [pizza1, pizza2, pizza3],
    burger: [burger1, burger2, burger3],
    sandwich: [sandwich1, sandwich2, sandwich3],
    biryani: [biryani1, biryani2, biryani3],
    north: [north1, north2, north3],
    chinese: [chinese1, chinese2, chinese3],
    snack: [snacks1, snacks2, snacks3],
    dessert: [desserts1, desserts2, desserts3],
    south: [south1, south2, south3]
}

const shopImages = {
    "Vingo Pizza House": pizza1,
    "Punjab Spice Kitchen": north1,
    "Urban Bite Cafe": burger1,
    "Tandoori Junction": north2,
    "The Food Court": snacks1,
    "Desi Dhaba": north3,
    "Campus Cravings": sandwich1,
    "default": defaultShop
}

// Simple deterministic hash based on string
const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export const getFoodImage = (name) => {
    if(!name) return defaultFood;
    const lowerName = name.toLowerCase();
    
    let category = "snack"; // default
    if (lowerName.includes("pizza")) category = "pizza";
    else if (lowerName.includes("burger")) category = "burger";
    else if (lowerName.includes("sandwich")) category = "sandwich";
    else if (lowerName.includes("biryani")) category = "biryani";
    else if (lowerName.includes("chicken") || lowerName.includes("paneer") || lowerName.includes("naan")) category = "north";
    else if (lowerName.includes("noodles") || lowerName.includes("momos") || lowerName.includes("rice")) category = "chinese";
    else if (lowerName.includes("dessert") || lowerName.includes("cake") || lowerName.includes("chocolate") || lowerName.includes("ice cream")) category = "dessert";
    else if (lowerName.includes("dosa") || lowerName.includes("idli") || lowerName.includes("vada")) category = "south";
    
    const imageArray = foodImages[category];
    const index = getHash(name) % imageArray.length;
    
    return imageArray[index];
}

export const getShopImage = (name) => {
    if(!name) return shopImages.default;
    for (const key in shopImages) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return shopImages[key];
        }
    }
    return shopImages.default;
}
