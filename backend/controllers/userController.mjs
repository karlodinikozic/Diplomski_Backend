import {User} from '../models/User.mjs'
export const readUser = async(req,res,next)=>{

    try {
        const id = req.user_id
        const user = await User.findById(id)
        console.log(user)
        return res.status(200).send(user)
    } catch (error) {
        
    }
}

export const deleteUser = async(req,res,next)=>{

    try {
        if(req.user_id !== req.pramas_id){
            return res.status(401).send("Unable to Delete mismaching ID's")
        }
        const user = await User.findById(id) //TODO DELETE
        console.log(user)
        return res.status(200).send(user)
    } catch (error) {
        
    }
}