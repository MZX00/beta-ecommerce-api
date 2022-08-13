import order from "../model/order.js";
import user from "../model/user.js";
import product from "../model/product.js";
import moment from "moment";
import jwt from "jsonwebtoken";

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
    const pagelimit = 20;
    //initial page loading
    if (
      !req.body.progressPrevID &&
      !req.body.deliveredPrevID &&
      !req.body.cancelledPrevID
    ) {
      let data = [];
      for (let i = 0; i < 3; i++) {
        const status =
          i === 0 ? "inprogress" : i === 1 ? "cancelled" : "completed";
        const result = await order.find({ status: status }).limit(pagelimit);
        data.push(
          //adding username
          await Promise.all(
            result.map(async (n) => {
              const userData = await user
                .findById(n.userid)
                .select({ name: 1 });

              //adding product name
              const products = await Promise.all(
                n._doc.products.map(async (p) => {
                  const productData = await product
                    .findById(p._id)
                    .select({ name: 1, image: 1, price: 1 });
                  return { ...p._doc, name: productData.name };
                })
              );

              return {
                ...n._doc,
                products: products,
                userName: userData.name,
              };
            })
          )
        );
      }
      res.status(200).json({
        inprogress: data[0],
        cancelled: data[1],
        completed: data[2],
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch all orders", message: err.message },
      body: {},
    });
  }
};

export const viewUserOrder = async (req, res) => {
  try {
    const pagelimit = 20;
    //initial page loading
    if (
      !req.body.progressPrevID &&
      !req.body.deliveredPrevID &&
      !req.body.cancelledPrevID
    ) {
      let data = [];
      const userData = await user.findById(req.body.userid).select({ name: 1 });
      for (let i = 0; i < 3; i++) {
        const status =
          i === 0 ? "inprogress" : i === 1 ? "cancelled" : "completed";
        const result = await order
          .find({ status: status, userid: req.body.userid })
          .limit(pagelimit);
        data.push(
          //adding username

          await Promise.all(
            result.map(async (n) => {
              //adding product name
              const products = await Promise.all(
                n._doc.products.map(async (p) => {
                  const productData = await product
                    .findById(p._id)
                    .select({ name: 1, image: 1 });
                  return { ...p._doc, name: productData.name };
                })
              );

              return {
                ...n._doc,
                products: products,
              };
            })
          )
        );
      }
      res.status(200).json({
        inprogress: data[0],
        cancelled: data[1],
        completed: data[2],
        name: userData.name,
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch orders", message: err.message },
      body: {},
    });
  }
};
