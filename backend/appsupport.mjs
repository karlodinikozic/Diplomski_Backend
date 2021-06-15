import { PORT ,AUTH_PORT} from "./config/config.mjs";


export function findServerUrl(req,str1,str2){
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let newUrl = fullUrl.replace(PORT,AUTH_PORT)
    newUrl = newUrl.replace(str1,str2)
    return newUrl
  }