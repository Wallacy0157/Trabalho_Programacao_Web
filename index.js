const express = require('express');
const mustacheExpress = require('mustache-express');
const Usuario = require('./db');
const mongoose = require('mongoose');
const app = express();

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));

const FilmeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
});
const Filme = mongoose.model('Filme', FilmeSchema);

app.get('/', (req, res) => {
    res.render('home.html');
});

app.get('/registrar', (req, res) => {
    res.render('dados.html');
});

app.get('/login', (req, res) => {
    res.render('login.html');
});

app.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();
        res.redirect('/adicionar-filme'); 
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        if (error.code === 11000) {
            res.send('Este e-mail já está registrado. Tente outro.');
        } else {
            res.send('Erro ao registrar usuário. Tente novamente.');
        }
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email, senha });
        if (!usuario) {
            return res.send('Usuário ou senha incorretos.');
        }
        res.redirect('/adicionar-filme');
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.send('Erro ao realizar login. Tente novamente.');
    }
});

//app.get('/adicionar-filme', (req, res) => {
//    res.render('adicionar-filme.html');
//});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.get('/home', (req, res) => {
    res.render('home.html');
});

app.get('/adicionar-filme', async (req, res) => {
    const filmes = await Filme.find();
    const titulos = filmes.map(filme => filme.titulo);
    res.render('adicionar-filme.html', { filmes: titulos });
});

app.post('/adicionar-filme', async (req, res) => {
    const { titulo } = req.body;
    try {
        const novoFilme = new Filme({ titulo });
        await novoFilme.save();
        res.redirect('/adicionar-filme');
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
        res.send('Erro ao adicionar filme. Tente novamente.');
    }
});

app.get('/excluir-filme', async (req, res) => {
    const filmes = await Filme.find();
    const titulos = filmes.map(filme => filme.titulo);
    res.render('excluir-filme.html', { filmes: titulos });
});

app.post('/excluir-filme', async (req, res) => {
    const { filme } = req.body;
    console.log('Filme a ser excluído:', filme);
    try {
        await Filme.deleteOne({ titulo: filme });
        res.redirect('/excluir-filme');
    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        res.send('Erro ao excluir filme. Tente novamente.');
    }
});

app.get('/registrar', (req, res) => {
    res.render('registrar.html');
});

app.get('/editar-filme', async (req, res) => {
    const filmes = await Filme.find();
    const titulos = filmes.map(filme => filme.titulo);
    res.render('editar-filme.html', { filmes: titulos });
});

app.post('/editar-filme', async (req, res) => {
    const { filme, novoNome } = req.body;
    try {
        await Filme.updateOne({ titulo: filme }, { titulo: novoNome });
        res.redirect('/editar-filme');
    } catch (error) {
        console.error('Erro ao editar filme:', error);
        res.send('Erro ao editar filme. Tente novamente.');
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
