import { ErrorResponse } from "../errors/clientErrors.mjs";
import { validateLogin } from "../middleware/authValidators.mjs";
import { User } from "../models/User.mjs";
import { default as bcrpyt } from "bcryptjs";
import { default as jwt } from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/config.mjs";

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
      throw ErrorResponse.myClientError(errors.details[0]);
    }

    //* Check if user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user == null) {
      throw ErrorResponse.NotFound(`User with email: ${email} doesn't exits`);
    }

    const checkPassword = await bcrpyt.compare(password, user.password);

    if (!checkPassword) {
      throw ErrorResponse.UnAutherized(
        `Invalid password for User with ${email}`
      );
    }

    const access_token = await CreatAccessToken(user._id);
    const refresh_toke = await jwt.sign({ _id: user._id }, REFRESH_SECRET, {
      expiresIn: "48h",
    });

    const token = {
      access: access_token,
      refresh: refresh_toke,
    };

    return res
      .status(200)
      .send({ lenght: 1, data: token, message: "Successfuly logged in" });
  } catch (err) {
    next(err);
  }
};

export const getAccess = async (req, res, next) => {
  try {
    const valid = jwt.verify(req.token, REFRESH_SECRET, function (err, decode) {
      if (err) {
        throw ErrorResponse.UnAutherized(`Invalid token ${req.token}`);
      }

      return decode;
    });

    const new_access_token = await CreatAccessToken(valid._id);
    return res
      .status(200)
      .send({ lenght: 1, data: new_access_token, message: "Success" });
  } catch (error) {
    next(error);
  }
};

export const checkAccessToken = async(req,res,next)=>{
  let error ;
 
  const valid = jwt.verify(req.token, ACCESS_SECRET, function (err, decode) {
    if (err) {
      error = `Invalid token ${err}`
    }
   
    return decode;
  });
  console.log(req.token)
  if(error){
    return res.status(401).send({message:error})
  }
 
  const decode = await jwt.decode(req.token)
  if(Date.now()>= decode.exp* 1000){
    return res.send(444).send({message:"Token has expired"})
  }

  return res.status(200).send(valid._id)

}