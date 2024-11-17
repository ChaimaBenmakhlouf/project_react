// import React, { useState } from 'react';
// import axios from 'axios';

// function UserData() {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(
//         'http://localhost:3001/api/utilisateurs/96c238eb-a49d-4e91-bc8d-5c20738f82e5'
//       );
//       setUserData(response.data);
//     } catch (err) {
//       console.error("Erreur lors de la récupération des données :", err);
//       setError(err.response.data || "Erreur inconnue");
//     }
//   };

//   return (
//     <div>
//       <button onClick={fetchUserData}>Fetch User Data</button>
//       {error && <p style={{ color: 'red' }}>Erreur : {error.error}</p>}
//       {userData && (
//         <div>
//           <h3>User info :</h3>
//           <p><strong>Nom :</strong> {userData.nom}</p>
//           <p><strong>Prénom :</strong> {userData.prenom}</p>
//           <p><strong>Email :</strong> {userData.email}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserData;
