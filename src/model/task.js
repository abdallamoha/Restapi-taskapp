const mongoose=require('mongoose')
const validator=require('validator')

const Task=mongoose.model('Task',{
    description:{
        type:String,
        required:false,
        trim:true
    },
    completed:{
        type:Boolean,
        default:true
    }
})


module.exports=Task
