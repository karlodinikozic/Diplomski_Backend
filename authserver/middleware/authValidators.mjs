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
        console.log("chekForToken")
        const bearerHeader = req.headers["authorization"];
      
        if (bearerHeader) {
         
          req.token = bearerHeader;
        
          next();
        } else {
          
          return res.status(400).send({message:"Missing token"})
        }
    } catch (error) {
  
      return res.status(401).send(error)
    }
  
}

