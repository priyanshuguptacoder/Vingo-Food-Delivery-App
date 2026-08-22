import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body;

        let image;

        if (req.file) {
            console.log(req.file);
            image = await uploadOnCloudinary(req.file.path);
        }

        let shop = await Shop.findOne({
            owner: req.userId
        });

        if (!shop) {
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image,
                owner: req.userId,
                isDefault: false
            });
        } else {
            shop = await Shop.findByIdAndUpdate(
                shop._id,
                {
                    name,
                    city,
                    state,
                    address,
                    owner: req.userId,
                    ...(image && { image }),
                    isDefault: false
                },
                {
                    new: true
                }
            );
        }

        await shop.populate("owner items");

        return res.status(201).json(shop);

    } catch (error) {
        console.error("CREATE/EDIT SHOP ERROR:", error);

        return res.status(500).json({
            message: `create shop error ${error.message}`
        });
    }
};


export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({
            owner: req.userId
        })
            .populate("owner")
            .populate({
                path: "items",
                options: {
                    sort: {
                        updatedAt: -1
                    }
                }
            });

        if (!shop) {
            return res.status(200).json(null);
        }

        return res.status(200).json(shop);

    } catch (error) {
        console.error("GET MY SHOP ERROR:", error);

        return res.status(500).json({
            message: `get my shop error ${error.message}`
        });
    }
};


export const getShopByCity = async (req, res) => {
    try {
        const { city } = req.params;

        if (!city || city === "null" || city === "undefined") {
            return res.status(400).json({
                message: "valid city is required"
            });
        }

        // First try to find shops in the user's actual city
        let shops = await Shop.find({
            city: {
                $regex: new RegExp(
                    `^${city.trim()}$`,
                    "i"
                )
            }
        }).populate("items");

        // If no shops exist in that city,
        // return the default demo shops
        if (shops.length === 0) {
            shops = await Shop.find({
                isDefault: true
            }).populate("items");
        }

        return res.status(200).json(shops);

    } catch (error) {
        console.error("GET SHOP BY CITY ERROR:", error);

        return res.status(500).json({
            message: `get shop by city error ${error.message}`
        });
    }
};
