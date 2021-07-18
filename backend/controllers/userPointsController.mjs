import { UserPoints } from "../models/UserPoints.mjs";


export const getUserPoints = async (req,res,next)=>{
    try {

        const uPoints = await UserPoints.find({user_id:req.user_id})

        return res.status(200).send(uPoints[0])
    } catch (error) {
        res.status(400).send(error);
    }
    
}

export const decreaseUserPoints = async (req,res,next)=>{
    try {
        const uPoints = await UserPoints.find({user_id:req.user_id})
        let lifes = uPoints[0].lifes;
        lifes--
        if(lifes<0){lifes = 0}
        uPoints[0].lifes = lifes
        await uPoints[0].save()
        return res.status(200).send(uPoints[0])
    } catch (error) {
        res.status(400).send(error);
    }
}



