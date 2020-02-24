var Sequelize = require("sequelize");
var sequelize = new Sequelize("postgres://sdbqdjshlcuwva:417783193d6b61837add9cae01b0c3a5862e8103981b7b179d53f57bc425d724@ec2-54-246-92-116.eu-west-1.compute.amazonaws.com:5432/dec8bfja0pk01s", {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});

module.exports = sequelize;