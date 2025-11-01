const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'doacoesdb' 
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado no banco MySQL!');
});


app.post('/beneficiarios', (req, res) => {
  const { nomeResponsavel, endereco, qtdPessoasFamilia } = req.body;
  const sql = 'INSERT INTO beneficiarios (nomeResponsavel, endereco, qtdPessoasFamilia) VALUES (?, ?, ?)';
  db.query(sql, [nomeResponsavel, endereco, qtdPessoasFamilia], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar' });
    res.status(201).json({ idBeneficiario: results.insertId, nomeResponsavel, endereco, qtdPessoasFamilia });
  });
});


app.get('/beneficiarios', (req, res) => {
  db.query('SELECT * FROM beneficiarios', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar' });
    res.json(results);
  });
});


app.put('/beneficiarios/:id', (req, res) => {
  const { id } = req.params;
  const { nomeResponsavel, endereco, qtdPessoasFamilia } = req.body;
  const sql = 'UPDATE beneficiarios SET nomeResponsavel=?, endereco=?, qtdPessoasFamilia=? WHERE idBeneficiario=?';
  db.query(sql, [nomeResponsavel, endereco, qtdPessoasFamilia, id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao atualizar' });
    res.json({ idBeneficiario: id, nomeResponsavel, endereco, qtdPessoasFamilia });
  });
});


app.delete('/beneficiarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM beneficiarios WHERE idBeneficiario=?', [id], (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao remover' });
    res.status(204).end();
  });
});

app.listen(3001, () => console.log('API rodando na porta 3001'));
