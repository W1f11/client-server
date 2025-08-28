require('dotenv').config(); // Charger les variables .env
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

// Connexion à la DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'plantdb',
});

db.connect((err) => {
  if (err) console.error('DB connection error:', err);
  else console.log('DB connected');
});

// Clé secrète JWT depuis .env
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour protéger les routes
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = decoded; // id + email
    next();
  });
}

// Endpoint /register
app.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const checkSQL = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkSQL, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email ou username déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSQL = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
      db.query(insertSQL, [email, username, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
        res.status(201).json({ message: 'Utilisateur créé !' });
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Endpoint /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  const checkSQL = 'SELECT * FROM users WHERE email = ?';
  db.query(checkSQL, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Connexion réussie', token });
  });
});



// Exemple route protégée
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Route protégée OK', user: req.user });
});

// Lancer le serveur
app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
