import { ErrorResponse } from "../errors/clientErrors.mjs";
import { validateLogin } from "../middleware/authValidators.mjs";
import {default as axios} from 'axios'

import { default as jwt } from "jsonwebtoken";
import { PORT } from "../config/config.mjs";
import { AUTH_PORT } from "../config/config.mjs";

function findServerUrl(req,str1,str2){
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let newUrl = fullUrl.replace(PORT,AUTH_PORT)
  newUrl = newUrl.replace(str1,str2)
  return newUrl
}

export const loginResponse = async (req,res,next)=>{
  try {
    const newUrl = findServerUrl(req,'login','auth/login')
    const responce = await axios.post(newUrl,req.body,{
      headers:req.headers,
    })
    return res.status(200).send(responce.data)

  } catch (error) {
    next(error)
  }

}

export const accessResponse = async(req,res,next)=>{
  try {

    const newUrl = findServerUrl(req,'getAccess','auth/checkToken')
    const response = await axios.get(newUrl,{
      headers:req.headers
    })
    return res.status(200).send(response.data)
  } catch (error) {
   next(error) 
  }
}