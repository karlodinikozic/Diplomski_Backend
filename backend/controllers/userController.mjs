import { User } from "../models/User.mjs";
import { default as jwt } from "jsonwebtoken";
import {default as bcrypt} from 'bcryptjs'
import { sendEmail } from "../appsupport.mjs";
import { EMAIL_SECRET } from "../config/config.mjs";
import { validateRegisterBody } from "../middleware/userValidations.mjs";
import { validateUpdateBody } from "../middleware/userValidations.mjs";

export const createUser = async (req, res, next) => {
  
  try {
    //VALIDATE BODY
    const err = validateRegisterBody(req.body);
    if (err) {
   
        return res.status(400).send({message:`Invalid request ${err}`})
    }
    let user_data = req.body

    //Check if email exists
    if(await User.find({email:user_data.email})){
      return res.status(400).send({message:`Email ${email} is already in use`})
    }

   
    user_data.password  = await bcrypt.hash(user_data.password,12)

    

    const user = new User(user_data);
    console.log(user._id)
    console.log(EMAIL_SECRET)
    //SEND EMAIL
    const emailToken = await jwt.sign({_id:user._id}, EMAIL_SECRET);
    const emailUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/confirmation/${emailToken}`;
    const email_message = `Molim vas kliknite ovdje kako bi ste potvrdili vaš email ${emailUrl}`;
    const send_email=  await sendEmail(user.email,email_message);
    console.log(send_email)

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
    console.log("he21y")
     //VALIDATE BODY
     const err = validateUpdateBody(req.body);
     if (err) {
         return res.status(400).send({message:`Invalid request ${err}`})
     }
     const id = req.params_id;
     let update_data = req.body
     const query = { _id: id };
    
     const new_user_data = await User.findOneAndUpdate(query,update_data)
    console.log(new_user_data)

    return res.status(200).send({message:"Succees" })

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
