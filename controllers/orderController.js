const Orders = require("../models/orders");
const Cart = require("../models/cart");
const Products = require("../models/products");
const User = require("../models/user");
const Address = require("../models/address");
const Wallet = require("../models/wallet");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const Crypto = require("crypto");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const niceInvoice = require("nice-invoice");

require("dotenv").config();
const key_id = process.env.MY_KEY_ID;
const key_secret = process.env.MY_KEY_SECRET;
function generate_Order_id() {
  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const orderId = `#${timestamp}${randomNumber}`;
  return orderId;
}

var instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

const orderController = {
  orderPlaced: async (req, res) => {
    try {
        console.log("orderplaced");
        const usid = req.session.user;
        const { aid, payment } = req.query;
        const user = await User.findOne({ _id: usid });
        const cartlist = await Cart.findOne({ userID: usid });
        let cart;
        if (cartlist.coupon != null) {
            cart = await Cart.findOne({ userID: usid }).populate("coupon");
        } else {
            cart = cartlist;
        }
        const products = await Products.find();
        const order = await Orders.findOne({ userID: usid });
        const currentDate = new Date();
        const address = await Address.findOne({ userID: usid });
        let placedAddress;
        address.addresses.forEach((el) => {
            if (el._id == aid) {
            placedAddress = el;
            }
        });
        console.log(placedAddress);
        if (payment == "COD" && cart.billTotal <= 1000) {
          if (order) {
            if (cart.coupon != null) {
                const updatedOrder = await Orders.findOneAndUpdate(
                { userID: usid },
                {
                    $push: {
                    orders: [
                        {
                        products: cart.products,
                        date: currentDate,
                        address: placedAddress,
                        billAmount: cart.billTotal,
                        coupon: cart.coupon._id,
                        couponCode: cart.coupon.couponCode,
                        paymentMethod: payment,
                        orderId: generate_Order_id(),
                        },
                    ],
                    },
                },
                { new: true }
                );
            } else {
                const updatedOrder = await Orders.findOneAndUpdate(
                { userID: usid },
                {
                    $push: {
                    orders: [
                        {
                        products: cart.products,
                        date: currentDate,
                        address: placedAddress,
                        billAmount: cart.billTotal,
                        paymentMethod: payment,
                        orderId: generate_Order_id(),
                        },
                    ],
                    },
                },
                { new: true }
                );
            }
          } 
            else {
                if (cart.coupon != null) {
                    const updatedOrder = await Orders.create(
                    {
                        userID: usid,
                        orders: [
                        {
                            products: cart.products,
                            date: currentDate,
                            address: placedAddress,
                            billAmount: cart.billTotal,
                            coupon: cart.coupon._id,
                            couponCode: cart.coupon.couponCode,
                            paymentMethod: payment,
                            orderId: generate_Order_id(),
                        },
                        ],
                    },
                    { new: true }
                    );
                }
                else {
                    const updatedOrder = await Orders.create(
                    {
                        userID: usid,
                        orders: [
                        {
                            products: cart.products,
                            date: currentDate,
                            address: placedAddress,
                            billAmount: cart.billTotal,
                            paymentMethod: payment,
                            orderId: generate_Order_id(),
                        },
                        ],
                    },
                    { new: true }
                    );
                }
            }
            const delCart = await Cart.findOneAndDelete({ userID: usid });
            for (let order_product of cart.products) {
              for (let product of products) {
                  
              if (order_product.productID.equals(product._id)) {
                  product.quantity = product.quantity - order_product.quantity;
                  await product.save();
              }
              }
            }
            if (cart.coupon != null) {
              user.coupons.push(cart.coupon);
              await user.save();
            }
  
            res.render("user/order", { user });
        } 
        else if (payment == "Razorpay") {
            if (order) {
              console.log('razorpayOrder')
                if (cart.coupon != null) {
                    const updatedOrder = await Orders.findOneAndUpdate(
                    { userID: usid },
                    {
                        $push: {
                        orders: [
                            {
                            products: cart.products,
                            date: currentDate,
                            address: placedAddress,
                            billAmount: cart.billTotal,
                            coupon: cart.coupon._id,
                            couponCode: cart.coupon.couponCode,
                            paymentMethod: "Net Banking",
                            orderId: generate_Order_id(),
                            },
                        ],
                        },
                    },
                    { new: true }
                    );
                } 
                else {
                    const updatedOrder = await Orders.findOneAndUpdate(
                    { userID: usid },
                    {
                        $push: {
                        orders: [
                            {
                            products: cart.products,
                            date: currentDate,
                            address: placedAddress,
                            billAmount: cart.billTotal,
                            paymentMethod: "Net Banking",
                            orderId: generate_Order_id(),
                            },
                        ],
                        },
                    },
                    { new: true }
                    );
                }
            } 
            else {
                if (cart.coupon != null) {
                    const updatedOrder = await Orders.create(
                    {
                        userID: usid,
                        orders: [
                        {
                            products: cart.products,
                            date: currentDate,
                            address: placedAddress,
                            billAmount: cart.billTotal,
                            coupon: cart.coupon._id,
                            couponCode: cart.coupon.couponCode,
                            paymentMethod: "Net Banking",
                            orderId: generate_Order_id(),
                        },
                        ],
                    },
                    { new: true }
                    );
                }
                else {
                    const updatedOrder = await Orders.create(
                    {
                        userID: usid,
                        orders: [
                        {
                            products: cart.products,
                            date: currentDate,
                            address: placedAddress,
                            billAmount: cart.billTotal,
                            paymentMethod: "Net Banking",
                            orderId: generate_Order_id(),
                        },
                        ],
                    },
                    { new: true }
                    );
                }
            }
            const delCart = await Cart.findOneAndDelete({ userID: usid });
            for (let order_product of cart.products) {
              for (let product of products) {
                  
              if (order_product.productID.equals(product._id)) {
                  product.quantity = product.quantity - order_product.quantity;
                  await product.save();
              }
              }
            }
            if (cart.coupon != null) {
              user.coupons.push(cart.coupon);
              await user.save();
            }
            res.render("user/order", { user });
        }
        else{
          const usid = req.session.user;
          const user = await User.findOne({_id:usid})
          const products= await Products.find({})
          const cart = await Cart.findOne({userID:usid}).populate('products.productID')
          const address = await Address.findOne({userID:usid})
          req.session.errorMessage = 'For bill amount above 1000 choose Online payment'
          res.redirect('/checkout')
        }
        console.log(cart)
        } catch (error) {
        console.log(error);
        }
  },
  getOrders: async (req, res) => {
    try {
      // console.log('hi orders')
      const uid = req.session.user;
      const user = await User.findOne({ _id: uid });
      const order = await Orders.findOne({ userID: uid }).sort({"orders.date":-1}).populate(
        "orders.products.productID"
      );
      let orders = [];
      if(order){
          order.orders.forEach(pr=>{
              orders.push(pr);
          })
      }
      const currentPage = req.query.page || 1;
      const pageLimit = 5;
      const start = (currentPage - 1) * pageLimit;
      const end = currentPage * pageLimit;
      const startIndex = orders.length - start;
      const endIndex = orders.length - end<0?0:orders.length - end
      const totalPages = Math.ceil( orders.length/ pageLimit);
      orders = orders.slice(endIndex,startIndex)
      console.log(orders[0].date)
      res.render("user/userOrders", { orders, user, currentPage,  totalPages});
    } catch (error) {
      console.log(error.message);
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      const orderID = req.query.order;
      req.session.orderID = orderID;
      const userID = req.session.user;
      const user = await User.findOne({ _id: userID });
      const orders = await Orders.findOne({ userID: userID }).populate(
        "orders.products.productID"
      );
      let product_Detail;
      let shipmentAddress;
      let paymentMethod;
      orders.orders.forEach((order) => {
        order.products.forEach((product) => {
          if (product._id == orderID) {
            product_Detail = product;
            shipmentAddress = order.address;
            paymentMethod = order.paymentMethod;
          }
        });
      });
      const orderDetails = {product_Detail,shipmentAddress,paymentMethod,}
      res.render("user/orderDetails", {
        orderDetails,
        user,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  getInvoice:async(req,res)=>{
    try {
      const orderID = req.session.orderID;
      const userID = req.session.user;
      const user = await User.findOne({ _id: userID });
      const orders = await Orders.findOne({ userID: userID }).populate(
        "orders.products.productID"
      );
      let product_Detail;
      let shipmentAddress;
      let paymentMethod;
      let date;
      orders.orders.forEach((order) => {
        order.products.forEach((product) => {
          if (product._id == orderID) {
            product_Detail = product;
            shipmentAddress = order.address;
            paymentMethod = order.paymentMethod;
            date = (new Date(order.date)).toLocaleDateString('en-GB');
          }
        });
      });
      console.log(product_Detail)
      console.log(shipmentAddress)
      const cost = product_Detail.productID.offerPrice != 0?product_Detail.productID.offerPrice:product_Detail.productID.price
      console.log(cost);
      const invoiceDetail = {
        shipping: {
          name: shipmentAddress.Name,
          address: shipmentAddress.Address,
          city: shipmentAddress.City,
          state: shipmentAddress.State,
          country: shipmentAddress.Country,
          postal_code: shipmentAddress.Pincode
        },
        items: [
          {
            item: product_Detail.productID.ProductName,
            quantity: product_Detail.quantity,
            price: cost,
            tax:''
          },
        ],
        subtotal: product_Detail.cost,
        total: product_Detail.cost,
        order_number: orderID,
        header: {
          company_name: "Indian Premium Coffee",
          company_logo: "",
          company_address: "Maradu, Kundanoor, 689123, Kochi, India",
        },
        footer: {
          text: "Hi purchase again "
        },
        currency_symbol: "Rs.",
        date: {
          billing_date: date,
        }
      };
  
      niceInvoice(invoiceDetail, 'invoice.pdf');
  
      res.download('invoice.pdf', 'invoice.pdf', (err) => {
        if (err) {
          console.log('Error downloading invoice:', err);
        } else {
          console.log('Invoice downloaded successfully');
          // Delete the PDF file after download
          fs.unlinkSync('invoice.pdf');
        }
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error generating invoice');
    }   
  },
  cancelOrder: async (req, res) => {
    try {
      console.log("cancel order");
      const productID = req.query.id;
      const userID = req.session.user;
      const orders = await Orders.findOne({ userID: userID }).populate(
        "orders.coupon"
      );
      const wallet = await Wallet.findOne({ userID: userID });
      let refundAmount;
      let productReturn;
      let returnQuantity;
      let reducedAmount;
      let paymentGateway;
      let newWallet;
      console.log("productID" + productID);
      orders.orders.forEach((order) => {
        order.products.forEach((product) => {
          console.log("orderproduct" + product);
          if (product._id == productID) {
            productReturn = product.productID;
            returnQuantity = product.quantity;
            paymentGateway = order.paymentMethod;
            if (order.paymentMethod == "Net Banking") {
              if (order.billAmount > product.cost) {
                if (order.coupon) {
                  refundAmount = product.cost - order.coupon.discountPrice;
                  order.billAmount = order.billAmount - refundAmount;
                  order.coupon = null;
                } else {
                  refundAmount = product.cost;
                  order.billAmount = order.billAmount - product.cost;
                }
              } else {
                if (order.coupon) {
                  refundAmount = product.cost - order.coupon.discountPrice;
                  order.coupon = null;
                } else {
                  refundAmount = product.cost;
                }
              }
              if (wallet) {
                wallet.balance = wallet.balance + refundAmount;
                const transaction = {
                  transactionID: uuidv4(),
                  transactionType: "credit",
                  date: new Date(),
                  amount: refundAmount,
                };
                wallet.transactions.push(transaction);
              } else {
                newWallet = {
                  userID: userID,
                  balance: refundAmount,
                  transactions: [
                    {
                      transactionID: uuidv4(),
                      transactionType: "credit",
                      date: new Date(),
                      amount: refundAmount,
                    },
                  ],
                };
              }
              product.status = "Cancelled";
            } else if (order.paymentMethod == "COD") {
              if (order.billAmount > product.cost) {
                if (order.coupon) {
                  reducedAmount = product.cost - order.coupon.discountPrice;
                  order.billAmount = order.billAmount - reducedAmount;
                } else {
                  order.billAmount = order.billAmount - product.cost;
                }
              }
            }
          }
        });
      });
      const product = await Products.findOneAndUpdate(
        { _id: productReturn },
        { $inc: { quantity: returnQuantity } },
        { new: true }
      );
      if (paymentGateway == "Net Banking") {
        if (!wallet) {
          const createWallet = await Wallet.create(newWallet);
        } else {
          await wallet.save();
        }
      }
      await orders.save();
      res.redirect('/orders')
    } catch (error) {
      console.log(error.message);
    }
  },
  returnOrder: async (req, res) => {
    try {
      const productID = req.query.id;
      console.log(productID);
      const userID = req.session.user;
      const order = await Orders.findOne({ userID: userID });
      order.orders.forEach((order) => {
        order.products.forEach((product) => {
          if (product._id == productID) {
            product.returnRequest = true;
            product.status = "Return Pending";
          }
        });
      });
      order.save();
    } catch (error) {
      console.log(error.message);
    }
  },
  createOrder: async (req, res) => {
    try {
      // const {addressId :addressId,paymentGateway:,totalAmount}=req.query.id;
      const { addressId, paymentGateway, totalAmount } = req.body;
      const total_Amount = parseInt(totalAmount);
      const cart = await Cart.findOne({userID:req.session.user})
      console.log(addressId);
      if (paymentGateway == "Razorpay") {
        var options = {
          amount: total_Amount * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11",
        };
        instance.orders.create(options, function (err, order) {
          console.log(order);
          res.json({ paymentMethod: "Razorpay", order: order});
        });
      } else if (paymentGateway == "cod") {
        res.json({
          paymentMethod: "COD",
          message: "Order placed successfully",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  verify_Payment: async (req, res) => {
    try {
      console.log("verify");
      const data = req.body;
      let hmac = Crypto.createHmac("sha256", key_secret);
      hmac.update(
        data.payment.razorpay_order_id + "|" + data.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      if (hmac == data.payment.razorpay_signature) {
        
        res.json({ status: true });
      } else {
        console.log("failed");
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  payment_failed:async(req,res)=>{
    try{
      console.log("payment Failed");
      const data = req.body;
      let hmac = Crypto.createHmac("sha256", key_secret);
      hmac.update(
        data.payment.razorpay_order_id + "|" + data.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      if (hmac == data.payment.razorpay_signature) {
        
        res.json({ status: true });
      } else {
        console.log("failed");
        res.json({ status: false });
      }
    }
    catch(error){
      console.log(error.message)
    }
  },
  pendingPayment:async(req,res)=>{
    try{
      const userId = req.session.user;
      const { aid, payment } = req.query;
      const user = await User.findOne({ _id: userId });
      const cartlist = await Cart.findOne({ userID: userId });
      let cart;
      if (cartlist.coupon != null) {
          cart = await Cart.findOne({ userID: userId }).populate("coupon");
      } else {
          cart = cartlist;
      }
      const products = await Products.find();
      const order = await Orders.findOne({ userID: userId });
      const currentDate = new Date();
      const address = await Address.findOne({ userID: userId });
      let updatedOrder;
      let placedAddress;
      address.addresses.forEach((el) => {
          if (el._id == aid) {
            placedAddress = el;
          }
      });
      const orderID = generate_Order_id()
      console.log(placedAddress);
      if (order) {
        if (cart.coupon != null) {
            updatedOrder = await Orders.findOneAndUpdate(
            { userID: userId },
            {
                $push: {
                orders: [
                    {
                    products: cart.products,
                    date: currentDate,
                    address: placedAddress,
                    billAmount: cart.billTotal,
                    coupon: cart.coupon._id,
                    couponCode: cart.coupon.couponCode,
                    paymentMethod: "Net Banking",
                    orderId: orderID,
                    payment: 'Pending'
                    },
                ],
                },
            },
            { new: true }
            );
        } 
        else {
            updatedOrder = await Orders.findOneAndUpdate(
            { userID: userId },
            {
                $push: {
                orders: [
                    {
                    products: cart.products,
                    date: currentDate,
                    address: placedAddress,
                    billAmount: cart.billTotal,
                    paymentMethod: "Net Banking",
                    orderId: orderID,
                    payment: 'Pending'
                    },
                ],
                },
            },
            { new: true }
            );
        }
      } 
      else {
          if (cart.coupon != null) {
              updatedOrder = await Orders.create(
              {
                  userID: userId,
                  orders: [
                  {
                      products: cart.products,
                      date: currentDate,
                      address: placedAddress,
                      billAmount: cart.billTotal,
                      coupon: cart.coupon._id,
                      couponCode: cart.coupon.couponCode,
                      paymentMethod: "Net Banking",
                      orderId: orderID,
                      payment: 'Pending'
                  },
                  ],
              },
              { new: true }
              );
          }
          else {
              updatedOrder = await Orders.create(
              {
                  userID: userId,
                  orders: [
                  {
                      products: cart.products,
                      date: currentDate,
                      address: placedAddress,
                      billAmount: cart.billTotal,
                      paymentMethod: "Net Banking",
                      orderId: orderID,
                      payment: 'Pending'
                  },
                  ],
              },
              { new: true }
              );
          }
      }
      console.log(orderID)
      updatedOrder.orders.forEach(order=>{
        console.log(order.orderId)
        if(order.orderId == orderID){
          console.log('order failed1')
          order.products.forEach(product=>{
            console.log(product.status);
            product.status = 'Payment Pending';
          })
        }
      })
      await updatedOrder.save();
      if (cart.coupon != null) {
        user.coupons.push(cart.coupon);
        await user.save();
      }
      const delCart = await Cart.findOneAndDelete({ userID: userId });
      res.render('user/paymentFailed')
    }
    catch(error){
      console.log(error.message)
    }
  },
  createOrdertoRetry:async(req,res)=>{
    try{
      const totalAmount = req.body.billAmount;
      const total_Amount = parseInt(totalAmount);
      const cart = await Cart.findOne({userID:req.session.user})
      var options = {
        amount: total_Amount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
      };
      console.log(total_Amount);
      instance.orders.create(options, function (err, order) {
        console.log(order);
        res.json({order: order});
      });
    }
    catch(error){
      console.log(error.message)
    }
  },
  retryPayment:async(req,res)=>{
    try{
      const parsed = req.body;
      console.log(parsed)
      const data = parsed
      const order = await Orders.findOne({userID:req.session.user})
      let hmac = Crypto.createHmac("sha256", key_secret);
      hmac.update(
        data.payment.razorpay_order_id + "|" + data.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      if (hmac == data.payment.razorpay_signature) {
        order.orders.forEach(order=>{
          if(order._id.equals(data.orderID)){
            order.payment = 'Success';
            order.products.forEach(product=>{
              product.status = 'Placed';
            })
          }
        })
        await order.save();
        res.json({ status: true });
      } else {
        console.log("failed");
        res.json({ status: false });
      }
    }
    catch(error){
      console.log(error.message)
    }
  },

  //adminside
  getOrderList: async (req, res) => {
    try {
      const currentPage = req.query.page || 1;
      const pageLimit = 8;
      const startIndex = (currentPage - 1) * pageLimit;
      const endIndex = currentPage * pageLimit;
      let ordersWithLimit = [];
      const orders = await Orders.find()
        .populate("userID")
        .populate("orders.products.productID");
      orders.forEach((items) => {
        items.orders.forEach((item) => {
          ordersWithLimit.push(item)
        });
      });
      let items = [];
      for(let i=startIndex; i<endIndex;i++){
        items.push(ordersWithLimit[i]);
      }
      console.log(items)
      res.render("admin/orderlist", { orders });
    } catch (error) {
      console.log(error.message);
    }
  },
  orderStatus: async (req, res) => {
    try {
      const userid = req.query.id;
      const prid = req.query.prid;
      const status = req.query.status;
      const product_Status = await Orders.findOne({ userID: userid });
      const wallet = await Wallet.findOne({ userID: userid });
      let refundAmount;
      let reducedAmount;
      let newWallet;
      product_Status.orders.forEach((order) => {
        order.products.forEach((product) => {
          if (product._id == prid) {
            if (product.status == "Return Pending") {
              if (order.billAmount > product.cost) {
                if (order.coupon) {
                  refundAmount = product.cost - order.coupon.discountPrice;
                  order.billAmount = order.billAmount - refundAmount;
                  order.coupon = null;
                } else {
                  refundAmount = product.cost;
                  order.billAmount = order.billAmount - product.cost;
                }
              } else {
                if (order.coupon) {
                  refundAmount = product.cost - order.coupon.discountPrice;
                  order.coupon = null;
                } else {
                  refundAmount = product.cost;
                }
              }
              if (wallet) {
                wallet.balance = wallet.balance + refundAmount;
                const transaction = {
                  transactionID: uuidv4(),
                  transactionType: "credit",
                  date: new Date(),
                  amount: refundAmount,
                };
                wallet.transactions.push(transaction);
              } else {
                newWallet = {
                  userID: userid,
                  balance: refundAmount,
                  transactions: [
                    {
                      transactionID: uuidv4(),
                      transactionType: "credit",
                      date: new Date(),
                      amount: refundAmount,
                    },
                  ],
                };
              }
              product.status = "Returned";
            } else {
              product.status = status;
            }
          }
        });
      });
      if (status == "Return Pending") {
        if (!wallet) {
          const createWallet = await Wallet.create(newWallet);
        } else {
          await wallet.save();
        }
      }
      await product_Status.save();
      res.redirect("/admin/orders");
      console.log(status);
    } catch (error) {
      console.log(error.message);
    }
  },
  orderDetails: async (req, res) => {
    try {
      const userID = req.query.id;
      const productID = req.query.prid;
      const orders = await Orders.findOne({ userID: userID }).populate(
        "orders.products.productID"
      );
      let product_Detail;
      let shipmentAddress;
      let paymentMethod;
      orders.orders.forEach((order) => {
        order.products.forEach((product) => {
          if (product._id == productID) {
            product_Detail = product;
            shipmentAddress = order.address;
            paymentMethod = order.paymentMethod;
          }
        });
      });
      console.log(product_Detail);
      res.render("admin/orderDetails", {
        product_Detail,
        shipmentAddress,
        paymentMethod,
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  
};

module.exports = orderController;
