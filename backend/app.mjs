import {default as express} from 'express'
import { default as cors } from 'cors'
import { PORT } from './config/config.mjs'
import {connectDB} from './config/db.mjs'


import {router as userRouter} from './routes/userRouter.mjs'
import {router as authRouter} from './routes/authRouter.mjs'


//* CONNECT TO DB
connectDB()
// * - *


const app = express()
//*Middleware
app.use(express.json())
app.use(cors())


//* ROUTES
app.use('/api/v1',authRouter) //Authentification
app.use('/api/v1',userRouter) //User CRUD

app.use('/',(req,res)=>{
    return res.send("HELLO TO BACKEND")
})

app.listen(PORT,()=>{
    console.log(`Server running on https//localhost:${PORT}`)
})