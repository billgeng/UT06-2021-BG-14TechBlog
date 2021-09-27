const router = require('express').Router();
const sequelize = require('../config/connection');
const { User,Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
router.get('/', withAuth, (req, res) => {
    Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'user_id'
            ],
            include: [{
                    model: Comment,
                    as:'comment',
                    attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                    include:{
                        model: User,
                        as:'user',
                        attributes: ['username']
                    },
                    
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'title',
                'content','user_id'
            ],
            include: [{
                    model: User,
                    as:'user',
                    attributes: ['username']
                },
                {
                    model: Comment,
                    as:'comment',
                    attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                    include:{
                        model: User,
                        as:'user',
                        attributes: ['username']
                    },
                    
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            const post = dbPostData.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})
router.get('/new', (req, res) => {
    res.render('new-post');
});



module.exports = router;