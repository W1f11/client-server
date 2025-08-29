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
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
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
    req.user = decoded; // id + email + role
    next();
  });
}

// ✅ REGISTER
app.post('/register', async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

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
      const insertSQL = 'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertSQL, [email, username, hashedPassword, role || 'user'], (err) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
        return res.status(201).json({ message: 'Utilisateur créé avec succès ✅' });
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// ✅ LOGIN
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
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Connexion réussie ✅', token });
  });
});

// ✅ GET USERS (admin → tous / user → seulement lui-même)
app.get('/users', verifyToken, (req, res) => {
  if (req.user.role === 'admin') {
    const sql = "SELECT id, username, email, role FROM users";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
      res.json(results);
    });
  } else {
    const sql = "SELECT id, username, email, role FROM users WHERE id = ?";
    db.query(sql, [req.user.id], (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
      res.json(results);
    });
  }
});

// ✅ GET PROFILE (exemple route protégée)
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Route protégée OK', user: req.user });
});

// ✅ DELETE USER (admin uniquement)
app.delete('/users/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès refusé : admin requis" });
  }

  const deleteSQL = "DELETE FROM users WHERE id = ?";
  db.query(deleteSQL, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur supprimé avec succès ✅" });
  });
});

// ✅ UPDATE USER (admin ou utilisateur lui-même)
app.put('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { email, username, password, role } = req.body;

  // Seul admin ou utilisateur lui-même peut modifier
  if (req.user.role !== 'admin' && req.user.id != id) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  let fields = [];
  let values = [];

  if (email) { fields.push("email = ?"); values.push(email); }
  if (username) { fields.push("username = ?"); values.push(username); }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    fields.push("password = ?");
    values.push(hashedPassword);
  }
  if (role && req.user.role === 'admin') { // Seul admin peut changer le rôle
    fields.push("role = ?");
    values.push(role);
  }

  if (fields.length === 0) return res.status(400).json({ message: "Aucune donnée à modifier" });

  values.push(id);
  const updateSQL = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  db.query(updateSQL, values, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur", error: err });
    res.json({ message: "Utilisateur mis à jour avec succès ✅" });
  });
});

// Lancer le serveur
app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
