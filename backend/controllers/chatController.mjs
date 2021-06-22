import { validateCreateThread } from "../middleware/messageValidations.mjs";
import { validateSaveMessage } from "../middleware/messageValidations.mjs";
import { ChatThread } from "../models/MessageThread.mjs"

class MessageObj{
    constructor(sender,message){
        this.send = sender
        this.message = message
        this.date = Date.now()
    }
}

export const saveMessage = async (req,res,next)=>{
    try {
        //validate body
        const err = validateSaveMessage(req.body);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }

        const {chat_id,message} =req.body
        const messageObj = new MessageObj(req.user_id,message)
       const data = await ChatThread.findByIdAndUpdate({_id:chat_id},{$push:{messages:messageObj}},{new:true})
        return res.status(200).send(data)
        
    } catch (error) {
        
    }
}

export const createThread = async (req,res,next)=>{
    try {
        //validate body
        const err = validateCreateThread(req.body);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }

        const {recipient_id,message} =req.body
     

        const messageObj = new MessageObj(req.user_id,message)
        chatThread = await new ChatThread({user_1:req.user_id,user_2:recipient_id,messages:[messageObj]})
        chatThread.save()
        return res.status(200).send({chat_id:chatThread._id})
    } catch (error) {
        
    }
}