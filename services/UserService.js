const db = require('../models');
const bcrypt = require('bcrypt');

class UserService {
    constructor() {
        this.client = db.sequelize;
        this.user = db.user
    }
    
    async register(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.user.create({
                username,
                password: hashedPassword,
                userType: 0
            });
            return user;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }
    
    async login(username, password) {
        try {
            const user = await this.user.findOne({
                where: { username }
            });
            if (!user) {
                return new Error('User not found');
            }
            const validPassword = await bcrypt.compare(password, user.password);
            return validPassword ? user : null;
        } catch (error) {
            throw new Error('Error logging in: ' + error.message);
        }
    }
    
    // async getAllUsers() {
    //     try {
    //         const users = await this.user.findAll({
    //             attributes: { exclude: ['password'] },
    //             include: {
    //                 model: this.usertype,
    //                 as: 'userType'
    //             }
    //         });
    //         return users;
    //     } catch (error) {
    //         throw new Error('Error fetching users: ' + error.message);
    //     }
    // }
    //
    // async getUserById(id) {
    //     try {
    //         const user = await this.user.findByPk(id, {
    //             attributes: { exclude: ['password'] },
    //             include: { model: this.usertype, as: 'userType' }
    //         });
    //         return user;
    //     } catch (error) {
    //         throw new Error('Error fetching user: ' + error.message);
    //     }
    // }
    
    async getUserByUsername(username) {
        try {
            const user = await this.user.findOne({
                where: { username }
            });
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);       
        }
    }
}

module.exports = UserService;