const {Model, Datatypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');
const { before } = require('lodash');

class User extends Model{
    checkPassword (loginPw) {
        return bcrypt.compareSync(loginPw,this.password);
    }
};

User.init (
    {
        id: {
            type: Datatypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true,            
        },
        username:{
            type:Datatypes.STRING,
            allowNull:false,
        },
        email: {
            type:Datatypes.STRING,
            allowNull:false,
            validate:{isEmail:true},
            unique:true,
        },
        password:{
            type:Datatypes.STRING,
            allowNull:false,
            validate:{len:[8]},
        },
    },
    {
        hooks: {
            async
        },

        sequelize,
        timestamps:false,
        freezeTableName:true,
        underscored:true,
        modelName:'user',
    }
);

module.exports = User;
