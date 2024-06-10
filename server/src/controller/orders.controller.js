import Order from "../models/order.models.js";
import Restaurant from "../models/restaurant.models.js";
import Stripe from "stripe";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const checkoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant is not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );
    ///////
    // console.log(checkoutSessionRequest.deliveryDetails);
    ////////

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString(),
      checkoutSessionRequest.deliveryDetails
    );

    if (!session.url) {
      return res
        .status(500)
        .json({ message: "Error creating stripe sessionS" });
    }

    await newOrder.save();
    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createLineItems = (checkoutSessionRequest, menuItems) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found:${cartItem.menuItemId}`);
    }

    const line_item = {
      price_data: {
        currency: "inr",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
};

const createSession = async (
  lineItems,
  orderId,
  deliveryPrice,
  restaurantId,
  customerDetails
) => {
  const customer = await STRIPE.customers.create({
    name: customerDetails.name,
    address: {
      line1: customerDetails.addressLine,
      city: customerDetails.city,
      postal_code: "12345",
      state: "State",
      country: "IN",
    },
  });

  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    payment_method_types: ["card"],
    customer: customer.id,

    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "inr",
          },
        },
      },
    ],

    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },

    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

export const stripeWebhookHandler = async (req, res) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];

    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";
    await order.save();
  }
  res.status(200).send();
};
