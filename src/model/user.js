const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const schema=mongoose.Schema
const jwt=require('jsonwebtoken')

const userSchema=new schema({
    name:{
        type:String,
        trim:true,
       // index:true//evry time query this db by name run fast
        //dropDups: true // Use dropDups to ensure dropping duplicate records in your schemas like;
    },
    password:{
        required: true,
        type:String,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain password')
            }
        }
    },
    age:{
        type: Number,
        default:0

    },
    email:{
        type:String,
        unique: true,
        trim: true,
        lowercase:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('EMAIL IS INVALID')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})
userSchema.statics.findByCredentials=async (email,password)=>{
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
console.log(user)
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.pre('save',async function(next) {
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    console.log('gfgdgdh')
next()
})


const User=mongoose.model('User',userSchema)

module.exports=User