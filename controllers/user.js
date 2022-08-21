import user from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import address from "../model/address.js";

export const signUp = async (req, res) => {
  try {
    // check if email already exists in database
    const result = await user.findOne({ email: req.body.email });
    if (result) {
      throw {
        title: "Account already exists",
        message: "Please login instead",
      };
    }

    // hash password
    let hash = await bcrypt.hash(req.body.password, 10);

    // if all fields are filled
    if (req.body.email && req.body.name) {
      // create acoount
      await user.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
        phone: req.body.phone,
        dob: moment(req.body.dob),
        address: req.body.address ? req.body.address : "",
        admin: false,
      });
      res.status(200).json({
        header: { message: "Sign Up successfull" },
        body: {},
      });
    } else {
      throw {
        title: "Failed to sign up",
        message: "There are missing values.",
      };
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Sign up failed", message: err.message },
      body: {},
    });
  }
};

export const signIn = async (req, res) => {
  try {
    // validate if email exists
    const result = await user.findOne({ email: req.body.email });
    if (result) {
      // check if password is correct
      bcrypt.compare(req.body.password, result.password, (err, success) => {
        if (err) {
          throw err;
        }
        if (success) {
          // create token
          const token = jwt.sign(
            {
              id: result._id,
              email: req.body.email,
            },
            process.env.JWT_SECRET
          );
          console.log(result.admin);
          res.status(200).json({
            header: { message: "success" },
            body: {
              token: token,
              type: result.admin ? "admin" : "user",
            },
          });
        } else {
          res.status(401).json({
            header: {
              title: "Login Failed",
              message: "Invalid Credentials, Please try again",
            },
            body: {},
          });
        }
      });
    } else {
      res.status(401).json({
        header: {
          title: "Failed to login",
          message: "Invalid Credentials, Please try again",
        },
        body: {},
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Login Failed", message: err.message },
      body: {},
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    // if token doesn't exists
    if (!req.body.token) {
      res.status(500).json({
        header: { message: "Token not found" },
        body: {},
      });
    } else {
      // get information from token
      let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

      // get previous (hased)password

      let currUser = await user.findById(data.id);

      // check if the the pervious password entered is correct or not
      let dbPassword = currUser.password;

      bcrypt.compare(
        req.body.prevPassword,
        dbPassword,
        async (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              header: {
                title: "Failed to change password",
                message: err.message,
              },
              body: {},
            });
          }

          if (!isMatch) {
            return res.status(401).json({
              header: {
                title: "Failed to change password",
                message: "Invalid Credentials",
              },
              body: {},
            });
          }

          // hash new password
          let hash = await bcrypt.hash(req.body.newPassword, 10);

          // change the database to new password
          // expecting front end to perform validation

          await user.updateOne(
            {
              _id: data.id,
            },
            {
              $set: {
                password: hash,
              },
            }
          );

          // password changed
          res.status(200).json({
            header: { message: "Password changed successfully" },
            body: {},
          });
        }
      );
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to change password", message: err.message },
      body: {},
    });
  }
};

export const deleteAccount = async (req, res) => {
  // validate token
  try {
    // if token doesn't exists
    if (!req.body.token) {
      res.status(500).json({
        header: { message: "Token not found" },
        body: {},
      });
    } else {
      // get data from token
      let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

      // get user
      let currUser = await user.findById(data.id);

      // check if the the pervious password entered is correct or not
      let dbPassword = currUser.password;

      bcrypt.compare(req.body.password, dbPassword, async (err, isMatch) => {
        // error while comparing
        if (err) {
          return res.status(500).json({
            header: {
              title: "Failed to delete Account",
              message: err.message,
            },
            body: {},
          });
        }

        // if password is incorrect
        if (!isMatch) {
          return res.status(401).json({
            header: {
              title: "Failed to delete Account",
              message: "Please enter correct password",
            },
            body: {},
          });
        }

        // delete account from database //

        let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

        let result = await user.deleteOne({ _id: data.id });

        res.status(200).json({
          header: { message: "Account deleted successfully" },
          body: { result },
        });
      });
    }
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to delete Account", message: err.message },
      body: {},
    });
  }
};

export const getInfo = async (req, res) => {
  // validate token
  try {
    // if token does not exists
    if (!req.body.token) {
      res.status(500).json({
        header: { message: "Token not found" },
        body: {},
      });
      return;
    }

    // get data from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    // check if password is correct
    let currUser = await user.findById(data.id);

    // reutrn the requied information
    res.status(200).json({
      header: { message: "success" },
      body: {
        name: currUser.name,
        email: currUser.email,
        dob: currUser.dob,
      },
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to get account details", message: err.message },
      body: {},
    });
  }
};

export const setName = async (req, res) => {
  try {
    // if token does not exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // get data from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    // get user id from data

    let userId = data.id;

    // check if name is provided

    if (!req.body.name) {
      throw { message: "Name field not provided" };
    }
    // change name in database

    let query = { _id: userId };

    let newValue = { $set: { name: req.body.name } };

    const result = await user.updateOne(query, newValue);

    // display the result
    res.status(200).json({
      header: { message: "Name changed successfully" },
      body: {},
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to set the password", message: err.message },
      body: {},
    });
  }
};

export const addAddress = async (req, res) => {
  try {
    // check if token exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // get userid from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    let userId = data.id;

    if (req.body.fullName && req.body.address) {
      // add address to database
      const res = await address.create({
        userId: userId,
        fullName: req.body.fullName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      });
    }
    res.status(200).json({
      header: { message: "Address added" },
      body: {},
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to set the password", message: err.message },
      body: {},
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    // check if token exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    if (!req.body.addressId) {
      throw { message: "Address id not mentioned :( sad life" };
    }

    // delete address using its id
    let result = await address.deleteOne({ _id: req.body.addressId });

    res.status(200).json({
      header: { message: "Address Deleted" },
      body: {},
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to set the password", message: err.message },
      body: {},
    });
  }
};

export const updateAddres = async (req, res) => {
  try {
    // check if token exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // if address Id not mentioned
    if (!req.body.addressId) {
      throw { message: "Address id not mentioned :( sad life" };
    }

    let query = { _id: addressId };
    // fullName: { type: String, required: true },
    // address: { type: String, required: true },
    // city: { type: String, required: true },
    // state: { type: String, required: true },
    // country: { type: String, required: true },

    let newValue = {
      $set: {
        fullName: req.body.fullName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.city,
        country: req.body.country,
      },
    };

    let result = await address.updateOne(query, newValue);

    res.status(200).json({
      header: { message: "Address updated sucessfully" },
      body: {},
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Failed to set the password", message: err.message },
      body: {},
    });
  }
};

export const viewUserAddress = async (req, res) => {
  try {
    // check if token exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // get userid from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    let userId = data.id;

    let query = { userId: userId };

    let result = await address.find(query);

    res.status(200).json({
      header: { message: "Success" },
      body: { address: result },
    });
  } catch (err) {
    res.status(500).json({
      header: { title: "Unable to fetch User Address", message: err.message },
      body: {},
    });
  }
};

export const viewUserPaymentCard = async (req, res) => {
  try {
    // check if token exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // get userid from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    let userId = data.id;

    let query = { _id: userId };

    let result = user.find(query).paymentCard;

    res.status(200).json({
      header: { message: "Success" },
      body: { result },
    });
  } catch (err) {
    res.status(500).json({
      header: {
        title: "Unable to fetch User Payment Cards",
        message: err.message,
      },
      body: {},
    });
  }
};

export const addPaymentCard = async (req, res) => {
  try {
    // check if token exists
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // get userid from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    let userId = data.id;

    let userObj = user.findById(userId);

    let result = await userObj.paymentCard.create({
      holderName: req.body.holderName,
      expDate: req.body.expDat,
      cardName: req.body.cardName,
    });

    res.status(200).json({
      header: { message: "added payment card in User" },
      body: { result },
    });
  } catch (err) {
    res.status(500).json({
      header: {
        title: "Unable to add Payment Card",
        message: err.message,
      },
      body: {},
    });
  }
};

export const editPaymentCard = async (req, res) => {
  try {
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }

    // get userid from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    let userId = data.id;

    let cardId = req.body.cardId;

    let userReq = await user.findById(userId);

    userReq.paymentCard.id(cardId).holderName = req.body.holderName;
    userReq.paymentCard.id(cardId).expDate = req.body.expDate;
    userReq.paymentCard.id(cardId).cardName = req.body.cardName;

    let result = await await userReq.save();

    res.status(200).json({
      header: { message: "Payment card updated successfully" },
      body: { result },
    });
  } catch (err) {
    res.status(500).json({
      header: {
        title: "Unable to add Payment Card",
        message: err.message,
      },
      body: {},
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    if (!req.body.token) {
      throw { message: "Not Authorized" };
    }
    // get userid from token
    let data = await jwt.decode(req.body.token, process.env.JWT_SECRET);

    let userId = data.id;

    if (!req.body.cardId) {
      throw { message: "card id not provided" };
    }
    let cardId = req.body.cardId;

    // get the user
    let userReq = await user.findById(userId);
    // delete the card's details
    userReq.paymentCard.pull(cardId);
    // save changes :)
    let result = await userReq.save();

    res.status(200).json({
      header: { message: "Payment card updated successfully" },
      body: { result },
    });
  } catch (err) {
    res.status(500).json({
      header: {
        title: "Unable to add Payment Card",
        message: err.message,
      },
      body: {},
    });
  }
};
