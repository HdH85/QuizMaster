const db = require('../models');
const bcrypt = require('bcrypt');

class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.user;
        this.UserType = db.userType;
    }
    
    async register(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.User.create({
                username,
                password: hashedPassword
            });
            return user;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }
    
    async login(username, password) {
        try {
            const user = await this.User.findOne({
                where: { username }
            });
            if (!user) {
                throw new Error('User not found');
            }
            const validPassword = await bcrypt.compare(password, user.password);
            return validPassword ? user : null;
        } catch (error) {
            throw new Error('Error logging in: ' + error.message);
        }
    }
    
    async getAllUsers() {
        try {
            const users = await this.User.findAll({
                attributes: { exclude: ['password'] },
                include: { model: this.UserType, as: 'userType' }
            });
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }
    
    async getUserById(id) {
        try {
            const user = await this.User.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: { model: this.UserType, as: 'userType' }
            });
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    }
}