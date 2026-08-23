import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body;

        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const shop = await Shop.findOne({
            owner: req.userId
        });

        if (!shop) {
            return res.status(400).json({
                message: "shop not found"
            });
        }

        const item = await Item.create({
            name,
            category,
            foodType,
            price,
            image,
            shop: shop._id
        });

        shop.items.push(item._id);

        await shop.save();

        await shop.populate("owner");

        await shop.populate({
            path: "items",
            options: {
                sort: {
                    updatedAt: -1
                }
            }
        });

        return res.status(201).json(shop);

    } catch (error) {
        console.error("ADD ITEM ERROR:", error);

        return res.status(500).json({
            message: `add item error ${error.message}`
        });
    }
};


export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const {
            name,
            category,
            foodType,
            price
        } = req.body;

        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(403).json({ message: "unauthorized: you don't own a shop" });
        }
        
        const existingItem = await Item.findById(itemId);
        if (!existingItem) {
            return res.status(400).json({ message: "item not found" });
        }
        
        if (existingItem.shop.toString() !== shop._id.toString()) {
            return res.status(403).json({ message: "unauthorized to edit this item" });
        }

        const updateData = {
            name,
            category,
            foodType,
            price
        };

        if (req.file) {
            updateData.image =
                await uploadOnCloudinary(req.file.path);
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            updateData,
            {
                new: true
            }
        );

        if (!item) {
            return res.status(400).json({
                message: "item not found"
            });
        }

        await shop.populate({
            path: "items",
        }).populate({
            path: "items",
            options: {
                sort: {
                    updatedAt: -1
                }
            }
        });

        return res.status(200).json(shop);

    } catch (error) {
        console.error("EDIT ITEM ERROR:", error);

        return res.status(500).json({
            message: `edit item error ${error.message}`
        });
    }
};


export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(400).json({
                message: "item not found"
            });
        }

        return res.status(200).json(item);

    } catch (error) {
        console.error("GET ITEM ERROR:", error);

        return res.status(500).json({
            message: `get item error ${error.message}`
        });
    }
};


export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        await shop.populate({
            path: "items",
        });
        
        if (!shop) {
            return res.status(403).json({ message: "unauthorized: you don't own a shop" });
        }
        
        const existingItem = await Item.findById(itemId);
        if (!existingItem) {
            return res.status(400).json({ message: "item not found" });
        }
        
        if (existingItem.shop.toString() !== shop._id.toString()) {
            return res.status(403).json({ message: "unauthorized to delete this item" });
        }

        const item = await Item.findByIdAndDelete(itemId);

        if (shop) {
            shop.items = shop.items.filter(
                id => String(id) !== String(item._id)
            );

            await shop.save();

            await shop.populate({
                path: "items",
                options: {
                    sort: {
                        updatedAt: -1
                    }
                }
            });
        }

        return res.status(200).json(shop);

    } catch (error) {
        console.error("DELETE ITEM ERROR:", error);

        return res.status(500).json({
            message: `delete item error ${error.message}`
        });
    }
};


export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params;

        if (
            !city ||
            city === "null" ||
            city === "undefined"
        ) {
            return res.status(400).json({
                message: "valid city is required"
            });
        }

        // First search for real shops in the requested city
        let shops = await Shop.find({
            city: {
                $regex: new RegExp(
                    `^${city.trim()}$`,
                    "i"
                )
            }
        });

        // If no shops exist, use default demo shops
        if (shops.length === 0) {
            shops = await Shop.find({
                isDefault: true
            });
        }

        const shopIds = shops.map(
            shop => shop._id
        );

        // Get items belonging to those shops
        const items = await Item.find({
            shop: {
                $in: shopIds
            }
        }).populate("shop", "name image city");

        return res.status(200).json(items);

    } catch (error) {
        console.error(
            "GET ITEM BY CITY ERROR:",
            error
        );

        return res.status(500).json({
            message:
                `get item by city error ${error.message}`
        });
    }
};


export const getItemsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await Shop.findById(
            shopId
        ).populate("items");

        if (!shop) {
            return res.status(400).json({
                message: "shop not found"
            });
        }

        return res.status(200).json({
            shop,
            items: shop.items
        });

    } catch (error) {
        console.error(
            "GET ITEM BY SHOP ERROR:",
            error
        );

        return res.status(500).json({
            message:
                `get item by shop error ${error.message}`
        });
    }
};


export const searchItems = async (req, res) => {
    try {
        const {
            query,
            city
        } = req.query;

        if (!query || !city) {
            return res.status(400).json({
                message:
                    "query and city are required"
            });
        }

        let shops = await Shop.find({
            city: {
                $regex: new RegExp(
                    `^${city.trim()}$`,
                    "i"
                )
            }
        });

        // Fallback to demo shops
        if (shops.length === 0) {
            shops = await Shop.find({
                isDefault: true
            });
        }

        const shopIds = shops.map(
            shop => shop._id
        );

        const items = await Item.find({
            shop: {
                $in: shopIds
            },
            $or: [
                {
                    name: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        }).populate(
            "shop",
            "name image city"
        );

        return res.status(200).json(items);

    } catch (error) {
        console.error(
            "SEARCH ITEM ERROR:",
            error
        );

        return res.status(500).json({
            message:
                `search item error ${error.message}`
        });
    }
};


export const rating = async (req, res) => {
    try {
        const {
            itemId,
            rating: userRating
        } = req.body;

        if (!itemId || userRating == null) {
            return res.status(400).json({
                message:
                    "itemId and rating is required"
            });
        }

        if (
            userRating < 1 ||
            userRating > 5
        ) {
            return res.status(400).json({
                message:
                    "rating must be between 1 to 5"
            });
        }

        const item = await Item.findById(
            itemId
        );

        if (!item) {
            return res.status(400).json({
                message: "item not found"
            });
        }

        const oldCount =
            item.rating?.count || 0;

        const oldAverage =
            item.rating?.average || 0;

        const newCount =
            oldCount + 1;

        const newAverage =
            (
                oldAverage * oldCount +
                Number(userRating)
            ) / newCount;

        item.rating.count =
            newCount;

        item.rating.average =
            Number(
                newAverage.toFixed(1)
            );

        await item.save();

        return res.status(200).json({
            rating: item.rating
        });

    } catch (error) {
        console.error(
            "RATING ERROR:",
            error
        );

        return res.status(500).json({
            message:
                `rating error ${error.message}`
        });
    }
};
