import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    email: {
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type:String,
        required:true,
        trim: true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female']
    },
    dateOfBirth: {
        type:Date,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{
    timestamps:true,
    versionKey:false
})

const UserModel = mongoose.model('users',userSchema)

export default UserModel