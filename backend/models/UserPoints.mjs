import mongoose from "mongoose";
const { Schema } = mongoose;

const UserPointsSchema = new Schema({
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  lifes: {
    type: Number,
    min: 0,
    max: 5,
    default: 5,
  },
  blockList: [
    //TODO MAYBE PUSH IT INTO USERSHCEMA
    {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  nextHeartAt: {
    type: Date,
    default: null,
  },

  notifications: [
    {
      type: {
        type: String,
        required: true,
      },
      senderId: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
      },
      receiverId: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date:{
          type:Date,
          default:Date.now,
      }
    },
  ],
});

export const UserPoints = mongoose.model("UserPoints", UserPointsSchema);
