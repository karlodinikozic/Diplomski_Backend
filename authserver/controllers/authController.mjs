
import { validateLogin } from "../middleware/authValidators.mjs";
import { User } from "../models/User.mjs";
import { default as bcrpyt } from "bcryptjs";
import { default as jwt } from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/config.mjs";
import { default as _ } from "lodash";

const connected_users = [];

const CreatAccessToken = async (id) => {
  try {
    const obj = { _id: id }
    const access_token = await jwt.sign(obj, ACCESS_SECRET, {
      expiresIn: "15m",
    }); 
    return access_token;
  } catch (error) {
    new Error(error);
  }
};

//* Return the Access and refesh token if valid
//* Else error response
export const loginUser = async (req, res, next) => {
  try {
    //* Valideting the request
    const errors = validateLogin(req.body);
    if (errors) {
      return res.status(400).send(errors.details[0]);

    }

    //* Check if user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user == null) {
      return res.status(400).send({message:`User with email: ${email} doesn't exits`})

    }

    //* Check Password
    const checkPassword = await bcrpyt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).send({message:`Invalid password for User with ${email}`})
    }

    //Check if email is verified
    if(! user.email_verified){
      return res.status(401).send({message:`Email ${email} is not verified`})
    }


    const access_token = await CreatAccessToken(user._id);
    const refresh_toke = await jwt.sign({ _id: user._id }, REFRESH_SECRET, {
      expiresIn: "48h",
    });

    const token = {
      access: access_token,
      refresh: refresh_toke,
    };

    if(!connected_users.includes(user._id)){connected_users.push(user._id)}

    return res
      .status(200)
      .send({ lenght: 1, data: token, message: "Successfuly logged in" });
  } catch (err) {
    return res.status(400).send(err)
  }
};

export const getAccess = async (req, res, next) => {
  try {
    
    const valid = await jwt.verify(req.token, REFRESH_SECRET, function (err, decode) {
      if (err) {
        return false
      }

      return decode;
    });
    if(valid == false){
      return res.status(401).send({message:`Invalid token ${req.token}`});
    }

    let isLoggedIn = false
    connected_users.forEach(id=>{
      if(id== valid._id){
        isLoggedIn=true;
      }
    })

  
    if(! isLoggedIn ){
      return res.status(401).send({message:`Please log in`});
    }

    const new_access_token = await CreatAccessToken(valid._id);
    return res
      .status(200)
      .send({ lenght: 1, data: new_access_token, message: "Success" });
  } catch (error) {
    return res.status(400).send(error)
  }
};

export const checkAccessToken = async(req,res,next)=>{
  let error ;
 try {
   
 
  const valid = await jwt.verify(req.token, ACCESS_SECRET, function (err, decode) {
    if (err) {
      error = `Invalid token ${err}`
    }
   
    return decode;
  });

  if(error){
 
    return res.status(401).send({message:error})
  }
 
  const decode = await jwt.decode(req.token)
  if(Date.now()>= decode.exp* 1000){
    return res.send(444).send({message:"Token has expired"})
  }

  let isLoggedIn = false
  connected_users.forEach(id=>{
    if(id== valid._id){
      isLoggedIn=true;
    }
  })


  if(! isLoggedIn ){
    return res.status(401).send({message:`Please log in`});
  }

  return res.status(200).send(valid._id)
 } catch (err) {
    return res.send(401).send(err) 
  }
}