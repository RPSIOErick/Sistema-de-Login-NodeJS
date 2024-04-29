const Sequelize = require('sequelize')

const sequelize = new Sequelize('BD_HOTEL', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres'
})

const testConn = async () => {
    try{
        await sequelize.authenticate();
        console.log("Conexão feita com sucesso");
    }
    catch(error){
        console.error("Não foi possível se conectar ao banco de dados: ", error);
    }
}

module.exports = {
    sq: sequelize, testConn
}