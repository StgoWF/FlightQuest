const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model {
        checkPassword(loginPw) {
            return bcrypt.compareSync(loginPw, this.password);
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 10);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        },
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'user',  // Nombre del modelo en singular y minúscula
        tableName: 'users'  // Nombre de la tabla
    });

    return User;
};
