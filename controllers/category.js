import category from "../model/category.js";
import user from "../model/user.js";
import product from "../model/product.js";
import moment from "moment";
import jwt from "jsonwebtoken";

/* **************** */
/*  Main Category   */
/* **************** */

export const getMainCategories = async (req, res) => {
  try {
    const result = await category.find(
      { subCategories: { $ne: [] } },
      "-subCategories"
    );
    res.status(200).json({ header: { message: "success" }, body: { result } });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch categories", message: err.message },
      body: {},
    });
  }
};

export const createMainCategory = async (req, res) => {
  try {
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }
    await category.create({
      name: req.body.name,
      image,
      subCategories: JSON.parse(req.body.subCategories),
      //Products need to be sorted before insert
      products: req.body.products ? JSON.parse(req.body.products) : [],
    });
    res.status(200).json({ header: { message: "success" }, body: {} });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch categories", message: err.message },
      body: {},
    });
  }
};

export const addProductToSubCategory = async (req, res) => {};

/* **************** */
/*   Sub Category   */
/* **************** */

export const getSubCategories = async (req, res) => {
  try {
    let categories = await category
      .findById(req.body._id, "subCategories")
      .populate("subCategories");
    res.status(200).json({ header: { message: "success" }, body: categories });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch categories", message: err.message },
      body: {},
    });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    let image = "";
    if (req.file) {
      image = req.file.filename;
    }
    const result = await category.create({
      name: req.body.name,
      image,
      //Products need to be sorted before insert
      products: JSON.parse(req.body.products),
    });
    res.status(200).json({
      header: { message: "success" },
      body: {
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to fetch categories", message: err.message },
      body: {},
    });
  }
};
