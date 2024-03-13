const Orders = require("../models/orders");
const Cart = require("../models/cart");
const Products = require("../models/products");
const User = require("../models/user");
const Address = require("../models/address");
const Wallet = require("../models/wallet");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const Crypto = require("crypto");
const exceljs = require('exceljs');
const fs = require('fs');
const PDFDocument = require('pdfkit');

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
        if (payment == "COD") {
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
        } 
        else if (payment == "Razorpay") {
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
        }
        if (cart.coupon != null) {
            user.coupons.push(cart.coupon);
            await user.save();
        }
        console.log(cart)
        for (let order_product of cart.products) {
            for (let product of products) {
                
            if (order_product.productID.equals(product._id)) {
                product.quantity = product.quantity - order_product.quantity;
                await product.save();
            }
            }
        }
        const delCart = await Cart.findOneAndDelete({ userID: usid });

        res.render("user/order", { user });
        } catch (error) {
        console.log(error);
        }
  },
  getOrders: async (req, res) => {
    try {
      // console.log('hi orders')
      const uid = req.session.user;
      const user = await User.findOne({ _id: uid });
      const orders = await Orders.findOne({ userID: uid }).populate(
        "orders.products.productID"
      );
      // if(orders){
      //     const reqorder = orders.orders.map(pr=>{
      //         console.log(pr)
      //     })
      // }
      res.render("user/userOrders", { orders, user });
    } catch (error) {
      console.log(error.message);
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      const orderID = req.query.order;
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
      console.log(product_Detail);
      res.render("user/orderDetails", {
        product_Detail,
        shipmentAddress,
        paymentMethod,
        user,
      });
    } catch (error) {
      console.log(error.message);
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
      console.log(addressId);
      if (paymentGateway == "Razorpay") {
        var options = {
          amount: total_Amount * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "order_rcptid_11",
        };
        instance.orders.create(options, function (err, order) {
          console.log(order);
          res.json({ paymentMethod: "Razorpay", order: order });
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
        console.log("success");
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  //adminside
  getOrderList: async (req, res) => {
    try {
      const orders = await Orders.find()
        .populate("userID")
        .populate("orders.products.productID");
      orders.forEach((items) => {
        items.orders.forEach((item) => {
          item.products.forEach((el) => {
            console.log(el.productID.ProductName);
          });
        });
      });
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

  salesReportinExcel:async(req,res)=>{
    try{
        const salesData = await Orders.find().populate('userID')
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');
        worksheet.addRow(['Order ID', 'Billing Name', 'Date', 'Payment Method', 'Bill Amount', 'Coupon Used']);
        salesData.forEach(orders=>{
            orders.orders.forEach(order=>{
                worksheet.addRow([order.orderId, orders.userID.username, (new Date(order.date)).toLocaleDateString('en-GB'), order.paymentMethod, order.billAmount,order.couponCode]);
            })
        })
        await workbook.xlsx.writeFile('public/sales_report.xlsx');
        res.download('public/sales_report.xlsx')
        console.log('excel report is generated')
    }
    catch(error){
        console.log(error.message)
    }
  },
  salesReportinPdf:async(req,res)=>{
    try{
        const pdfDoc = new PDFDocument();
        const salesData = await Orders.find().populate('userID')
            pdfDoc.pipe(fs.createWriteStream('public/sales_report.pdf'));
            pdfDoc.pipe(fs.createWriteStream('sales_report.pdf'));
            pdfDoc.fontSize(12);
            pdfDoc.text('Sales Report', { align: 'center' });
            pdfDoc.moveDown();
            salesData.forEach(orders=>{
                orders.orders.forEach(order=>{
                    pdfDoc.text(`Order ID: ${order.orderId}`);
                    pdfDoc.text(`Billing Name: ${orders.userID.username}`);
                    pdfDoc.text(`Date: ${(new Date(order.date)).toLocaleDateString('en-GB')}`);
                    pdfDoc.text(`Payment Method: ${order.paymentMethod}`);
                    pdfDoc.text(`Bill Amount: ${order.billAmount}`);
                    pdfDoc.text(`Coupon Used: ${order.couponCode}`);
                    pdfDoc.moveDown();
                })
            })
            await pdfDoc.end();
            res.download('public/sales_report.pdf')
            
            console.log('PDF report generated and saved as sales_report.pdf');
    }
    catch(error){
        console.log(error.message)
    }
  },
  getcustomReport:async(req,res)=>{
    try{
      let {startDate,endDate} = req.body;
      startDate = new Date(startDate)
      endDate = new Date(endDate)
      let sales_Report = [];
      const orders = await Orders.find().populate('userID')
      for (const order of orders) {
        for (const productPurchased of order.orders) {
            if (productPurchased.date >= startDate && productPurchased.date <= endDate) {
                sales_Report.push(productPurchased);
            }
        }
      }
      res.status(200).json({sales:sales_Report})
      console.log(sales_Report)
    }
    catch(error){
      console.log(error.message)
    }
  },
};

module.exports = orderController;
