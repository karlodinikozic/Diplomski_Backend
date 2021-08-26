import { validateAddNotification } from "../middleware/userPointsValidations.mjs";
import { decreaseUserPoints  as decresePoints} from "../appsupport.mjs";
import { UserPoints } from "../models/UserPoints.mjs";
import {User} from '../models/User.mjs'
import { default as _ } from "lodash";
import { LIFE_REFILL_TIME } from "../config/config.mjs";
import { addUserPointAfterTime } from "../appsupport.mjs";

export const getUserPoints = async (req, res, next) => {
  try {
    const uPoints = await UserPoints.find({ user_id: req.user_id });


    //CHECK nextHeartAt time
    let oldTime = new Date(uPoints[0].nextHeartAt)
    if(oldTime< Date.now() && uPoints[0].lifes<5){

      
      //calucel how many hears to add 
      let timeDiff = Date.now() - oldTime
      let numOfHeartsNeed = Math.floor(timeDiff/LIFE_REFILL_TIME)

      if( uPoints[0].lifes + numOfHeartsNeed >= 5){
        
        uPoints[0].nextHeartAt =null
        uPoints[0].lifes = 5;
        await uPoints[0].save()

      }
      else{
      
        uPoints[0].lifes =  uPoints[0].lifes+numOfHeartsNeed;
        await uPoints[0].save()
        addUserPointAfterTime(req.user_id)
      }
      
    }

    return res.status(200).send(uPoints[0]);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const decreaseUserPoints = async (req, res, next) => {
  try {
     //Decrease User Points
  
     const { error, lifes } = await decresePoints(res, req.user_id);
     if (error) {
       return res.status(400).send("Not enough points");
     }
     const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];


     return res.status(200).send(uPoints)

  } catch (error) {
    res.status(400).send(error);
  }
};

export const addNotifications = async (req, res, next) => {
  try {
    const err = validateAddNotification(req.body);
    if (err) {
      return res.status(400).send({ message: `Invalid request ${err}` });
    }
    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];

    if (uPoints.user_id != req.body.receiverId) {
      return res
        .status(400)
        .send({ message: `Invalid request reciver mismatch` });
    }

    if (req.body.type == "0") {
      const new_notif = [...uPoints.chat_notifications, req.body];
      uPoints.chat_notifications = new_notif;
    } else {
      const new_notif = [...uPoints.notifications, req.body];
      uPoints.notifications = new_notif;
    }

    await uPoints.save();
    return res.status(200).send(uPoints.notifications);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const notificationSeen = async (req, res, next) => {
  const notif_id = req.params.id;
  try {
    if (_.isNull(notif_id) || _.isUndefined(notif_id)) {
      return res.status(400).send({ message: `Notification id is missing` });
    }

    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];
    if (uPoints == {} || uPoints == null || uPoints == undefined) {
      return res.status(400).send({ message: `Invalid user id` });
    }

    const notif = _.find(uPoints.notifications, function (n) {
      return n._id == notif_id;
    });
    if (_.isUndefined(notif)) {
      return res.status(400).send({ message: `Invalid notification id` });
    }

    notif.seen = true;

    await uPoints.save();
    return res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const chatNotificationSeen = async (req, res, next) => {
  const notif_id = req.params.id;
  try {
    if (_.isNull(notif_id) || _.isUndefined(notif_id)) {
      return res.status(400).send({ message: `Notification id is missing` });
    }

    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];
    if (uPoints == {} || uPoints == null || uPoints == undefined) {
      return res.status(400).send({ message: `Invalid user id` });
    }

    const notif = _.find(uPoints.chat_notifications, function (n) {
      return n._id == notif_id;
    });
    if (_.isUndefined(notif)) {
      return res.status(400).send({ message: `Invalid notification id` });
    }
    notif.seen = true;
    //TODO KILL OLD NOTIFS

    await uPoints.save();
    return res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  const notif_id = req.params.id;
  try {
    if (_.isNull(notif_id) || _.isUndefined(notif_id)) {
      return res.status(400).send({ message: `Notification id is missing` });
    }

    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];

    if (uPoints == {} || uPoints == null || uPoints == undefined) {
      return res.status(400).send({ message: `Invalid user id` });
    }

    const notif = _.find(uPoints.notifications, function (n) {
      return n._id == notif_id;
    });
    if (_.isUndefined(notif)) {
      return res.status(400).send({ message: `Invalid notification id` });
    }
    uPoints.notifications = uPoints.notifications.filter(
      (n) => n._id != notif_id
    );
    await uPoints.save();
    return res.status(200).send("Success");
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteChatNotification = async (req, res, next) => {
  const notif_id = req.params.id;
  try {
    if (_.isNull(notif_id) || _.isUndefined(notif_id)) {
      return res.status(400).send({ message: `Notification id is missing` });
    }

    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];

    if (uPoints == {} || uPoints == null || uPoints == undefined) {
      return res.status(400).send({ message: `Invalid notification id` });
    }

    const notif = _.find(uPoints.chat_notifications, function (n) {
      return n._id == notif_id;
    });
    if (_.isUndefined(notif)) {
      return res.status(400).send({ message: `Invalid notification id` });
    }
    uPoints.chat_notifications = uPoints.chat_notifications.filter(
      (n) => n._id != notif_id
    );
    await uPoints.save();
    return res.status(200).send("Success");
  } catch (error) {
    res.status(400).send(error);
  }
};

export const likeUser = async (req, res, next) => {

  try {
    const like_user_id = req.params.id;
  
    
    if (_.isNull(like_user_id) || _.isUndefined(like_user_id)) {
      return res.status(400).send({ message: `Notification id is missing` });
    }

    if(like_user_id == req.user_id){
      return res.status(400).send({ message: `Can't like yourself` });
    }
   
    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];
    

    //check if is already liked
    if(uPoints.liked.includes(like_user_id)){
      return res.status(400).send({ message: `User already liked` });
    }

    //check if is in disliked
    if(uPoints.dislike.includes(like_user_id)){
      uPoints.dislike = uPoints.dislike.filter(i=> i!=like_user_id)
    }

    uPoints.liked.push(like_user_id)
    await uPoints.save();

    //push notification
    const userthatLiked = await User.findById(req.user_id)

    const notif={
      type:'1',
      senderId:req.user_id,
      receiverId:like_user_id,
      text: userthatLiked.firstName +" "+ userthatLiked.lastName + " has liked you"
    }
 
    const reciverUPoints = (await UserPoints.find({ user_id: like_user_id }))[0];
  
    const new_notif = [...reciverUPoints.notifications, notif];
    reciverUPoints.notifications = new_notif;


    //Decrease User Points
    const { error, lifes } = await decresePoints(res, req.user_id);
    if (error) {
      return res.status(400).send("Not enough points");
    }



    const new_uPoints = await uPoints.findOne( {user_id: req.user_id})
    await reciverUPoints.save()

    return res.status(200).send(new_uPoints);

  } catch (error) {   

    res.status(400).send(error);
  }
};


export const dislikeUser = async (req, res, next) => {

  try {
    const dislike_user_id = req.params.id;
  
    
    if (_.isNull(dislike_user_id) || _.isUndefined(dislike_user_id)) {
      return res.status(400).send({ message: `Notification id is missing` });
    }

    if(dislike_user_id == req.user_id){
      return res.status(400).send({ message: `Can't like yourself` });
    }
   
    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];
    


    //check if is already liked
    if(uPoints.dislike.includes(dislike_user_id)){
      return res.status(400).send({ message: `User already disliked` });
    }

 
    if(uPoints.liked.includes(dislike_user_id)){
      uPoints.liked = uPoints.liked.filter(i=> i!=dislike_user_id)
    }

 
    uPoints.dislike.push(dislike_user_id)
    await  uPoints.save()


  
    

    //Decrease User Points
    const { error, lifes } = await decresePoints(res, req.user_id);
    if (error) {
      return res.status(400).send("Not enough points");
    }
    const new_uPoints = await uPoints.findOne( {user_id: req.user_id})

    return res.status(200).send(new_uPoints);

  } catch (error) {   
    console.log(error)
    res.status(400).send(error);
  }
};

export const matchedUsers = async(req,res,next)=>{
  const like_user_id = req.params.id;
  
    
  if (_.isNull(like_user_id) || _.isUndefined(like_user_id)) {
    return res.status(400).send({ message: `Notification id is missing` });
  }

  if(like_user_id == req.user_id){
    return res.status(400).send({ message: `Can't like yourself` });
  }
 
  try {
    const uPoints = (await UserPoints.find({ user_id: req.user_id }))[0];
    
    const matchUser = await UserPoints.findOne({user_id:like_user_id})

    const responce = uPoints.liked.includes(like_user_id) && matchUser.liked.includes(req.user_id)

    return res.status(200).send(responce);

  } catch (error) {
    res.status(400).send(error);
  }
 


}


//TODO maybe unlike user 