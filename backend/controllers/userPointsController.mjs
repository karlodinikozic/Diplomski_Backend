import { UserPoints } from "../models/UserPoints.mjs";


export const getUserPoints = async (req,res,next)=>{
    try {

        const uPoints = await UserPoints.find({user_id:req.user_id})

        return res.status(200).send(uPoints)
    } catch (error) {
        res.status(400).send(error);
    }
    
}

export const decreaseUserPoints = async (req,res,next)=>{
    try {
        const uPoints = UserPoints.find({user_id:req.user_id})
        let lifes = uPoints.lifes;
        lifes--
        if(lifes<0){lifes = 0}
        uPoints.lifes = lifes
        await uPoints.save()
        return res.status(200).send(uPoints)
    } catch (error) {
        res.status(400).send(error);
    }
}



