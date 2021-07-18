import { PORT ,AUTH_PORT,EMAIL_NAME,EMAIL_PASS,GEOCODER_PROVIDER,GEOCDOER_API_KEY} from "./config/config.mjs";
import { default as nodemailer } from "nodemailer";
import {UserPoints} from './models/UserPoints.mjs'

import {default as NodeGeocoder} from 'node-geocoder'


const options = {
    provider:GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: GEOCDOER_API_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options)


export function findServerUrl(req,str1,str2){
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let newUrl = fullUrl.replace(PORT,AUTH_PORT)
    newUrl = newUrl.slice(0,newUrl.search(str1)) + str2
    return newUrl
  }

export async function sendEmail  (recipient,message){
  
    const transporter = nodemailer.createTransport({
           host: 'smtp.elasticemail.com',
           port:  2525,
           auth: {
             user:EMAIL_NAME,
             pass:EMAIL_PASS,
           },
         })

     return await transporter.sendMail({
       from: EMAIL_NAME,
       to:  recipient,
       subject: 'Confirm Email',
       html: message,
     });
}

//TODO ADD ADDRESS IF NEEDED
export async function getLocation(city,zip){
  try {
    const loc =  await geocoder.geocode({
     
      country: 'Croatia',
      zipcode: zip,
      city:city
    });

    const location = {
      latitude:loc[0].latitude,
      longitude:loc[0].longitude
    }  
    return location
    
  } catch (error) {
    console.log(error)
    return error
  }




}

export async function decreaseUserPoints(user_id){
  const uPoints = await UserPoints.find({user_id:user_id})
  let lifes = uPoints[0].lifes;
  lifes--
  if(lifes<0){lifes = 0
    throw new Error("Not enough points")
  }
  uPoints[0].lifes = lifes
  await uPoints[0].save()
}