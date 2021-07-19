
import {default as axios} from 'axios'
import Joi from 'joi'
import { default as _ } from 'lodash';

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
     

        if(!access || _.isUndefined(access) || _.isNull(access) || access=="null" || access=="undefiend"){
          
            return res.status(401).send({message:"Missing User Token"})
        }
        
     
  
        const response = await axios.get(req.newUrl,{
            headers:{
              authorization: access
            }
        })     
        
    
        req.user_id = response.data

        next()



    } catch (error) {
      
      return res.status(error.response.status).send(error.response.data)
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


export const validateUpdateBody = (obj)=>{

  const updateSchema = Joi.object( {
    firstName:Joi.string(),

    lastName:Joi.string(),    
    gender:Joi.any().valid("Male","Female","Other"),

    dob:Joi.date().raw(),

    city:Joi.string(),

    zip:Joi.number(),
    location:Joi.object({
      longitude:Joi.number().required(),
      latitude:Joi.number().required(),
      
    }),
    description:Joi.string(),
    sexualOrientation:Joi.number().max(2).min(0),
    imageUrl:Joi.string(), //TODO FIX ONLY CLUDIARY DOMAIN
    job:Joi.string(),
    education:Joi.string(),
    gallery:Joi.array().items(Joi.object({ imageUrl:Joi.string().required()})),


  })

const {error}  = updateSchema.validate(obj)

return error;

}

