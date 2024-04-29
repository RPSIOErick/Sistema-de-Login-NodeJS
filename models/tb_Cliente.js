const { sq } = require("./conn");
const { DataTypes } = require("sequelize");

const Cliente = sq.define(
    "Cliente", {
        Nome: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: false,
            unique: true
        },
        Senha: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: false
        }
    }
);

// Cliente.sync().then(() => {
//     console.log("Tabela criada com sucesso!")
// })

module.exports = Cliente;