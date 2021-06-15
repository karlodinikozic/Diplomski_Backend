
import {default as axios} from 'axios'
import { findServerUrl } from '../appsupport.mjs';

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
  
