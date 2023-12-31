const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  name: { type: String, require: true },
  dp:{type: String , default:"https://operations.chicagopolice.org/FIMSPublic/Content/images/default-contact-image.png"},
  bio:{type:String},
  following:[
    {
      _id:{
        type:String,
        unique:true
      },
      username:{
        type:String,
        unique:true
      },
      dp:{
        type:String,
        default:"https://operations.chicagopolice.org/FIMSPublic/Content/images/default-contact-image.png"
      },

    }
  ],
  posts: [
    {
      image: {
        type: String,
        require: true
      },
      description: {
        type: String,
        require: true
      },
      likes: {
        type: Number
      },
    
    },{timestamps:true}
  ],
  
});


module.exports = mongoose.model('User', userSchema, "User");