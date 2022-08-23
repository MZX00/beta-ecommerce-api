import product from "../model/product.js";
import category from "../model/category.js";

export const addProduct = async (req, res) => {
  try {
    if (req.body.name.trim() && req.body.price) {
      let name = req.body.name;
      let brand = req.body.brand;
      let image = "";
      if (req.file) {
        image = req.file.filename;
      }
      let des = req.body.description;

      if (des) {
        des = des.trim();
      }
      if (brand) {
        brand = brand.trim();
      }
      if (image) {
        image = image.trim();
      }
      await product.create({
        name: name,
        price: req.body.price,
        discount: req.body.discount,
        stock: req.body.stock,
        description: des ? des : "",
        brand: brand ? brand : "",
        image: image ? image : "",
        color: req.body.color ? JSON.parse(req.body.color) : undefined,
        size: req.body.size ? JSON.parse(req.body.size) : undefined,
      });

      res.status(200).json({
        heaeder: { message: "New Product added" },
        body: {},
      });
    } else {
      throw {
        title: "Failed to add Product",
        message: "Invalid or missing product details",
      };
    }
  } catch (err) {
    res.status(500).json({
      header: { message: err.message },
      body: {},
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let result = await product.deleteOne({ _id: req.body._id });

    res.status(200).json({
      header: { message: "Product deleted successfully" },
      body: { result },
    });
  } catch (err) {
    res.status(500).json({
      header: { message: err.message },
      body: {},
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    //id of the product to update
    let query = { _id: req.body._id };
    // new values of the product
    let newValue = {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        stock: req.body.stock,
        brand: req.body.brand,
        image: req.body.image,
        color: req.body.color,
        size: req.body.size,
      },
    };

    // changing in database
    let result = await product.updateOne(query, newValue);

    res.status(200).json({
      header: { message: "Product deleted successfully" },
      body: { result },
    });
  } catch (err) {
    res.status(500).json({
      header: { message: err.message },
      body: {},
    });
  }
};

export const viewProductSingle = async (req, res) => {
  try {
    if (req.body._id) {
      const result = await product.findById(req.body._id);
      if (result) {
        res.status(200).json({
          header: { message: "success" },
          body: {
            product: {
              name: result.name,
              description: result.description,
              price: result.price,
              discount: result.discount,
              stock: result.stock,
              brand: result.brand,
              image: result.image,
              color: result.color,
              size: result.size,
            },
          },
        });
      } else {
        throw {
          title: "Failed to fetch Product",
          message: "Product not found",
        };
      }
    } else {
      throw {
        title: "Failed to fetch Product",
        message: "Missing product id",
      };
    }
  } catch (err) {
    res.status(500).json({
      header: err,
      body: {},
    });
  }
};

export const viewProductList = async (req, res) => {
  try {
    const query = req.body.prevID ? { _id: { $gt: req.body.prevID } } : {};
    const pagelimit = 100;

    const result = await product.find(query).limit(pagelimit).select({
      _id: 1,
      name: 1,
      price: 1,
      stock: 1,
      discount: 1,
      image: 1,
      size: 1,
      color: 1,
    });
    if (result) {
      res.status(200).json({
        header: { message: "success" },
        body: { products: result },
      });
    } else {
      res.status(500).json({
        header: { title: "No Products", message: "There are no products." },
        body: {},
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { message: err.message },
    });
  }
};

export const viewProductListCategory = async (req, res) => {
  try {
    const query = req.body.prevProductID
      ? { _id: req.body._id, products: { $gt: req.body.prevProductID } }
      : { _id: req.body._id };
    const pagelimit = 20;

    const result = await category
      .find(query, "products")
      .populate("products")
      .limit(pagelimit);
    if (result) {
      res.status(200).json({
        header: { message: "success" },
        body: { products: result[0].products },
      });
    } else {
      res.status(500).json({
        header: { title: "No Products", message: "There are no products." },
        body: {},
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { message: err.message },
    });
  }
};
