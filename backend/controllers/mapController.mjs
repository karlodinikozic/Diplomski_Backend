
import { query } from "express";
import { validateQueryBody } from "../middleware/userValidations.mjs";
import { User } from "../models/User.mjs";



export const usersOnMap = async (req,res,next)=>{

    try {
   
        const user = await User.findById({_id:req.user_id})
        
        //VALIDATE BODY
        const err = validateQueryBody(req.query);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }
        const {range} = req.query

      
 
        
        const query = User.find(); //TODO ADD FILLTERS
        
      
        const result = await query.circle('lastKnownLocation',{center:user.lastKnownLocation.coordinates,radius:(range / 6378.1),spherical: true})
        
   




        return res.status(200).send(result)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

}