import {default as mongoose} from 'mongoose'
import { MONGO_URI } from './config.mjs'
export const connectDB = async ()=>{
    try{
    
        const conn = await mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology:true,
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}