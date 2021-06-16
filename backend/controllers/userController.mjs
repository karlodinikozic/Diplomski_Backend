import { User } from "../models/User.mjs";
import { default as jwt } from "jsonwebtoken";
import {default as bcrypt} from 'bcryptjs'
import { default as _ } from "lodash";
import { sendEmail } from "../appsupport.mjs";
import { EMAIL_SECRET } from "../config/config.mjs";
import { validateRegisterBody } from "../middleware/userValidations.mjs";
import { validateUpdateBody } from "../middleware/userValidations.mjs";
import { FRONT_LOCATION } from "../config/config.mjs";

export const createUser = async (req, res, next) => {
  
  try {
    //VALIDATE BODY
    const err = validateRegisterBody(req.body);
    if (err) {
   
        return res.status(400).send({message:`Invalid request ${err}`})
    }
    let user_data = req.body

    //Check if email exists
    const check_user = await User.find({email:user_data.email})
    if( ! _.isEmpty(check_user)){
      return res.status(400).send({message:`Email ${user_data.email} is already in use`})
    }

   
    user_data.password  = await bcrypt.hash(user_data.password,12)

    

    const user = new User(user_data);
    console.log(user._id)
    console.log(EMAIL_SECRET)
    //SEND EMAIL
    const emailToken = await jwt.sign({_id:user._id}, EMAIL_SECRET);


    const emailUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}verifyEmail/${emailToken}`;
    const email_message = `<p>Molim vas kliknite ovdje kako bi ste potvrdili vaš email</p><a href="${emailUrl}">Potvrdi email</a> `;
    await sendEmail(user.email,email_message);


    await user.save()
    return res.status(200).send({message:'Success'})
  } catch (error) {
    console.log(error)
  }

};

export const readUser = async (req, res, next) => {
  try {
   
    const id = req.params_id;
    const user = await User.findById(id);//TODO select read fields
    console.log(user)
    if(!user){
      return res.status(404).send("User not found")
    }
    return res.status(200).send(user);
  } catch (error) {

    return res.status(400).send(error)
  }
};

export const updateUser = async (req, res, next) => {
  try {

     //VALIDATE BODY
     const err = validateRegisterBody(req.body);
     if (err) {
         return res.status(400).send({message:`Invalid request ${err}`})
     }
     const id = req.params_id;
     let update_data = req.body
     const query = { _id: id };
    
     const new_user_data = await User.findOneAndUpdate(query,update_data)
    console.log(new_user_data)

    return res.status(200).send({
      message:"Succees",
      length:1,
      data:new_user_data //TODO CHECK IF IT RETURNS NEW USER DATA 
    })

  } catch (error) {
    return res.status(400).send(error)
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user_id !== req.pramas_id) {
      return res.status(401).send("Unable to Delete mismaching ID's");
    }
    const user = await User.findById(id); //TODO DELETE
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {}
};

export const verifyUserEmail = async(req,res,next)=>{
  const token = req.params.token
  if(!token || _.isEmpty(token)){
    return res.status(400).send({message:"Missing Url Token"})
  }

  try {
    const {_id} = await jwt.verify(token,EMAIL_SECRET)
    
    const user = await User.findById(_id)

    if(!user){
      return res.status(404).send("User not found")
    }

    user.email_verified = true;
    await user.save()

    return res.redirect(FRONT_LOCATION)

  } catch (error) {
    res.status(400).send(error.message)
  }
 
}
