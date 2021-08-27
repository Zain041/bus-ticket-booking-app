const express = require("express");
const router = express.Router();
const path = require("path");
const Bus = require("../models/bus");
const User = require("../models/User");
const Booking = require("../models/booking");
const auth = require("../middleware/auth");
const Refund = require("../models/refund")

const Category = require("../models/categories");
const { findByIdAndUpdate } = require("../models/categories");

router.post("/bookSeatByCustomer", auth, async (req, res) => {
  const { busId, seats } = req.body;

  console.log(req.body);

  try {
    let user = await User.findOne({ _id: req.user._id });

    let bus = await Bus.findOne({ _id: busId });
    if(bus.numOfSeatsBooked<40){

   

    let fair = seats.length * bus.fair;

    const booking = new Booking({
      customerName: user.fullName,
      seats: req.body.seats,
      arrivalTime: bus.arrivalTime,
      departureTime: bus.departureTime,
      arrivalName: bus.arrivalName,
      busNo: bus.busNo,
      totalFair: fair,
      phone: user.phone,
      cnic:user.cnic,
      customer_id: req.user._id,
    });
    await booking.save();

    const previousBus = await Bus.findById(
      { _id: busId })
      bus = await Bus.findByIdAndUpdate({_id:previousBus._id},{
        numOfSeatsBooked: previousBus.numOfSeatsBooked - booking.seats.length,
        numOfSeatsLeft: previousBus.numOfSeatsLeft + booking.seats.length,
      },
      
      
        {
          unique: true,
        }
      )

    res.send({ message: "Booking  Created", category: booking });
  }else{
    res.send({msg:"bus is full "})
  }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

router.post("/bookSeatByAdmin", async (req, res) => {
  const { busId, seats, fullName, phone,cnic } = req.body;

  console.log(req.body);

  try {
    let bus = await Bus.findOne({ _id: busId });
    let user = await User.findOne({ phone:phone });
    console.log(user)
    if(bus.numOfSeatsBooked<40){

    

    let fair = seats.length * bus.fair;

    const booking = new Booking({
      customerName: fullName,
      seats: req.body.seats,
      arrivalTime: bus.arrivalTime,
      departureTime: bus.departureTime,
      arrivalName: bus.arrivalName,
      busNo: bus.busNo,
      totalFair: fair,
      customer_id:user?user._id:"6128aa006a586108d4a45f01",
      phone: phone,
      cnic:cnic
    });
    await booking.save();

    let previousBus = await Bus.findById(
      { _id: busId })
      bus = await Bus.findByIdAndUpdate({_id:previousBus._id},{
        numOfSeatsBooked: previousBus.numOfSeatsBooked - booking.seats.length,
        numOfSeatsLeft: previousBus.numOfSeatsLeft + booking.seats.length,
      },
      
      
        {
          unique: true,
        }
      )
    
    res.send({ message: "booking  Created", category: booking });
    }else{
      res.send({msg:"bus is full "})
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

router.get("/getBookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ bookings });
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});

router.post("/deleteBooking", async (req, res) => {
  try {
    const bookings = await Booking.findByIdAndDelete({ _id: req.body.id });
    res.json({ msg: " booking succesfully canceled" });
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});

router.post("/updateCategory", async (req, res) => {
  try {
    const { categoryName, id } = req.body;
    console.log(id);

    const category = await Category.findOneAndUpdate(
      { _id: id },
      {
        categoryName: categoryName,
      }
    );

    res.json({
      msg: "Updated!",
      category,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
router.post("/deleteCategory", async (req, res) => {
  try {
    const { id } = req.body;

    const category = await Category.findOneAndDelete({ _id: id });

    res.json({
      msg: "deleted!",
      category,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// track booking

router.get("/userBookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer_id: req.user._id });

    res.json({
      bookings: bookings,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/cancelBooking", auth, async (req, res) => {
  try {
   
    const booking = await Booking.findById( {_id: req.body.id });
var bus

console.log(booking.busNo)
let deduction=5;
let remaining=booking.totalFair - (booking.totalFair * (5/100))
let refund

    if(booking){

       refund = new Refund({
        fullName:booking.fullName,
        cnic:booking.cnic,
        phone:booking.phone,
        amount:remaining,
        noOfSeats:booking.seats.length

      })

      await refund.save();
      const preBus= await Bus.findOne({busNo:booking.busNo})
      console.log(preBus)
      
        bus = await Bus.findByIdAndUpdate({_id:preBus._id},{
          numOfSeatsBooked: preBus.numOfSeatsBooked - booking.seats.length,
          numOfSeatsLeft: preBus.numOfSeatsLeft + booking.seats.length,
        },
        
        
          {
            unique: true,
          }
        )
      
     
    }

    res.json({
      msg: "Canceled!",refund:refund
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});


router.post("/cancelBookingByAdmin", async (req, res) => {
  try {
   
    const booking = await Booking.findById( {_id: req.body.id });
var bus

console.log(booking.busNo)
let deduction=5;
let remaining=booking.totalFair - (booking.totalFair * (5/100))
let refund

    if(booking){

       refund = new Refund({
        fullName:booking.customerName,
        cnic:booking.cnic,
        phone:booking.phone,
        amount:remaining,
        noOfSeats:booking.seats.length

      })

      await refund.save();
      const preBus= await Bus.findOne({busNo:booking.busNo})
      console.log(preBus)
      
        bus = await Bus.findByIdAndUpdate({_id:preBus._id},{
          numOfSeatsBooked: preBus.numOfSeatsBooked - booking.seats.length,
          numOfSeatsLeft: preBus.numOfSeatsLeft + booking.seats.length,
        },
        
        
          {
            unique: true,
          }
        )
      
     
    }
    await Booking.findByIdAndDelete( {_id: req.body.id });
    res.json({
      msg: "Canceled!",refund:refund
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/stripe/charge", async (req, res) => {
  let { id, userId, name, email, phone, amount, status } = req.body;
  amount = amount * 100;
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Bus Ticket",
      // payment_method_types: ['card'],
      payment_method: id,
      confirm: true,
      receipt_email: email,
      // livemode: true
    });
    console.log(payment);
    const PaymentStudents = await PaymentSchema.find();
    if (payment.status === "succeeded") {
      const newStudent = new PaymentSchema({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        amount: payment.amount,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        Paid: true,
        user: userId,
      });
      await newStudent.save();
    }
    console.log(PaymentStudents);
    paymentSuccess = true;
    res.json({
      message: "Payment Successful",
      success: true,
    });

    // send email section
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
  }
});

module.exports = router;
