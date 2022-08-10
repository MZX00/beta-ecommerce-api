import order from "../model/order";
import moment from "moment";

export const createOrder = async (req, res) => {
  try {
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);
    await order.create({
      userid: data.id,
      products: req.body.products,
      dateCreated: moment(),
      status: "inprogress",
      cost: req.body.cost,
    });
    res.status(200).json({
      header: { message: "Order created" },
      body: {},
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to create order", message: err.message },
      body: {},
    });
  }
};

export const viewAllOrders = async (req, res) => {
  try {
    const query = req.body.prevID ? { _id: { $gt: req.body.prevID } } : {};
    const pagelimit = 20;

    const result = await order
      .find(query)
      .limit(pagelimit)
      .select({ _id: 1, name: 1, price: 1, image: 1 });
    if (result) {
      res.status(200).json({
        header: { message: "success" },
        body: { orders: result },
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch all orders", message: err.message },
      body: {},
    });
  }
};
