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
    type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
    required: false,
    default:null
  },
  coordinates: {
    type: [Number],
    required: false,
  }
  },
  email_verified:{
    type:Boolean,
    required:false,
    default:false,
  },
  changedPassword:{
    type:Boolean,
    required:false,
    default:false,
  },
  description:{
    type:String,
    required:false
  },
  sexualOrientation:{ //TODO ENHANCE THIS
    type:Number,
    min:0,
    max:2
  },
  imageUrl:{
    type:String,
    required:false,
    default:"https://res.cloudinary.com/dbfwwnhat/image/upload/v1624201830/users/bgtx9sq0vp96ws1s0vwu.png"
 

  },
  completedSetup:{
    type:Boolean ,
    required:false,
    default:false,
  },
  education:{
    type:String,
    required:false,
  },
  job:{
    type:String,
    required:false,
  },
  age:{
    type:Number,
    required:true,
  },
  interests:[
    {
     category:{
       type:String,
       required:true
     },
     interest:{
       type:String,
      required:true,
      unique:true,
     }
    }
  ],
  gallery:[
    {
    imageUrl:{
      type:String,
      required:true,
      unique:true,
    }
  }
  ]

});

userSchema.index({ lastKnownLocation : "2dsphere" } )

userSchema.virtual('fullName').get(()=>{
    return this.firstName + " "+ this.lastName;
})

userSchema.virtual('cityPostal').get(()=>{
    return this.city + ","+ this.zip;
})





export const User = mongoose.model("User", userSchema,"user");



