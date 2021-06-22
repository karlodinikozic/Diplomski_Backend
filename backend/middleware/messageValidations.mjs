import Joi from 'joi'
import {
    default as _
} from 'lodash';

export const validateSaveMessage = (obj) => {

    const validateSendMessageSchema = Joi.object({
        chat_id:Joi.string().required(),
        message:Joi.string().required()
    })

    const {
        error
    } = validateSendMessageSchema.validate(obj)

    return error;
};

export const validateCreateThread = (obj)=>{
    const validateCreateThreadSchem = Joi.object({
        recipient_id:Joi.string().required(),
        message: Joi.string()
    })

    const {error } = validateCreateThread.validate(obj)
    return error
}