import { PORT ,AUTH_PORT,EMAIL_NAME,EMAIL_PASS} from "./config/config.mjs";
import { default as nodemailer } from "nodemailer";


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