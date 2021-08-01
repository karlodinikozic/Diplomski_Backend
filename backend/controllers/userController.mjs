import { User } from "../models/User.mjs";
import { default as jwt } from "jsonwebtoken";
import { default as bcrypt } from "bcryptjs";
import { default as _ } from "lodash";
import { sendEmail } from "../appsupport.mjs";
import { EMAIL_SECRET } from "../config/config.mjs";
import {
  validateRegisterBody,
  validateUpdateBody,
} from "../middleware/userValidations.mjs";
import { FRONT_LOCATION } from "../config/config.mjs";
import { getLocation } from "../appsupport.mjs";
import { UserPoints } from "../models/UserPoints.mjs";
import { calculateAge } from "../appsupport.mjs";
import { validateUserLocation } from "../middleware/userValidations.mjs";
import { offsetLocation } from "../appsupport.mjs";

import { default as generatePassword } from "secure-random-password";
import { validateForgotPassword } from "../middleware/userValidations.mjs";
import { validateChangePassword } from "../middleware/userValidations.mjs";

export const createUser = async (req, res, next) => {
  try {
    //VALIDATE BODY
    const err = validateRegisterBody(req.body);
    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }
    let user_data = req.body;

    //Check if email exists
    const check_user = await User.find({ email: user_data.email });
    if (!_.isEmpty(check_user)) {
      return res
        .status(400)
        .send({ message: `Email ${user_data.email} is already in use` });
    }

    user_data.password = await bcrypt.hash(user_data.password, 12);

    user_data.age = calculateAge(user_data.dob);
    user_data.gender = user_data.gender.toLowerCase();

    const user = new User(user_data);

    user.lastKnownLocation = {
      type: "Point",
      coordinates:[0,0]
    };

    //SEND EMAIL
    const emailToken = await jwt.sign({ _id: user._id }, EMAIL_SECRET);

    const emailUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`+'verifyEmail/'+emailToken;
    console.log(emailUrl)
    const email_message = `<p>Molim vas kliknite ovdje kako bi ste potvrdili vaš email</p><a href="${emailUrl}">Potvrdi email</a> `;
    await sendEmail(user.email, email_message);

     await user.save();

    return res.status(200).send({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const readUser = async (req, res, next) => {
  try {
    const id = req.params_id;
    const user = await User.findById(id); //TODO select read fields
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (req.params_id == req.user_id) {
      if (user.changedPassword) {
        user.changedPassword = false;
        await user.save();
      }
    }

    const data = user.toObject();
    data["age"] = calculateAge(user.dob);

    //TODO ADD AGE
    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    //VALIDATE BODY
    const err = validateUpdateBody(req.body);
    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }

    const id = req.params_id;
    let update_data = req.body;

    update_data.completedSetup = true;

    if (update_data.location) {
      //VALIDATE BODY

      const { longitude, latitude } = update_data.location;
      update_data.lastKnownLocation = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      delete update_data.location;
    }

    if (update_data.dob) {
      update_data.age = calculateAge(update_data.dob);
    }

    // if(update_data.gallery){
    //   const user = await User.findById({_id:id})
    //   const set =  update_data.gallery.filter(el=>! _.find(user.gallery,el))

    //   update_data.gallery=[...set,...user.gallery]
    // }

    // if(update_data.interests){
    //   const user = await User.findById({_id:id})
    //   const set =  update_data.interests.filter(el=>! _.find(user.interests,el))

    //   update_data.interests=[...set,...user.interests]
    // }

    const user = await User.findOneAndUpdate({ _id: id }, update_data, {
      new: true,
    });

    return res.status(200).send({
      message: "Succees",
      length: 1,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user_id !== req.pramas_id) {
      return res.status(401).send("Unable to Delete mismaching ID's");
    }
    const user = await User.findById(id); //TODO DELETE

    return res.status(200).send(user);
  } catch (error) {}
};

export const verifyUserEmail = async (req, res, next) => {
  const token = req.params.token;
  console.log("s")
  if (!token || _.isEmpty(token)) {
    return res.status(400).send({ message: "Missing Url Token" });
  }

  try {
 

    const { _id } = await jwt.verify(token, EMAIL_SECRET);

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.email_verified = true;
    await user.save();

    //CREATING USER POINTS

    const uPoints = await new UserPoints({ user_id: _id });
    await uPoints.save();

    return res.redirect(FRONT_LOCATION);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const setActive = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params_id });

    if (user.lastKnownLocation.coordinates[0] == 0 && user.lastKnownLocation.coordinates[1] ==0) {
      const { longitude, latitude } = await getLocation(user.city, user.zip);

      user.lastKnownLocation = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    user.lastActive = Date.now();
    await user.save();
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const setUserLocation = async (req, res, next) => {
  try {
    //VALIDATE BODY
    const err = validateUserLocation(req.body);

    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }

    //offset location from 200m to 500m
    const { lat, long } = offsetLocation(req.body.latitude, req.body.longitude);

    const user = await User.findById(req.user_id);

    user.lastKnownLocation.coordinates = [lat, long];
    await user.save();

    return res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const err = validateForgotPassword(req.body);
  if (err) {
    return res.status(400).send({ message: `Invalid request ${err}` });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .send({ message: `Invalid request Email doesn't not exists` });
    }

    if (!user.email_verified) {
      return res
        .status(400)
        .send({ message: `Please verify your email first` });
    }

    if (!user.changedPassword) {
      return res
        .status(400)
        .send({ message: `Email was already send with the new password` });
    }

    const newPass = generatePassword.randomPassword({
      characters: [
        generatePassword.lower,
        generatePassword.upper,
        generatePassword.digits,
      ],
    });

    user.password = await bcrypt.hash(newPass, 12);

    user.changedPassword = true;

    const email_message = `<p>Vaša lozinka je uspješno resetirana Nova lozinka je : ${newPass}</p> `;
    await sendEmail(user.email, email_message);

    await user.save();

    return res.status(200).send("Success");
  } catch (error) {
    res.status(400).send(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const err = validateChangePassword(req.body);

    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user_id);

    //* Check Password
    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
      return res.status(401).send({ message: `Invalid password ` });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
