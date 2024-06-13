const mongoose = require("mongoose")
const schema=mongoose.Schema(
{
    "bname" :{type:String,required:true},
    "route" :{type:String,required:true},
    "busno" :{type:String,required:true},
    "drivername" :{type:String,required:true},
})

let busmodel=mongoose.model("buses",schema);
module.exports={busmodel}