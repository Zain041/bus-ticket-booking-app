const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const busSchema = Schema({

    
    arrivalName: {
        type: String,
    },
    description: {
        type: String,
    },
    departureName: {
        type: String,
       
    },
    fair:{
        type:Number
    },
    busNo:{
        type:String
    },
    discount:{
        type: String,
    },
    arrivalTime:{
        type:String
    },
    departureTime:{
        type:String
    },
    imageUrl:{
        type:String
    },
    busType:{
        type:String
    },
    
    numOfSeats: {
        type: Number,
    },
    numOfSeatsLeft: {
        type: Number,
    },
    numOfSeatsBooked: {
        type: Number,
    },
    
    
   
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Bus", busSchema
)

