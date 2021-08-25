const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const bookigSchema = Schema({

    
    customerName: {
        type: String,
    },
    seats: [
        { type: String }
          
        
      ],
    phone: {
        type: Number,
    },
    totalFair: {
        type: Number,
    },
    departureTime: {
        type: String,
       
    },
    busNo: {
        type: String,
      
    },
    arrivalTime: {
        type: String,
      
    },
    departureName: {
        type: String,
      
    },
    arrivalName: {
        type: String,
        
    },
    
    
  
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Booking", bookigSchema)

