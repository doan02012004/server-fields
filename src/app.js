import express from 'express'
import cors from 'cors'
import router from './routes/v1/index.js'
import ApiError from './utils/ApiError.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js'
import { StatusCodes } from 'http-status-codes'
import { config } from './configs/app.config.js'

const app = express()


app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))
app.use(cors({
  origin: config.DOMAIN_ORIGIN,
  credentials: true,
}))



app.use('/api/v1', router)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(StatusCodes.NOT_FOUND, 'Not found'));
  });
  
  
  // handle error
app.use(errorHandler)

export default app

