import {default as express} from 'express'
import { PORT } from './config/config.mjs'
import {connectDB} from './config/db.mjs'

import {router as authRouter} from './routes/authRouter.mjs'
//* CONNECT TO DB
connectDB()
// * - *


const app = express()
app.use(express.json())

app.use('/api/v1',authRouter)

app.use('/',(req,res)=>{
    return res.send("HELLO TO BACKEND")
})

app.listen(PORT,()=>{
    console.log(`Server running on https//localhost:${PORT}`)
})