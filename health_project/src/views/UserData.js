import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function UserData() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);


  const fetchUserData = async () => {
    try {
      const token = await getAccessTokenSilently(); 
      console.log("Token utilisé pour l'appel API :", token); 
      console.log("User ID (auth0_id) :", user.sub);

      const response = await axios.get(`http://localhost:3001/api/utilisateurs/${user.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setUserData(response.data); 
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
      setError(err.response ? err.response.data : "Erreur inconnue");
    }
  };

  return (
    <div>
      <h1>Utilisateur infos</h1>
      <button onClick={fetchUserData}>Fetch Data</button>
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
      {userData && (
        <div>
          <h3>Informations :</h3>
          <p>Nom : {userData.nom}</p>
          <p>Prénom : {userData.prenom}</p>
          <p>Email : {userData.email}</p>
        </div>
      )}
    </div>
  );
}

export default UserData;
