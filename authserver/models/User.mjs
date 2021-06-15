import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({

  email: {
    type: String,
    require: [true, "email is Required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "password is Required"],
  },

});


export const User = mongoose.model("User", userSchema,"user");
