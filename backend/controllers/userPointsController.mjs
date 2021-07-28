import { validateAddNotification } from "../middleware/userPointsValidations.mjs";
import { decreaseUserPoints  as decresePoints} from "../appsupport.mjs";
import { UserPoints } from "../models/UserPoints.mjs";
import {User} from '../models/User.mjs'
import { default as _ } from "lodash";

export const getUserPoints = async (req, res, next) => {
  try {
    const uPoints = await UserPoints.find({ user_id: req.user_id });

    return res.status(200).send(uPoints[0]);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const decreaseUserPoints = async (req, res, next) => {
  try {
    const uPoints = await UserPoints.find({ user_id: req.user_id });
    let lifes = uPoints[0].lifes;
    lifes--;
    if (lifes < 0) {
      lifes = 0;
    }
    uPoints[0].lifes = lifes;
    await uPoints[0].save();
    return res.status(200).send(uPoints[0]);
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

    uPoints.liked.push(like_user_id)
   

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
    console.log(error);
    if (error) {
      return res.status(400).send("Not enough points");
    }
    await uPoints.save()
    await reciverUPoints.save()

    return res.status(200).send(uPoints);

  } catch (error) {    console.log(error)
    res.status(400).send(error);
  }
};

//TODO maybe unlike user 