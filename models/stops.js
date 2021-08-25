const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const stpSchema = Schema({

    
    stopName: {
        type: String,
    },
    description: {
        type: String,
    },
    
   
    arrivalTime:{
        type:String
    },
    departureTime:{
        type:String
    },
   
    
    
   
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Stop", stpSchema
)

