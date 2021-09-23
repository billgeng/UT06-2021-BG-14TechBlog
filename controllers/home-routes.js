const sequelize = require('../config/connection');

const { Post,User,Comment } = require('../models');

const router = require('express').Router();

router.get('/',(req,res) =>{
    Post.findAll ({
     attributes: ['id','title','content','created_at'],
     include: [
         {
             model: User,
             as : 'user',
             attributes: ['username'],
         },
         {
             model: Comment,
             as: 'comment',
             attributes: ['id','comment_text','post_id','user_id','created_at'],
             include:{
                 model: User,
                 attributes:['username']
             }
         }
     ]
    }) .then(postData)
})