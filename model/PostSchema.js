const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    image: {
        type: String,
        // required: true
    },
    description: {
        type: String,
    },
    user: {
        username: {
            type: String,
            required:true
        },
        dp: {
            type: String
        }
    },
    comments: [
        {
            commentor: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
                createdAt:true
            },
            dp:{
                type:String
            },
            timestamp:{
                type:Date,
                default:Date.now,
            }
            
        }
    ],
    likes: {
        type: Number
    },
    timestamp:{
        type:Date,
        default:Date.now,
    }


}, { timestamps: true });


module.exports = mongoose.model("Post", PostSchema)