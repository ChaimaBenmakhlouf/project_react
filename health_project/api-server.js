const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./src/auth_config.json");
const db = require('./src/db'); 
const { v4: uuidv4 } = require('uuid');
const webpush = require('web-push');
const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));
app.use(express.json()); 

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});



app.get("/api/utilisateurs/:auth0_id", (req, res) => {
  const auth0Id = req.params.auth0_id;

  db.query("SELECT * FROM Utilisateurs WHERE auth0_id = ?", [auth0Id], (err, result) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    } else {
      res.json(result[0]);
    }
  });
});

app.get("/api/token", checkJwt, (req, res) => {
  const userInfo = req.auth.payload; 
  res.json({
    token: req.header("Authorization"), 
    user: userInfo 
  });
});

app.post("/api/utilisateurs", (req, res) => {
  const id = uuidv4(); 
  const { auth0_id, email, nom, prenom } = req.body;

  const query = `INSERT INTO Utilisateurs (id, auth0_id, email, nom, prenom) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [id, auth0_id, email, nom, prenom], (err, result) => {
      if (err) {
          console.error("Détails de l'erreur MySQL:", err);
          res.status(500).json({ error: "Erreur lors de la création de l'utilisateur", details: err });
      } else {
          res.status(201).json({ message: "Utilisateur créé avec succès", userId: id });
      }
  });
});

app.post("/api/profiles", checkJwt, (req, res) => {
  const { utilisateur_id, num_securite_sociale, taille, poids, autres_infos } = req.body;

  const query = `
    INSERT INTO Profiles (utilisateur_id, num_securite_sociale, taille, poids, autres_infos)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    num_securite_sociale = VALUES(num_securite_sociale),
    taille = VALUES(taille),
    poids = VALUES(poids),
    autres_infos = VALUES(autres_infos)
  `;

  db.query(query, [utilisateur_id, num_securite_sociale, taille, poids, JSON.stringify(autres_infos)], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la création ou de la mise à jour du profil" });
    } else {
      res.json({ message: "Profil mis à jour avec succès", result });
    }
  });
});


app.post("/api/questionnaires", checkJwt, (req, res) => {
  const { utilisateur_id, type_questionnaire, reponses } = req.body;

  const query = `
    INSERT INTO Questionnaires (utilisateur_id, type_questionnaire, reponses)
    VALUES (?, ?, ?)
  `;

  db.query(query, [utilisateur_id, type_questionnaire, JSON.stringify(reponses)], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de l'enregistrement des réponses" });
    } else {
      res.json({ message: "Réponses enregistrées avec succès", result });
    }
  });
});


app.get("/api/notifications/:userId", checkJwt, (req, res) => {
  const userId = req.params.userId;

  db.query("SELECT * FROM Historique_Notifications WHERE utilisateur_id = ?", [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
    } else {
      res.json(result);
    }
  });
});

app.post('/api/subscribe',checkJwt, (req, res) => {
  console.log('webpushtoken',req.body);
  const userId = req.auth.payload.sub;
  console.log('id user',userId);
  webpush.setVapidDetails(
    'mailto: <test1@gmail.com',
    'BB9IZJNsWEuqAcQ9SBVhD2kchQ3cTkc9Ze6uKltb3sNANaCbRtQI7HFnk6j1IHCklCRVfPjPa_Ih9fF__R3C-RM',
    'xyb4BHCyPFt6Qei8tLbB0_dgC3zYVxz3XOuAsromrzw'
  );

  //Angular format for webppush
  const payload = {
    notification: {
        title: 'Ma notification d\'exemple',
        body: 'Voici le corps de ma notification',
        icon: 'assets/icons/icon-384x384.png',
        actions: [
            { action: 'bar', title: 'Action custom' },
            { action: 'baz', title: 'Une autre action' },
        ],
        data: {
            onActionClick: {
                default: { operation: 'openWindow',url: "http://localhost:4200/notifications" },
                bar: {
                    operation: 'focusLastFocusedOrOpen',
                    url: '/signin',
                },
                baz: {
                    operation: 'navigateLastFocusedOrOpen',
                    url: '/signin',
                },
            },
        },
    },
};
  webpush.sendNotification(req.body, JSON.stringify(payload));
// We will be coding here

});





app.listen(port, () => console.log(`API Server listening on port ${port}`));
