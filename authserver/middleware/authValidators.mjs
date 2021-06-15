import Joi, {default as joi} from 'joi'
import { ErrorResponse } from "../errors/clientErrors.mjs";
export const validateLogin = (obj)=>{
    const loginSchema = Joi.object( {
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$')).required()
    })
    const {error}  = loginSchema.validate(obj)
    return error;
}

export const checkForToken = (req,res,next) =>{
    try {
        const bearerHeader = req.headers["authorization"];
       
        if (bearerHeader) {
         
  
          req.token = bearerHeader;
       
          next();
        } else {
          
          throw ErrorResponse.Forbidden("Missing Token")
        }
    } catch (error) {
  
     next (error)   
    }
  
}

