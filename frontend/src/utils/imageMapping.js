import image1 from "../assets/image1.jpg"
import image2 from "../assets/image2.webp"
import image3 from "../assets/image3.jpg"
import image4 from "../assets/image4.avif"
import image5 from "../assets/image5.jpg"
import image6 from "../assets/image6.jpg"
import image7 from "../assets/image7.jpg"
import image8 from "../assets/image8.avif"
import image9 from "../assets/image9.jpg"
import image10 from "../assets/image10.avif"
import image11 from "../assets/image11.jpg"

export const foodImages = {
    "Margherita Pizza": image4,
    "Paneer Tikka Pizza": image4,
    "Farmhouse Pizza": image4,
    "Veggie Burst Pizza": image4,
    "Chicken Pepperoni Pizza": image4,
    "Cheesy Garlic Bread": image1,
    "Butter Chicken": image8,
    "Paneer Butter Masala": image8,
    "Biryani": image8,
    "Momos": image9,
    "Burger": image5,
    "Fries": image10,
    "Dessert": image3,
    "default": image2
}

export const shopImages = {
    "Vingo Pizza House": image4,
    "Punjab Spice Kitchen": image8,
    "South Indian Cafe": image7,
    "Chinese Corner": image9,
    "Burger Joint": image5,
    "default": image11
}

export const getFoodImage = (name) => {
    // If it's not a data URL and is a valid http link, we could return it,
    // but the prompt explicitly states to replace SVG/data URL images.
    // Let's check if the name matches our mapping.
    for (const key in foodImages) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return foodImages[key];
        }
    }
    return foodImages.default;
}

export const getShopImage = (name) => {
    for (const key in shopImages) {
        if (name.toLowerCase().includes(key.toLowerCase())) {
            return shopImages[key];
        }
    }
    return shopImages.default;
}
