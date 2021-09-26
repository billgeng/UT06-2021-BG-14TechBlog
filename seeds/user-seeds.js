const { User } = require('../models');

const userData = [{
        username: 'JohnWell',
        password: 'jkohnbilly'

    },
    {
        username: 'Jack',
        password: 'jacewill'
    },
    {
        username: 'JoePapa',
        password: 'joebababa'
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;