const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'seu_segredo_super_secreto';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/filmesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao banco de dados'))
.catch(err => console.error('Erro ao conectar ao banco:', err));

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const MovieSchema = new mongoose.Schema({
    title: String,
    genre: String,
    userId: String,
});

const User = mongoose.model('User', UserSchema);
const Movie = mongoose.model('Movie', MovieSchema);

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    
    try {
        await user.save();
        res.json({ message: 'Registro realizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro no registro.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ message: 'Login realizado com sucesso!', token });
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/movies', authenticateToken, async (req, res) => {
    const { title, genre } = req.body;

    if (!title || !genre) {
        return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    try {
        const movie = new Movie({ title, genre, userId: req.user.userId });
        await movie.save();
        res.json({ message: 'Filme adicionado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar filme.' });
    }
});

app.get('/movies', authenticateToken, async (req, res) => {
    try {
        const movies = await Movie.find({ userId: req.user.userId });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar filmes.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});