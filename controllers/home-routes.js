const sequelize = require('../config/connection');

const { User,Post,Comment } = require('../models');

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
                 as:'user',
                 attributes:['username']
             }
         }
     ]
    }) .then((postData) =>{
        const posts = postData.map(post => post.get({ plain: true }));
        res.render('homepage',{posts,loggedIn: req.session.loggedIn});
    })
    .catch((err) =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login',(req, res)=>{
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('signup',(req,res)=>{
    res.render('signup');
});

router.get('/post/:id',(req,res)=>{
    Post.findOne({
        where:{id: req.params.id},
        attributes:[
            'id',
            'content',
            'title',
            'created_at'
        ],
        include:[
            {
                model: Comment,
                as:'comment',
                attributes:['id','comment_text','post_id','user_id','created_at'],
                include:{
                    model: User,
                    as: 'user',
                    attributes:['username']
                }
            },
            {
                model: User,
                as: 'user',
                attributes:['username']
            }
        ]
    }) .then((postData) =>{
        if (!postData) {
            res.status(404).json({
                message: 'No Post found with id'
            });
            return;
        }
        const post = postData.get({plain: true});
        console.log(post);
        res.render('single-post',{post,loggedIn: req.session.loggedIn});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/post-comments',(req,res)=>{
    Post.findOne({
        where:{id: req.params.id},
        attributes:[
            'id',
            'content',
            'title',
            'created_at'
        ],
        include:[
            {
                model: Comment,
                as: 'comment',
                attributes:['id','comment_text','post_id','user_id','created_at'],
                include:{
                    model: User,
                    as:'user',
                    attributes:['username']
                }
            },
            {
                model: User,
                as:'user',
                attributes:['username']
            }
        ]
    }) .then((postData) =>{
        if (!postData) {
            res.status(404).json({
                message: 'No Post found with id'
            });
            return;
        }
        const post = postData.get({plain: true});
        console.log(post);
        res.render('post-comments',{post,loggedIn: req.session.loggedIn});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;