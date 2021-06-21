const route = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

//create a post
route.post('/',async(req,res)=>{
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//update post
route.put('/:id', async(req,res)=>{
   try {
    const post = await Post.findById(req.params.id);
    console.log(post.userId)
    console.log(req.body.userId)
    if(post.userId===req.body.userId){
        await post.updateOne({$set:req.boy})
        res.status(200).json("the post has been updated")
    }
    else{
        res.status(403).json("you can update only your post")

    }
   } catch (error) {
       res.status(500).json(error)
       
   }
})

//delete post
route.delete('/:id', async(req,res)=>{
    try {
     const post = await Post.findById(req.params.id);
     console.log(post.userId)
     console.log(req.body.userId)
     if(post.userId===req.body.userId){
         await post.deleteOne()
         res.status(200).json("the post has been deleted")
     }
     else{
         res.status(403).json("you can delete only your post")
 
     }
    } catch (error) {
        res.status(500).json(error)
        
    }
 })
 //like/dislike post
 route.put('/:id/like',async(req,res)=>{
     try {
         const post = await Post.findById(req.params.id);
         if(!post.likes.includes(req.body.userId)){
             await post.updateOne({$push:{likes:req.body.userId}})
             res.status(200).json("The post has been liked")
         }
         else{
             await post.updateOne({$pull:{likes:req.body.userId}})
             res.status(200).json("The post has been disliked")
            }

     } catch (error) {

         res.status(500).json(error)
     }
 })

 //get a post
 route.get('/:id',async(req,res)=>{
     try {
         const post = await Post.findById(req.params.id)
         res.status(200).json(post)
     } catch (error) {
         
         res.status(500).json(error)
     }
 })

 //get timeline post
 route.get('/timeline/all',async(req,res)=>{
     let postArray = [];
     try {
         const currentUser = await User.findById(req.body.userId)
         
         const userPosts = await Post.find({userId:currentUser._id})
         const friendPosts = await Promise.all(
             currentUser.followings.map((friendId)=>{
                 Post.find({userId:friendId})
             })
         )
         res.json(userPosts.concat(...friendPosts))
     } catch (error) {
         console.log(error)
        res.status(500).json(error) 
     }
 })

module.exports= route