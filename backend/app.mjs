import {default as express} from 'express'
import { default as cors } from 'cors'
import { PORT } from './config/config.mjs'
import {connectDB} from './config/db.mjs'


import {router as userRouter} from './routes/userRouter.mjs'
import {router as authRouter} from './routes/authRouter.mjs'
import {router as mapRouter} from './routes/mapRouter.mjs'
import {router as chatRouter} from './routes/chatRouter.mjs'


//* CONNECT TO DB
connectDB()
// * - *


//*APP
const app = express()



//*Middleware
app.use(express.json())
app.use(cors())


//* ROUTES
app.use('/api/v1',authRouter) //Authentification
app.use('/api/v1',userRouter) //User CRUD
app.use('/api/v1',mapRouter) //
app.use('/api/v1',chatRouter)






app.listen(PORT,()=>{
    console.log(`Server running on https//localhost:${PORT}`)
})


