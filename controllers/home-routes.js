const sequelize = require('../config/connection');

const { User,Post,Comment } = require('../models');

const router = require('express').Router();

router.get('/',(req,res) =>{
    Post.findAll ({
     attributes: ['id','title','content','user_id'],
     include: [
        
         {
             model: Comment,
             as: 'comment',
             attributes: ['id','comment_text','post_id','user_id'],
             include:{
                model: User,
                as:'user',
                attributes: ['username']
            }
            
         },
         {
            model: User,
            as:'user',
            attributes: ['username']
        }
     ]
    }) .then((dbPostData) =>{
        const posts = dbPostData.map(post => post.get({ plain: true }));
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

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/post/:id',(req,res)=>{
    Post.findOne({
        where:{id: req.params.id},
        attributes:[
            'id',
            'content',
            'title',
            'user_id'
        ],
        include:[
            {
                model: Comment,
                as:'comment',
                attributes:['id','comment_text','post_id','user_id'],
                include:{
                    model: User,
                    as:'user',
                    attributes: ['username']
                },
                
            },
            {
                model: User,
                as: 'user',
                attributes:['username']
            }
        ]
    }) .then((dbPostData) =>{
        if (!dbPostData) {
            res.status(404).json({
                message: 'No Post found with id'
            });
            return;
        }
        const post = dbPostData.get({plain: true});
        console.log(post);
        res.render('single-post',{post,loggedIn: req.session.loggedIn});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;