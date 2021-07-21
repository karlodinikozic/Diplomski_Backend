import { validateAddNotification } from "../middleware/userPointsValidations.mjs";
import { UserPoints } from "../models/UserPoints.mjs";
import { default as _ } from "lodash";

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


export const addNotifications = async(req,res,next)=>{
    try {

    const err = validateAddNotification(req.body);
    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }
    const uPoints = (await UserPoints.find({user_id:req.user_id}))[0]

    if(uPoints.user_id != req.body.receiverId){
        return res.status(400).send({ message: `Invalid request reciver mismatch` });
    }

    const new_notif  = [...uPoints.notifications,req.body]

    uPoints.notifications = new_notif;
    await uPoints.save()
    return res.status(200).send( uPoints.notifications)
} catch (error) {
   
    res.status(400).send(error);
}

        
    
      
}

export const notificationSeen = async(req,res,next)=>{
    const notif_id = req.params.id
    try {
    
        if(_.isNull(notif_id) || _.isUndefined(notif_id)){
            console.log("hey")
            return res.status(400).send({ message: `Notification id is missing` });
        }
    
        const uPoints = (await UserPoints.find({user_id:req.user_id}))[0]
        uPoints.notifications.map(n=>{
            if(n._id ==notif_id){
                n.seen=true
            }
        })
  
       await uPoints.save()
        return   res.status(200).send("Success");
    } catch (error) {
        console.log(error)
           res.status(400).send(error);
    }


}