const express = require("express");
const router = express.Router();
const path = require("path");
 
const cloudinary = require("cloudinary").v2;

const auth =require('../middleware/auth')

const multer = require("multer");
const Rating =require("../models/ratings") 
const Bus =require("../models/bus") 
const User =require("../models/User")
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require("express-validator");

const storageEngine = multer.diskStorage({
  destination: './public/uploads/categories/',
  filename: function (req, file, fn) {
    fn(null, req.body.categoryName + path.extname(file.originalname)); //+'-'+file.fieldname
  }
});

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 200000 },
  fileFilter: function (req, file, callback) {

    validateFile(file, callback);
  }
}).single('avatar');
var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}
cloudinary.config({
  cloud_name: "parking-app041",
  api_key: "522187368244197",
  api_secret: "_kgRpudcOL1CAy5McIDv-KVLNlk",
});








router.post("/addBus", async (req, res) => {
 

    upload(req, res, async (error) => {
      const { departureTime,busNo,fair,discount,arrivalTime,description,numOfSeats,numOfSeatsLeft,numOfSeatsBooked,arrivalName,departureName,busType } = req.body;
  
      if (error) {
        let msg = null;
        if (error.message) msg = error.message;
        else msg = error;
        return res.status(400).json({ errors: [{ msg: msg }] });
      } else {
        if (req.file == undefined) {
          return res
            .status(404)
            .json({ errors: [{ msg: "Image does not exist" }] });
        } else {
          try {
            // if user exist
            var image = null;
            
          await cloudinary.uploader.upload( 
            req.file.path,
            {
              resource_type: "image",
              public_id: "blogImages/"  + uuidv4(),
              chunk_size: 6000000,
            },
            function (error, result) {
              image = result;
            },
           
          );
          const avatar=image.url;
        
        
        
  console.log(req.body)
         
          const bus = new Bus({
            departureTime:departureTime,
            description:description,
            imageUrl:avatar,
            arrivalTime:arrivalTime,
            numOfSeats:numOfSeats,
            numOfSeatsLeft:numOfSeatsLeft,
            numOfSeatsBooked:numOfSeatsBooked,
            arrivalName:arrivalName,
            departureName:departureName,
            busType:busType,
            fair:fair,
            busNo:busNo,
            discount:discount
          });
         await bus.save();
          res.send({ message: 'Bus Created', Bus:bus });
       
        
  
          } catch (err) {
            console.log(err)
            return res.status(500).send("Server Error");
          }
        }
      }
      
    })
    
  });

  router.post("/updateBus", async (req, res) => {
 

    upload(req, res, async (error) => {
      const { departureTime,busNo,fair,discount,arrivalTime,numOfSeats,description,numOfSeatsLeft,numOfSeatsBooked,arrivalName,departureName,busType,id } = req.body;
      var image = null;
      var avatar=null
      if (error) {
        let msg = null;
        if (error.message) msg = error.message;
        else msg = error;
        return res.status(400).json({ errors: [{ msg: msg }] });
      } else {
        if(req.file){

       
            if (req.file == undefined) {
              return res
                .status(404)
                .json({ errors: [{ msg: "Image does not exist" }] });
            } else {
             
                // if user exist
               
                
              await cloudinary.uploader.upload( 
                req.file.path,
                {
                  resource_type: "image",
                  public_id: "blogImages/"  + uuidv4(),
                  chunk_size: 6000000,
                },
                function (error, result) {
                  image = result;
                },
               
              );
               avatar=image.url;
    
            }
        }
               try {
          let busFields={}

          if(departureTime)   busFields.departureTime = departureTime;
          if(description)   busFields.description = description;
          if(avatar)   busFields.imageUrl = avatar;
          if(arrivalTime)   busFields.arrivalTime = arrivalTime;
          if(numOfSeats)   busFields.numOfSeats = numOfSeats;
          if(busNo)   busFields.busNo = busNo;
          if(numOfSeatsLeft)   busFields.numOfSeatsLeft = numOfSeatsLeft;
          if(numOfSeatsBooked)   busFields.numOfSeatsBooked = numOfSeatsBooked;
          if(arrivalName)   busFields.arrivalName = arrivalName;
          if(departureName)   busFields.departureName = departureName;
          if(busType)   busFields.busType = busType;
          if(fair)   busFields.fair = fair;
          if(discount)   busFields.discount = discount;

        
        
        
  
         
          const bus = await  Bus.findByIdAndUpdate({_id:id},
            { $set: busFields },
            { new: true }
            
            );
   
          res.send({ message: 'Bus Updated', Bus:bus });
       
        
  
          } catch (err) {
            console.log(err)
            return res.status(500).send("Server Error");
          }
        }
      
      
    })
    
  });

  router.post("/deleteBus", async (req, res) => {
 

   
      const { id } = req.body;
  
    
          try {
               const bus = await  Bus.findByIdAndDelete({_id:id});
   
          res.send({ message: 'Bus deleted'});
       
        
  
          } catch (err) {
            console.log(err)
            return res.status(500).send("Server Error");
          }
        
      
      
    
    
  });

  
router.get(
    '/buses',
    async (req, res) => {
      const pageSize = 3;
      const page = Number(req.query.pageNumber) || 1;
      const arrivalName = req.query.arrivalName || '';
      const departureName = req.query.departureName || '';
      const min =
        req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
      const max =
        req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
     
  
      const arrivalNameFilter = arrivalName ? { arrivalName: { $regex: arrivalName, $options: 'i' } } : {};
  
      const departureNameFilter = departureName ? { departureName } : {};
    
     
     
      const count = await Bus.count({
      
        ...arrivalNameFilter,
        ...departureNameFilter,
      
      
        
      });
      const bus = await Bus.find({
      
        ...arrivalNameFilter,
        ...departureNameFilter,
      })
       
       
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      res.send({ bus, page, pages: Math.ceil(count / pageSize) });
    }
  );
  
  
  module.exports = router;