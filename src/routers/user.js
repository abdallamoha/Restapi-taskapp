const express=require('express')
const User=require('../model/user')
const auth=require('../middleware/auth')
const router=new express.Router()


router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{
        const token=await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})

    }catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch (e) {
        res.status(404).send()
    }

})

//reading users
router.get('/users/me',auth,async (req,res)=>{
  res.send(req.user)

})
router.get('/users/:id',(req,res)=>{
    const _id=req.params.id
    User.findById(_id).then((result)=>{
        if(!result){
            return  res.status(400).send()
        }
        res.send(result)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

router.patch('/users/:id', async (req,res)=>{
    const update = Object.keys(req.body)
    const allowedupdate=['name.','email','password','age']

    const isValidOperation=update.every((update)=>{
        return allowedupdate.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'invalid operation.'})
    }

    try{
        const user =await  User.findById(req.params.id)
        update.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
       const user=awaiit User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            return  res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)

    }

})


router.delete('/users/:id',async (req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user){
            return  res.status(404).send()
        }
        res.send(user)

    }catch (e) {
        res.status(500).send(e)
    }
})

module.exports=router
