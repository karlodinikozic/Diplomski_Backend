import { default as _ } from "lodash";
import { validateBlockChat } from "../middleware/messageValidations.mjs";
import { validateCreateThread } from "../middleware/messageValidations.mjs";
import { validateSaveMessage } from "../middleware/messageValidations.mjs";
import { ChatThread } from "../models/MessageThread.mjs"
import{User } from "../models/User.mjs";

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
       const data = await ChatThread.findByIdAndUpdate({_id:chat_id},{$push:{messages:messageObj}},{new:true})
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

        if(recipient_id === req.user_id){
            return res.status(400).send({ message: `Invalid request you can not create chat with your self` });
        }

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


export const getUserChats = async (req,res,next)=>{
    try {
        const chat_arr_1 = await ChatThread.find({user_1:req.user_id}).slice('messages',-1)

        const chat_arr_2 = await ChatThread.find({user_2:req.user_id}).slice('messages',-1)
        
        const results = [...new Set([...chat_arr_1,...chat_arr_2])] //get only unique
       
        const new_results = await Promise.all(results.map(async(el)=>{
            let search_id = req.user_id === el.user_1? el.user_2 : el.user_1;
            
            const user = await User.findById(search_id);
            let result = {
                firstName:user.firstName,
                lastName:user.lastName,
                imageUrl:user.imageUrl,
                _id:el._id,
                create_at:el.create_at,
                user_1:el.user_1,
                user_2:el.user_2,
                messages:el.messages
            }
           
            
          
       
            return  result

        }))

        return res.status(200).send(new_results)
    
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const blockChat = async (req,res,next)=>{
    try {
        const err = validateBlockChat(req.body);
        if (err) {
            return res.status(400).send({ message: `Invalid request ${err}` });
        }
        if(req.body.block==false){
            return res.status(400).send({ message: `Invalid request Block must be true` });
        }
        await ChatThread.findByIdAndUpdate({_id:req.chat_id},{blockChat:true}) 
        return res.status(200).send('Chat succesfuly blocked')
    } catch (error) {
        return res.status(400).send(error)
    }

}

//TODO DELETE MESSAGE 
//TODO DELETE CHAT