
import { validateQueryBody } from "../middleware/userValidations.mjs";
import { User } from "../models/User.mjs";

export const usersOnMap = async (req,res,next)=>{

    try {
        console.log(req.user_id)
        const user = await User.findById({_id:req.user_id})
        
        //VALIDATE BODY
        const err = validateQueryBody(req.query);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }

        
        return res.status(200).send(user)

        

    } catch (error) {
        res.status(400).send(error)
    }

}