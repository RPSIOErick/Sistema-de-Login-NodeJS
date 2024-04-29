const express = require('express');
const handlebars = require('express-handlebars').engine;
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');


const initializePassport = require('./models/passportConfig');


initializePassport(passport);


const app = express();

app.use(session({
    secret: 'secret',

    resave: false,

    saveUninitialized: false
})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const Cliente = require('./models/tb_Cliente');


// Aula de Autênticação
const DB = require('./models/conn');
//


app.get('/', (req, res) => {
    res.send("Cadastre-se ou faça login!")
})

app.get('/usuario/registrar', (req, res) => {
    res.render('cadastro')
})

app.get('/usuario/entrar', (req, res) => {
    res.render('login')
})

app.post('/cadastrar', async (req, res) => {

    let erros = [];

    if (!req.body.Nome || !req.body.Email || !req.body.Senha1 || !req.body.Senha2) {
        erros.push({mensagem: "Preencha todos os campos!"})
    }

    if (req.body.Senha1.length < 6) {
        erros.push("A senha deve ter no mínimo 6 caracteres!")
    }

    if (req.body.Senha1 !== req.body.Senha2) {
        erros.push("As senhas não conferem!")
    }

    if (erros.length > 0) {
    
        res.render('cadastro', {erros})

    } else {

        // Formulário Validado!

        let Senha1 = req.body.Senha1;

        let hashSenha = await bcrypt.hash(Senha1, 10);

        let ConfirmCliente = await Cliente.findOne({
            where: {
                'Email': req.body.Email
            }
        })

        if(ConfirmCliente){
            erros.push({mensagem: "E-mail já cadastrado! Entre pelo link no rodapé."})
            res.render('cadastro', {erros})
        }
        else {
            Cliente.create({
                Nome: req.body.Nome,
                Email: req.body.Email,
                Senha: hashSenha
            })
            .then(() => {
                req.flash('success_msg', "Cadastro realizado com sucesso!")
                res.redirect('/usuario/entrar')
            
            })
            .catch((error) => {
                console.log(error)
            })
        }

    }

});

app.post('/usuario/login', passport.authenticate('local', {
    successRedirect: '/usuario/minha_conta',
    failureRedirect: '/usuario/entrar',
    failureFlash: true
}));

app.get('/usuario/minha_conta', checkNotAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        const { Nome, Email } = req.user;
        res.render('minhaconta', { Cliente: { Nome, Email } });
    } else {
        res.redirect('/usuario/entrar');
    }
});

app.get('/usuario/sair', (req, res) => {
    
    req.logout(function(err) {
        if(err) {
            // Trate o erro, se houver
            console.log(err);
        }
        // Adicione a mensagem de sucesso como flash
        req.flash('success_msg', "Deslogado com sucesso!")

        // Redirecione o usuário para a página de login
        res.redirect('/usuario/entrar');

    });

});

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/usuario/entrar')
}

app.listen(8081, () => {
    console.log("Servidor rodando na url http://localhost:8081")
});