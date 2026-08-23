import DeliveryAssignment from "../models/deliveryAssignment.model.js"
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"
import Item from "../models/item.model.js"
import { sendDeliveryOtpMail } from "../utils/mail.js"
import RazorPay from "razorpay"
import dotenv from "dotenv"

dotenv.config()

const instance = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                message: "cart is empty"
            })
        }

        if (
            !deliveryAddress?.text ||
            deliveryAddress.latitude == null ||
            deliveryAddress.longitude == null
        ) {
            return res.status(400).json({
                message: "send complete deliveryAddress"
            })
        }

        const groupItemsByShop = {}

        cartItems.forEach(item => {
            // Handle populated shop object vs string ID
            const shopId = item.shop?._id ? item.shop._id.toString() : item.shop.toString()

            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }

            groupItemsByShop[shopId].push(item)
        })

        let serverTotalAmount = 0;

        const shopOrders = await Promise.all(
            Object.keys(groupItemsByShop).map(async (shopId) => {
                const shop = await Shop.findById(shopId).populate("owner")

                if (!shop) {
                    throw new Error("shop not found")
                }

                const items = groupItemsByShop[shopId]
                let subtotal = 0;
                
                const shopOrderItems = await Promise.all(items.map(async (clientItem) => {
                    const dbItem = await Item.findById(clientItem.id);
                    if (!dbItem) throw new Error("Item not found");
                    
                    if (dbItem.shop.toString() !== shopId.toString()) {
                        throw new Error(`Item ${dbItem.name} does not belong to the selected shop`);
                    }
                    
                    const quantity = Number(clientItem.quantity);
                    if (isNaN(quantity) || quantity <= 0) throw new Error("Invalid quantity");
                    
                    subtotal += dbItem.price * quantity;
                    
                    return {
                        item: dbItem._id,
                        name: dbItem.name,
                        price: dbItem.price,
                        quantity: quantity
                    };
                }));
                
                serverTotalAmount += subtotal;

                return {
                    shop: shop._id,
                    owner: shop.owner ? shop.owner._id : null,
                    subtotal,
                    shopOrderItems
                }
            })
        )

        if (paymentMethod === "online") {
            const razorOrder = await instance.orders.create({
                amount: Math.round(serverTotalAmount * 100),
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            })

            const newOrder = await Order.create({
                user: req.userId,
                paymentMethod,
                deliveryAddress,
                totalAmount: serverTotalAmount,
                shopOrders,
                razorpayOrderId: razorOrder.id,
                payment: false
            })

            return res.status(200).json({
                razorOrder,
                orderId: newOrder._id
            })
        }

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount: serverTotalAmount,
            shopOrders
        })

        await newOrder.populate(
            "shopOrders.shopOrderItems.item",
            "name image price"
        )
        await newOrder.populate("shopOrders.shop", "name")
        await newOrder.populate(
            "shopOrders.owner",
            "name socketId"
        )
        await newOrder.populate(
            "user",
            "name email mobile"
        )

        const io = req.app.get("io")

        if (io) {
            newOrder.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner?.socketId

                if (ownerSocketId) {
                    io.to(ownerSocketId).emit("newOrder", {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress,
                        payment: newOrder.payment
                    })
                }
            })
        }

        return res.status(201).json(newOrder)

    } catch (error) {
        console.error("PLACE ORDER ERROR:", error)

        return res.status(500).json({
            message: `place order error ${error.message}`
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body

        const payment = await instance.payments.fetch(
            razorpay_payment_id
        )

        if (!payment || payment.status !== "captured") {
            return res.status(400).json({
                message: "payment not captured"
            })
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        if (order.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "unauthorized order access"
            })
        }

        if (payment.order_id !== order.razorpayOrderId) {
            return res.status(400).json({
                message: "payment does not match this order"
            })
        }

        if (order.payment) {
            return res.status(200).json(order)
        }

        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id

        await order.save()

        await order.populate(
            "shopOrders.shopOrderItems.item",
            "name image price"
        )
        await order.populate(
            "shopOrders.shop",
            "name"
        )
        await order.populate(
            "shopOrders.owner",
            "name socketId"
        )
        await order.populate(
            "user",
            "name email mobile"
        )

        const io = req.app.get("io")

        if (io) {
            order.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner?.socketId

                if (ownerSocketId) {
                    io.to(ownerSocketId).emit("newOrder", {
                        _id: order._id,
                        paymentMethod: order.paymentMethod,
                        user: order.user,
                        shopOrders: shopOrder,
                        createdAt: order.createdAt,
                        deliveryAddress: order.deliveryAddress,
                        payment: order.payment
                    })
                }
            })
        }

        return res.status(200).json(order)

    } catch (error) {
        console.error("VERIFY PAYMENT ERROR:", error)

        return res.status(500).json({
            message: `verify payment error ${error.message}`
        })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        if (user.role === "user") {
            const orders = await Order.find({
                user: req.userId
            })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate(
                    "shopOrders.owner",
                    "name email mobile"
                )
                .populate(
                    "shopOrders.shopOrderItems.item",
                    "name image price"
                )

            return res.status(200).json(orders)
        }

        if (user.role === "owner") {
            const orders = await Order.find({
                "shopOrders.owner": req.userId
            })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate(
                    "shopOrders.shopOrderItems.item",
                    "name image price"
                )
                .populate(
                    "shopOrders.assignedDeliveryBoy",
                    "fullName mobile"
                )

            const filteredOrders = orders.map(order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(
                    orderItem =>
                        String(orderItem.owner?._id) ===
                        String(req.userId)
                ),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                payment: order.payment
            }))

            return res.status(200).json(filteredOrders)
        }

        return res.status(400).json({
            message: "unsupported user role"
        })

    } catch (error) {
        console.error("GET MY ORDERS ERROR:", error)

        return res.status(500).json({
            message: `get User order error ${error.message}`
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        const shopOrder = order.shopOrders.find(
            orderItem =>
                String(orderItem.shop) === String(shopId)
        )

        if (!shopOrder) {
            return res.status(400).json({
                message: "shop order not found"
            })
        }

        shopOrder.status = status

        let deliveryBoysPayload = []

        if (
            status === "out of delivery" &&
            !shopOrder.assignment
        ) {
            const { longitude, latitude } = order.deliveryAddress

            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [
                                Number(longitude),
                                Number(latitude)
                            ]
                        },
                        $maxDistance: 5000
                    }
                }
            })

            const nearByIds = nearByDeliveryBoys.map(
                boy => boy._id
            )

            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: {
                    $nin: [
                        "brodcasted",
                        "completed"
                    ]
                }
            }).distinct("assignedTo")

            const busyIdSet = new Set(
                busyIds.map(id => String(id))
            )

            const availableBoys =
                nearByDeliveryBoys.filter(
                    boy =>
                        !busyIdSet.has(
                            String(boy._id)
                        )
                )

            const candidates = availableBoys.map(
                boy => boy._id
            )

            if (candidates.length === 0) {
                await order.save()

                return res.status(200).json({
                    message:
                        "order status updated but there is no available delivery boys"
                })
            }

            const deliveryAssignment =
                await DeliveryAssignment.create({
                    order: order._id,
                    shop: shopOrder.shop,
                    shopOrderId: shopOrder._id,
                    brodcastedTo: candidates,
                    status: "brodcasted"
                })

            shopOrder.assignment =
                deliveryAssignment._id

            deliveryBoysPayload =
                availableBoys.map(boy => ({
                    id: boy._id,
                    fullName: boy.fullName,
                    longitude:
                        boy.location.coordinates?.[0],
                    latitude:
                        boy.location.coordinates?.[1],
                    mobile: boy.mobile
                }))

            await deliveryAssignment.populate("order")
            await deliveryAssignment.populate("shop")

            const io = req.app.get("io")

            if (io) {
                availableBoys.forEach(boy => {
                    const boySocketId =
                        boy.socketId

                    if (!boySocketId) return

                    const assignmentShopOrder =
                        deliveryAssignment.order.shopOrders.find(
                            shopOrderItem =>
                                shopOrderItem._id.equals(
                                    deliveryAssignment.shopOrderId
                                )
                        )

                    io.to(boySocketId).emit(
                        "newAssignment",
                        {
                            sentTo: boy._id,
                            assignmentId:
                                deliveryAssignment._id,
                            orderId:
                                deliveryAssignment.order._id,
                            shopName:
                                deliveryAssignment.shop.name,
                            deliveryAddress:
                                deliveryAssignment.order
                                    .deliveryAddress,
                            items:
                                assignmentShopOrder
                                    ?.shopOrderItems || [],
                            subtotal:
                                assignmentShopOrder?.subtotal
                        }
                    )
                })
            }
        }

        await order.save()

        const updatedShopOrder =
            order.shopOrders.find(
                orderItem =>
                    String(orderItem.shop) ===
                    String(shopId)
            )

        await order.populate(
            "shopOrders.shop",
            "name"
        )

        await order.populate(
            "shopOrders.assignedDeliveryBoy",
            "fullName email mobile"
        )

        await order.populate(
            "user",
            "socketId"
        )

        const io = req.app.get("io")

        if (io && order.user?.socketId) {
            io.to(order.user.socketId).emit(
                "update-status",
                {
                    orderId: order._id,
                    shopId: updatedShopOrder.shop._id,
                    status: updatedShopOrder.status,
                    userId: String(order.user._id)
                }
            )
        }

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy:
                updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment:
                updatedShopOrder?.assignment?._id
        })

    } catch (error) {
        console.error("ORDER STATUS ERROR:", error)

        return res.status(500).json({
            message: `order status error ${error.message}`
        })
    }
}

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId

        const assignments =
            await DeliveryAssignment.find({
                brodcastedTo: deliveryBoyId,
                status: "brodcasted"
            })
                .populate("order")
                .populate("shop")

        const formatted = assignments
            .filter(
                assignment =>
                    assignment.order &&
                    assignment.shop
            )
            .map(assignment => {
                const shopOrder =
                    assignment.order.shopOrders.find(
                        orderItem =>
                            orderItem._id.equals(
                                assignment.shopOrderId
                            )
                    )

                return {
                    assignmentId:
                        assignment._id,
                    orderId:
                        assignment.order._id,
                    shopName:
                        assignment.shop.name,
                    deliveryAddress:
                        assignment.order
                            .deliveryAddress,
                    items:
                        shopOrder?.shopOrderItems ||
                        [],
                    subtotal:
                        shopOrder?.subtotal
                }
            })

        return res.status(200).json(formatted)

    } catch (error) {
        console.error(
            "GET DELIVERY ASSIGNMENT ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `get Assignment error ${error.message}`
        })
    }
}

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params

        const assignment =
            await DeliveryAssignment.findById(
                assignmentId
            )

        if (!assignment) {
            return res.status(400).json({
                message: "assignment not found"
            })
        }

        if (assignment.status !== "brodcasted") {
            return res.status(400).json({
                message:
                    `assignment is ${assignment.status}`
            })
        }

        const alreadyAssigned =
            await DeliveryAssignment.findOne({
                assignedTo: req.userId,
                status: "assigned"
            })

        if (alreadyAssigned) {
            return res.status(400).json({
                message:
                    "You are already assigned to another order"
            })
        }

        const order =
            await Order.findById(
                assignment.order
            )

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        const shopOrder =
            order.shopOrders.id(
                assignment.shopOrderId
            )

        if (!shopOrder) {
            return res.status(400).json({
                message: "shop order not found"
            })
        }

        assignment.assignedTo =
            req.userId

        assignment.status =
            "assigned"

        assignment.acceptedAt =
            new Date()

        shopOrder.assignedDeliveryBoy =
            req.userId

        await assignment.save()
        await order.save()

        return res.status(200).json({
            message:
                "order accepted successfully"
        })

    } catch (error) {
        console.error(
            "ACCEPT ORDER ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `accept order error ${error.message}`
        })
    }
}

export const getCurrentOrder = async (req, res) => {
    try {
        const assignment =
            await DeliveryAssignment.findOne({
                assignedTo: req.userId,
                status: "assigned"
            })
                .populate("shop", "name")
                .populate(
                    "assignedTo",
                    "fullName email mobile location"
                )
                .populate({
                    path: "order",
                    populate: [
                        {
                            path: "user",
                            select:
                                "fullName email location mobile"
                        }
                    ]
                })

        if (!assignment) {
            return res.status(400).json({
                message: "assignment not found"
            })
        }

        if (!assignment.order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        const shopOrder =
            assignment.order.shopOrders.find(
                orderItem =>
                    String(orderItem._id) ===
                    String(
                        assignment.shopOrderId
                    )
            )

        if (!shopOrder) {
            return res.status(400).json({
                message: "shopOrder not found"
            })
        }

        let deliveryBoyLocation = {
            lat: null,
            lon: null
        }

        const coordinates =
            assignment.assignedTo?.location
                ?.coordinates

        if (
            Array.isArray(coordinates) &&
            coordinates.length === 2
        ) {
            deliveryBoyLocation.lat =
                coordinates[1]

            deliveryBoyLocation.lon =
                coordinates[0]
        }

        let customerLocation = {
            lat: null,
            lon: null
        }

        if (assignment.order.deliveryAddress) {
            customerLocation.lat =
                assignment.order
                    .deliveryAddress.latitude

            customerLocation.lon =
                assignment.order
                    .deliveryAddress.longitude
        }

        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress:
                assignment.order
                    .deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })

    } catch (error) {
        console.error(
            "GET CURRENT ORDER ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `get current order error ${error.message}`
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params

        const order =
            await Order.findById(orderId)
                .populate("user")
                .populate({
                    path: "shopOrders.shop",
                    model: "Shop"
                })
                .populate({
                    path:
                        "shopOrders.assignedDeliveryBoy",
                    model: "User"
                })
                .populate({
                    path:
                        "shopOrders.shopOrderItems.item",
                    model: "Item"
                })
                .lean()

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        return res.status(200).json(order)

    } catch (error) {
        console.error(
            "GET ORDER BY ID ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `get by id order error ${error.message}`
        })
    }
}

export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } =
            req.body

        if (!orderId || !shopOrderId) {
            return res.status(400).json({
                message:
                    "orderId and shopOrderId are required"
            })
        }

        const order =
            await Order.findById(orderId)
                .populate("user")

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        const shopOrder =
            order.shopOrders.id(shopOrderId)

        if (!shopOrder) {
            return res.status(400).json({
                message: "shop order not found"
            })
        }

        const assignment =
            await DeliveryAssignment.findOne({
                order: order._id,
                shopOrderId: shopOrder._id,
                assignedTo: req.userId,
                status: "assigned"
            })

        if (!assignment) {
            return res.status(400).json({
                message:
                    "Active delivery assignment not found"
            })
        }

        if (shopOrder.status === "delivered") {
            return res.status(400).json({
                message: "Order is already delivered"
            })
        }

        const otp =
            Math.floor(
                1000 +
                Math.random() * 9000
            ).toString()

        shopOrder.deliveryOtp = otp

        shopOrder.otpExpires =
            new Date(
                Date.now() +
                5 * 60 * 1000
            )

        await order.save()

        await sendDeliveryOtpMail(
            order.user,
            otp
        )

        return res.status(200).json({
            message:
                `OTP sent successfully to ${order.user?.fullName}`
        })

    } catch (error) {
        console.error(
            "SEND DELIVERY OTP ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `delivery otp error ${error.message}`
        })
    }
}

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const {
            orderId,
            shopOrderId,
            otp
        } = req.body

        if (!orderId || !shopOrderId || !otp) {
            return res.status(400).json({
                message:
                    "orderId, shopOrderId and otp are required"
            })
        }

        const order =
            await Order.findById(orderId)

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        const shopOrder =
            order.shopOrders.id(shopOrderId)

        if (!shopOrder) {
            return res.status(400).json({
                message: "invalid shopOrderId"
            })
        }

        const enteredOtp =
            String(otp).trim()

        const savedOtp =
            String(
                shopOrder.deliveryOtp || ""
            ).trim()

        if (
            savedOtp !== enteredOtp ||
            !shopOrder.otpExpires ||
            new Date(
                shopOrder.otpExpires
            ).getTime() < Date.now()
        ) {
            return res.status(400).json({
                message:
                    "Invalid or expired OTP"
            })
        }

        const assignment =
            await DeliveryAssignment.findOne({
                order: order._id,
                shopOrderId: shopOrder._id,
                assignedTo: req.userId
            })

        if (!assignment) {
            return res.status(400).json({
                message:
                    "Delivery assignment not found"
            })
        }

        if (assignment.status !== "assigned") {
            return res.status(400).json({
                message:
                    `Delivery assignment is ${assignment.status}`
            })
        }

        shopOrder.status = "delivered"
        shopOrder.deliveredAt =
            new Date()

        shopOrder.deliveryOtp = null
        shopOrder.otpExpires = null

        assignment.status =
            "completed"

        await order.save()
        await assignment.save()

        return res.status(200).json({
            message:
                "Order Delivered Successfully!"
        })

    } catch (error) {
        console.error(
            "VERIFY DELIVERY OTP ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `verify delivery otp error ${error.message}`
        })
    }
}

export const getTodayDeliveries = async (req, res) => {
    try {
        const deliveryBoyId =
            req.userId

        const startsOfDay =
            new Date()

        startsOfDay.setHours(
            0,
            0,
            0,
            0
        )

        const orders =
            await Order.find({
                "shopOrders.assignedDeliveryBoy":
                    deliveryBoyId,
                "shopOrders.status":
                    "delivered",
                "shopOrders.deliveredAt":
                    {
                        $gte: startsOfDay
                    }
            }).lean()

        const todaysDeliveries = []

        orders.forEach(order => {
            order.shopOrders.forEach(
                shopOrder => {
                    if (
                        String(
                            shopOrder.assignedDeliveryBoy
                        ) ===
                        String(
                            deliveryBoyId
                        ) &&
                        shopOrder.status ===
                            "delivered" &&
                        shopOrder.deliveredAt &&
                        new Date(
                            shopOrder.deliveredAt
                        ) >= startsOfDay
                    ) {
                        todaysDeliveries.push(
                            shopOrder
                        )
                    }
                }
            )
        })

        const stats = {}

        todaysDeliveries.forEach(
            shopOrder => {
                const hour =
                    new Date(
                        shopOrder.deliveredAt
                    ).getHours()

                stats[hour] =
                    (stats[hour] || 0) + 1
            }
        )

        const formattedStats =
            Object.keys(stats).map(
                hour => ({
                    hour: parseInt(hour),
                    count: stats[hour]
                })
            )

        formattedStats.sort(
            (a, b) => a.hour - b.hour
        )

        return res.status(200).json(
            formattedStats
        )

    } catch (error) {
        console.error(
            "GET TODAY DELIVERIES ERROR:",
            error
        )

        return res.status(500).json({
            message:
                `today deliveries error ${error.message}`
        })
    }
}
