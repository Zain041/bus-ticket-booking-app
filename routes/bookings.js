const express = require("express");
const router = express.Router();
const path = require("path");
const Bus =require("../models/bus") 
const User =require("../models/User")
const Booking =require("../models/booking")
const auth =require('../middleware/auth')

const Category=require("../models/categories");
const { findByIdAndUpdate } = require("../models/categories");










router.post("/bookSeatByCustomer",auth, async (req, res) => {

    
 

  
    const {  busId,seats, } = req.body;

   console.log(req.body)
     
      
    
        try {
            let user= await User.findOne({_id:req.user._id})

            let bus= await Bus.findOne({_id:busId})

            let fair= seats.length*bus.fair
         
          
        const booking = new Booking({
          customerName:user.fullName,
          seats:req.body.seats,
          arrivalTime:bus.arrivalTime,
          departureTime:bus.departureTime,
          arrivalName:bus.arrivalName,
          busNo:bus.busNo,
          totalFair:fair,
          phone:user.phone,
         
        });
         await booking.save();



         let updatedBus= await Bus.findByIdAndUpdate({_id:busId},
            {
                numOfseatsBooked:bus.numOfseatsBooked + seats.length,
                numOfseatsLeft:bus.numOfseatsLeft - seats.length
            },{ 
            unique:true
            })
        res.send({ message: 'Category Created', category: booking });
     
      

        } catch (err) {
          console.log(err)
          return res.status(500).send("Server Error");
        }
      
    
    
  
  
});

router.post("/bookSeatByAdmin", async (req, res) => {

    
 

  
  const {  busId,seats,fullName,phone } = req.body;

 console.log(req.body)
   
    
  
      try {
     

          let bus= await Bus.findOne({_id:busId})

          let fair= seats.length*bus.fair
       
        
      const booking = new Booking({
        customerName:fullName,
        seats:req.body.seats,
        arrivalTime:bus.arrivalTime,
        departureTime:bus.departureTime,
        arrivalName:bus.arrivalName,
        busNo:bus.busNo,
        totalFair:fair,
        phone:phone,
       
      });
       await booking.save();



       let updatedBus= await Bus.findByIdAndUpdate({_id:busId},
          {
              numOfseatsBooked:bus.numOfseatsBooked + seats.length,
              numOfseatsLeft:bus.numOfseatsLeft - seats.length
          },{ 
          unique:true
          })
      res.send({ message: 'Category Created', category: booking });
   
    

      } catch (err) {
        console.log(err)
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

    const bookings = await Booking.findByIdAndDelete({_id:req.body.id});
    res.json({ msg:" booking succesfully canceled"});
    
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});









router.post("/updateCategory", async (req, res) => {
  try {
    const { categoryName ,id} = req.body;
    console.log(id)

    const category = await Category.findOneAndUpdate(
      { _id:id },
      {
        categoryName:categoryName
      }
    );
    

    res.json({
      msg: "Updated!",
     category
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
router.post("/deleteCategory", async (req, res) => {
    try {
      const {id} = req.body;
  
      const category = await Category.findOneAndDelete(
        { _id:id }
        
      );
      
  
      res.json({
        msg: "deleted!",
       category
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  });

module.exports = router;
