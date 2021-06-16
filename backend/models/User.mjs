import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    require: [true, "firstName is Required"],
  },
  lastName: {
    type: String,
    require: [true, "lastName is Required"],
  },
  email: {
    type: String,
    require: [true, "email is Required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "password is Required"],
  },
  gender: {
    type: String,
    require: [true, "gender is Required"],
  },
  dob: {
    type: Date,
    required: [true, "dob is Required"],
  },
  city: {
    type: String,
    required: [true, "city is Required"],
  },
  zip: {
    type: Number,
    required: [true, "zip is Required"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    required: false,
  },
  lastKnownLocation: {
    longitude: String,
    latitude: String,
    required: false,
  },
  email_verified:{
    type:Boolean,
    required:false,
    default:false,
  }
});

userSchema.virtual('fullName').get(()=>{
    return this.firstName + " "+ this.lastName;
})

userSchema.virtual('cityPostal').get(()=>{
    return this.city + ","+ this.zip;
})


export const User = mongoose.model("User", userSchema,"user");
