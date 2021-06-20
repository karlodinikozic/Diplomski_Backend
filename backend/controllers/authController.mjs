
import {default as axios} from 'axios'
import { findServerUrl } from '../appsupport.mjs';





export const loginResponse = async (req,res,next)=>{
  try {
    const newUrl = findServerUrl(req,'login','auth/login')
    const responce = await axios.post(newUrl,req.body,{
      headers:req.headers,
    })
   
    return res.status(200).send(responce.data)

  } catch (error) {
    return res.status(error.response.status).send(error.response.data)
  }

}

export const accessResponse = async(req,res,next)=>{
  try {

    const newUrl = findServerUrl(req,'getAccess','auth/getAccess')
    const response = await axios.get(newUrl,{
      headers:{
        'authorization':req.headers['authorization']
      }
    })
    return res.status(200).send(response.data)
  } catch (error) {
    return res.status(error.response.status).send(error.response.data)
  
  }
}