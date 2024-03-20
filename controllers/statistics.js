const Orders = require('../models/orders')
const Products = require('../models/products')
const Category = require('../models/category')
const exceljs = require('exceljs');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const statisticsController = {
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

    topSelling:async(req,res)=>{
        try{
            const orders = await Orders.find()
            const products = await Products.find().populate('category')
            let productCounts = {};
            for(let product of products){
                let count = 0;
                for(let order of orders){
                    for(let items of order.orders){
                        for(let el of items.products){
                            if(product._id.equals(el.productID)){
                                count++
                            }
                        }
                    }
                }
                productCounts[product._id] = count;
            }
            let productCount = Object.entries(productCounts)
            productCount.sort((a,b)=>b[1] - a[1])
            // console.log(productCount)
            // productCount = Object.fromEntries(productCount)
            let topSellingProducts = []
            for(let i=0; i<10; i++){
                for(let product of products){
                    if(product._id.equals(productCount[i][0])){
                        topSellingProducts[i] = product;
                    }
                }
            }
            console.log(topSellingProducts)
            res.render('admin/topProducts',{topSellingProducts})
        }
        catch(error){
            console.log(error.message);
        }
    },

    topSellingCategory:async(req,res)=>{
        try{
            const orders = await Orders.find().populate('orders.products.productID')
            const categories = await Category.find()
            let categoryCounts = {};
            for(let category of categories){
                let count = 0;
                for(let order of orders){
                    for(let items of order.orders){
                        for(let el of items.products){
                            if(category._id.equals(el.productID.category._id)){
                                count++
                            }
                        }
                    }
                }
                categoryCounts[category._id] = count;
            }
            let categoryCount = Object.entries(categoryCounts)
            categoryCount.sort((a,b)=>b[1] - a[1])
            console.log(categoryCount)
            // productCount = Object.fromEntries(productCount)
            let topSellingCategory = []
            const catagorLength = 10<categories.length?10:categories.length; 
            for(let i=0; i<catagorLength; i++){
                for(let category of categories){
                    if(category._id.equals(categoryCount[i][0])){
                        topSellingCategory[i] = category.name;
                    }
                }
                
            }
            // console.log(topSellingCategory)
            res.render('admin/topCategory',{topSellingCategory})
        }
        catch(error){
            console.log(error.message);
        }
    },

    chartInYearly:async(req,res)=>{
        
    },
    //admin dashboard
    home:async(req,res)=>{
        try{
            // yearly Sales
            const orders = await Orders.find()
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const start = new Date(`${currentYear}-01-01`);
            const end = new Date(`${currentYear + 1}-01-01`)
            let yearlyOrder = [];
            for (const order of orders) {
                for (const productPurchased of order.orders) {
                    if (productPurchased.date >= start && productPurchased.date <= end) {
                        yearlyOrder.push(productPurchased);
                    }
                }
            }
            // console.log(yearlyOrder)
            const yearlySalesData = {};
            yearlyOrder.forEach(order => {
                const year = order.date.getFullYear();
                if (!yearlySalesData[year]) {
                    yearlySalesData[year] = 0;
                }
                yearlySalesData[year]=yearlySalesData[year]+parseInt(order.billAmount);
            });
            // console.log(yearlySalesData);

            //monthly sales

            const startYear = currentMonth === 12 ? currentYear : currentYear - 1;
            const startMonth = currentMonth === 12 ? 1 : currentMonth + 1;
            const endYear = currentYear;
            const endMonth = currentMonth;
            const salesStartMonth = new Date(`${startYear}-${startMonth}-01`);
            const salesEndMonth = new Date(`${endYear}-${endMonth + 1}-01`);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            let monthlyOrder = [];
            for (const order of orders) {
                for (const productPurchased of order.orders) {
                    if (productPurchased.date >= salesStartMonth && productPurchased.date <= salesEndMonth) {
                        monthlyOrder.push(productPurchased);
                    }
                }
            }

            // Initialize monthlySalesData with all months set to 0
            const monthlySalesData = {};
            for (let i = startMonth; i <= 12; i++) {
                const monthName = `${monthNames[i - 1]} ${startYear}`;
                monthlySalesData[monthName] = 0;
            }
            for (let i = 1; i <= endMonth; i++) {
                const monthName = `${monthNames[i - 1]} ${endYear}`;
                monthlySalesData[monthName] = 0;
            }

            monthlyOrder.forEach(order => {
                const orderDate = order.date;
                const orderMonth = orderDate.getMonth(); // Month index is zero-based
                const orderYear = orderDate.getFullYear();
                const monthName = `${monthNames[orderMonth]} ${orderYear}`;

                // Add the bill amount to the corresponding month key
                monthlySalesData[monthName] += parseInt(order.billAmount);
            });
            // console.log(monthlySalesData)

            //weekly chart

            const currentDay = currentDate.getDay();
            const firstDayOfWeek = new Date(currentDate);
            firstDayOfWeek.setDate(currentDate.getDate() - currentDay); // Get the first day of the week
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Get the last day of the week
            console.log(`firstDayOfWeek:${firstDayOfWeek}`);
            console.log(`lastDayOfWeek:${lastDayOfWeek}`);
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let ordersForCurrentWeek = [];
            for (const order of orders) {
                for (const productPurchased of order.orders) {
                    if (productPurchased.date >= firstDayOfWeek && productPurchased.date <= lastDayOfWeek) {
                        ordersForCurrentWeek.push(productPurchased);
                    }
                }
            }
            const weeklySalesData = {}; // Initialize array to store sales for each day of the week
            for(const days of weekDays){
                weeklySalesData[days] = 0;
            }
            ordersForCurrentWeek.forEach(order => {
                const orderDay = order.date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
                const dayName = weekDays[orderDay];
                const billAmount = parseInt(order.billAmount);
                weeklySalesData[dayName] += billAmount;
            });
            console.log(weeklySalesData)


            //sales report
            const all_Orders = await Orders.find().populate('userID');
            let order_count =0;
            all_Orders.forEach(orders=>{
                order_count += orders.orders.length;
            })
            const selectedView = req.query.view || 'yearly'
            res.render('admin/home',{yearlySalesData: yearlySalesData,
                monthlySalesData: monthlySalesData,
                weeklySalesData: weeklySalesData,
                allOrders: all_Orders,
                orderCount: order_count,
                selectedView:selectedView})
        }
        catch(error){
            console.log(error.message)
        }
    },
}

module.exports = statisticsController;