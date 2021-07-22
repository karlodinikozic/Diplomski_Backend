import mongoose from "mongoose";
const { Schema } = mongoose;


const ChatThreadSchema = new Schema({
    user_1:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true,
    },
    user_2:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true,
    },
    create_at:{
      type:Date,
      default: Date.now()
    },
    messages:[
        {
            senderID: {
                type: mongoose.ObjectId,
                ref: 'User',
                required: true
            },
            message: {
              type: String,
              required: true
            },
            date: {
              type: Date,
              default: Date.now()
            
            },
            imageUrl:{
              type:String,
              default:null
            }
        }
    ],
    blockChat:{
      type:Boolean,
      defautl:false
    },
    userWhoBlocked:{
      type:mongoose.ObjectId,
      ref:'User',
      default:null,
    }

  })
  
  export const ChatThread = mongoose.model("MessageThread", ChatThreadSchema);