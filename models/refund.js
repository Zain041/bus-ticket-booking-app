const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const refundSchema = Schema({

    
    fullName: {
        type: String,
    },
    noOfSeats: {
        type: Number,
     
    },
    amount: {
        type: Number,
    },
    phone: {
        type: Number,
       
    },
    cnic:{
        type:Number
    },
    
    
    passwordResetToken: String,
    passwordResetExpires: Date
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Refund", refundSchema)

