import { StatusCodes } from "http-status-codes"
import { config } from "../configs/app.config.js"

export const errorHandler =  (err, req, res, next) =>{
   
    // Nếu dev không cẩn thận thiếu status code thì mặc định status code sẽ là INTERNAL_SERVER_ERROR
   if(!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

   // tạo ra 1 biến responseError 
   const responseError = {
    statusCode:err.statusCode,
    success:false,
    message:err.message || StatusCodes[err.statusCode],
    stack:err.stack
   }

   if(config.NODE_ENV === 'production'){
        delete responseError.stack
   }
   

   return res.status(responseError.statusCode).json(responseError)
}