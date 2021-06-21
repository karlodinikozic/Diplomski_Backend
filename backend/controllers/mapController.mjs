
import { query } from "express";
import { validateQueryBody } from "../middleware/userValidations.mjs";
import { User } from "../models/User.mjs";

const milesToRadian = function(miles){
    const earthRadiusInMiles = 3959;
    return miles / earthRadiusInMiles;
};

export const usersOnMap = async (req,res,next)=>{

    try {
   
        const user = await User.findById({_id:req.user_id})
        
        //VALIDATE BODY
        const err = validateQueryBody(req.query);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }
        
       
        const query = User.find();
        query.setOptions({ lean : true });
        query.collection(User.collection);

        // const area = { center:user.lastKnownLocation.coordinates, radius:0 };
        // const result = await query.circle("lastKnownLocation",area)

        const result = User.find({lastKnownLocation:{$nearSphear:user.lastKnownLocation.coordinates}})
        console.log(user.lastKnownLocation.coordinates)




        return res.status(200).send(result)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

}