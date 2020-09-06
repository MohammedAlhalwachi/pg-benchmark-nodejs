import sequelize from "../db";
const { DataTypes, Model } = require('sequelize');

class Student extends Model {}

Student.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize,
    modelName: 'student'
});


export default Student;
