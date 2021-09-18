import { PORT ,AUTH_PORT,EMAIL_NAME,EMAIL_PASS,GEOCODER_PROVIDER,GEOCDOER_API_KEY} from "./config/config.mjs";
import { default as nodemailer } from "nodemailer";
import {UserPoints} from './models/UserPoints.mjs'

import {default as NodeGeocoder} from 'node-geocoder'
import { LIFE_REFILL_TIME } from "./config/config.mjs";


const options = {
    provider:GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: GEOCDOER_API_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options)


export let timeOut = null

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

export async function decreaseUserPoints(res,user_id){

  const uPoints = await UserPoints.find({user_id:user_id})
  let lifes = uPoints[0].lifes;
  lifes--
  if(lifes<0){
    lifes = 0
    return {error:true}
  }


  uPoints[0].lifes = lifes
 
  try {

   
    if(timeOut==null){
      uPoints[0].nextHeartAt =  Date.now()+LIFE_REFILL_TIME
     timeOut= setTimeout(async()=>{await addUserPointAfterTime(user_id)},LIFE_REFILL_TIME)
 
    }
  
  } catch (error) {
    console.log(error.message)
  }
    await uPoints[0].save()
    return{lifes:lifes}

 
}

export async function addUserPointAfterTime(user_id){
  
  timeOut=null;
  const uPoints = await UserPoints.find({user_id:user_id})
  let lifes = uPoints[0].lifes;
  lifes++
  console.log(lifes-1+"=>"+lifes)
  uPoints[0].lifes = lifes
  uPoints[0].nextHeartAt =  Date.now()+LIFE_REFILL_TIME
  

   if(lifes<5){
   timeOut= setTimeout(async()=>{await addUserPointAfterTime(user_id)},LIFE_REFILL_TIME)
   }else{
    uPoints[0].nextHeartAt =null
   }
   await uPoints[0].save()
}

export function calculateAge(dob){
  const diff = Date.now() - Date.parse(dob); 
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function offsetLocation(lat,long){
  //radnom number from 100 - 200
  const meters = Math.floor(Math.random() * 100) + 100;
  const p_or_m_lat =Math.floor(Math.random() * 2)==0 ? 1 : -1 //+ | -
  const p_or_m_long =Math.floor(Math.random() * 2)==0 ? 1 : -1 // + | -

  // TEST MODULO
  const meters_modulo_lat = Math.floor(lat*10000)%200
  const p_or_m_lat_modulo =  meters_modulo_lat > 100 ? 1 : -1 //+ | -

  const meters_modulo_long = Math.floor(long*10000)%200
  const p_or_m_long_modulo =  meters_modulo_long > 100 ? 1 : -1 //+ | -



// number of km per degree = ~111km (111.32 in google maps, but range varies
// between 110.567km at the equator and 111.699km at the poles)
// 1km in degree = 1 / 111.32km = 0.0089
// 1m in degree = 0.0089 / 1000 = 0.0000089
 const coef= meters_modulo_lat * 0.0000089;



 const new_lat = lat + (coef*p_or_m_lat_modulo);
 // pi / 180 = 0.018
 const new_long = long + (coef*p_or_m_long) / Math.cos(lat * 0.018);
 return {lat:new_lat,long:new_long}
}