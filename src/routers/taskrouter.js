const express=require('express')
const Task=require('../model/task')
const router=new express.Router()



router.post('/tasks',(req,res)=>{
    const task= new Task(req.body)
    task.save().then(()=>{
        res.send(task)
    }).catch((e)=>{
        res.status(400.).send(e)
    })
})

//reading iterms.
router.get('/tasks',(req,res)=>{
    Task.find().then((result)=>{
        res.send(result)
    })
})
router.get('/tasks/:id',(req,res)=>{
    const _id=req.params.id
    Task.findById(_id).then((result)=>{
        if(!result){
            return  res.status(400).send()
        }
        res.send(result)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

module.exports=router
