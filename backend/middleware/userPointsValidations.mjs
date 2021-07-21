import Joi from "joi";
import { default as _ } from "lodash";

export const validateAddNotification = (obj) => {
  const notificationSchema = Joi.object({
    
      type: Joi.string().required(),
      senderId: Joi.string().required(),
      receiverId: Joi.string().required(),
      text:Joi.string().required()//TODO MAKE IT A VALID ID
    }) 


  const { error } = notificationSchema.validate(obj);

  return error;
};

