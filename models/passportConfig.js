// Lib de autenticação
const LocalStrategy = require('passport-local').Strategy; // Adicione esta linha

const Cliente = require('./tb_Cliente');
const bcrypt = require('bcrypt');

// Restante do seu código...

function initialize(passport) {
    const authenticateUser = async (Email, Senha, Feito) => {
        try {
            const user = await Cliente.findOne({ where: { 'Email': Email } });
            if (!user) {
                return Feito(null, false, { mensagem: "Usuário não encontrado!" });
            }

            const isMatch = await bcrypt.compare(Senha, user.Senha);
            if (isMatch) {
                return Feito(null, user);
            } else {
                return Feito(null, false, { mensagem: "Senha incorreta!" });
            }
        } catch (error) {
            return Feito(error);
        }
    };

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'Email',
                passwordField: 'Senha'
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, Feito) => Feito(null, user.id));

    passport.deserializeUser(async (id, Feito) => {
        try {
            const user = await Cliente.findByPk(id);
            Feito(null, user);
        } catch (error) {
            Feito(error);
        }
    });
}

module.exports = initialize;
