const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/usuarios';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB com sucesso!');
});

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
