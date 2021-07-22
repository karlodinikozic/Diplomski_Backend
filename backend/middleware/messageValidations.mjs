import Joi from 'joi'
import {
    default as _
} from 'lodash';

export const validateSaveMessage = (obj) => {

    const validateSendMessageSchema = Joi.object({
        chat_id:Joi.string().required(),
        message:Joi.string().required(),
        imageUrl:Joi.string()
    })

    const {
        error
    } = validateSendMessageSchema.validate(obj)

    return error;
}


export const validateBlockChat = (obj) => {

    const validateSendMessageSchema = Joi.object({
        chat_id:Joi.string().required(),
        block:Joi.boolean().invalid(false).required()
    })

    const {
        error
    } = validateSendMessageSchema.validate(obj)

    return error;
}

export const validateCreateThread = (obj)=>{
    const validateCreateThreadScheme = Joi.object({
        recipient_id:Joi.string().required(),
        message: Joi.string()
    })

    const {error} = validateCreateThreadScheme.validate(obj)
    return error
}

export const checkChatHeader = (req,res,next)=>{
    const chat_id = req.headers['chat_id'];
    if(!chat_id || _.isUndefined(chat_id) || _.isNull(chat_id) || chat_id=="null" || chat_id=="undefiend"){
        return res.status(401).send({message:"Missing chat ID"})
    }
    req.chat_id = chat_id;
    next()
}