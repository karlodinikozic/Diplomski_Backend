import { default as _ } from "lodash";
import { validateCreateThread } from "../middleware/messageValidations.mjs";
import { validateSaveMessage } from "../middleware/messageValidations.mjs";
import { ChatThread } from "../models/MessageThread.mjs"
class MessageObj{
    constructor(sender,message=" "){
        this.senderID = sender
        this.message = message
        this.date = Date.now()
    }
}
const checkIfChatExists = async (req,res) =>{
    try {
    //TODO MAYBE PersonModel.find({ favouriteFoods: { "$in" : ["sushi"]} }, ...); array style
    const exists_1 = await ChatThread.findOne({user_1:req.user_id,user_2:req.body.recipient_id})
    if(!_.isEqual({},exists_1) && !_.isNull(exists_1)  ){
        return exists_1;
    }
    const exists_2 = await ChatThread.findOne({user_1:req.body.recipient_id,user_2:req.user_id})
    if(!_.isEqual({},exists_2&& !_.isNull(exists_2))){
        return exists_2;
    }
    return false;
    } catch (error) {
        console.log(error)
        return new Error(error.message)
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
       const data = await ChatThread.findByIdAndUpdate({_id:req.chat_id},{$push:{messages:messageObj}},{new:true})
        return res.status(200).send(data)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
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
        //CHECK IF Chat exists
        const exists  = await checkIfChatExists(req,res)
        if(exists != false  && exists!= null){
            return res.status(200).send({chat_id:exists._id})
        }
        const messageObj = new MessageObj(req.user_id,message)
        const chatThread = await new ChatThread({user_1:req.user_id,user_2:recipient_id,messages:[messageObj]})
        chatThread.save()
        return res.status(200).send({chat_id:chatThread._id})
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
}
export const getChatThread = async (req,res,next)=>{
    try {
        const chatThread = await ChatThread.findById({_id:req.chat_id}) 
        .slice('messages', 20)
        .select(['activities','user_1','user_2'])
        .lean()
        .exec()
        //TODO GET ONLY LAST 25 MESSAGES
        return res.status(200).send(chatThread)
    } catch (error) {
        return res.status(400).send(error)
    }
}
//TODO DELETE MESSAGE 
//TODO DELETE CHAT