const express = require("express");
const router = express.Router();
const path = require("path");
 
const cloudinary = require("cloudinary").v2;

const auth =require('../middleware/auth')

const multer = require("multer");
const Rating =require("../models/ratings") 
const Stop =require("../models/stops") 
const User =require("../models/User")
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require("express-validator");










router.post("/addStop", async (req, res) => {
 
const {departureTime,
    description,
    stopName,
    arrivalTime,}= req.body
    
        
        
        
  try{ 
         
          const stop = new Stop({
            departureTime:departureTime,
            description:description,
            stopName:stopName,
            arrivalTime:arrivalTime,
           
          });
         await stop.save();
          res.send({ message: 'Bus Created', stop:stop });
       
        
  
          } catch (err) {
            console.log(err)
            return res.status(500).send("Server Error");
          }
       
    
  });

  router.post("/updateStop", async (req, res) => {
 

    const {departureTime,
        description,
        stopName,
        arrivalTime,id}= req.body
           try {

          let stopFields={}

          if(departureTime)   stopFields.departureTime = departureTime;
          if(description)   stopFields.description = description;
          if(stopName)   stopFields.imageUrl = stopName;
          if(arrivalTime)   stopFields.arrivalTime = arrivalTime;
         

        
        
        
  
         
          const stop = await  Stop.findByIdAndUpdate({_id:id},
            { $set: stopFields },
            { new: true }
            
            );
   
          res.send({ message: 'Bus Updated', Bus:stop });
       
        
  
          } catch (err) {
            console.log(err)
            return res.status(500).send("Server Error");
          }
       
    
  });

  router.post("/deleteStop", async (req, res) => {
 


      const { id } = req.body;
  
    
          try {
               const stop = await  Stop.findByIdAndDelete({_id:id});
   
          res.send({ message: 'Stop deleted'});
       
        
  
          } catch (err) {
            console.log(err)
            return res.status(500).send("Server Error");
          }
        
      
      
    
    
  });

router.get('/stops',async (req,res)=>{
    try{
        const stops = await Stop.find()

        res.status(200).send({stops})
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("server error")
    }
   
})
  
  
  module.exports = router;