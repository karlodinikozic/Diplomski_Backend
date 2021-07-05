
import { query } from "express";
import { validateFilterBody } from "../middleware/mapValidations.mjs";
import { validateRangeFilter } from "../middleware/userValidations.mjs";
import { User } from "../models/User.mjs";



export const usersOnMap = async (req,res,next)=>{

    try {
        //VALIDATE BODY
        const err = validateRangeFilter(req.query);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }

        const {range} = req.query
        const query = User.find(); //TODO ADD FILLTERS
        
        const user = await User.findById({_id:req.user_id})
        const result = await query.circle('lastKnownLocation',{center:user.lastKnownLocation.coordinates,radius:(range / 6378.1),spherical: true})
        
        return res.status(200).send(result)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

}

export const filterUsersOnMap = async (req,res,next)=>{
        try {

            //VALIDATE BODY
            const err = validateFilterBody(req.body);
            if (err) {
                return res.status(400).send({ message: `Invalid request ${err}` });
            }
        } catch (error) {
            
        }
}