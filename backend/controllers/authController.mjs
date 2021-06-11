
import {  ErrorResponse } from "../errors/clientErrors.mjs"
import { validateLogin } from "../middleware/authValidators.mjs"

export const loginUser = (req,res,next)=>{
    try {
        const errors = validateLogin(req.body)
        if(errors){
         
            throw ErrorResponse.myClientError(errors.details[0])
            
        }


    } catch (err) {
      
         next(err)
    }
}