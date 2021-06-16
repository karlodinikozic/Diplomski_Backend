
import {default as axios} from 'axios'
import { findServerUrl } from '../appsupport.mjs';
import Joi from 'joi'

export const checkIDParams = (req, res, next) => {
  const params_id = req.params.id;
  if (params_id) {
    req.params_id = params_id;
    next();
  }
  else{
    return res.status(400).send({message:"Missing User ID"})
  }
  
};

export const checkAccess = async (req, res, next) => {
    
   
    try {
        //* Check if token exists    
        const access = req.headers['authorization']
        if(!access){
            return res.status(401).send({message:"Missing User Token"})
        }
     
        let newUrl = findServerUrl(req,`user/${req.params_id}`,'auth/checkToken')

        const response = await axios.get(newUrl,{
            headers:req.headers
        })

        req.user_id = response.data
      
        next()



    } catch (error) {
        console.log(error)
    }



};
  
export const validateRegisterBody = (obj)=>{

  const registerSchema = Joi.object( {
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$')).required(),
    gender:Joi.any().valid("Male","Female","Other").required(),
    dob:Joi.date().raw().required(),
    city:Joi.string().required(),
    zip:Joi.number().required()
})

const {error}  = registerSchema.validate(obj)

return error;

}