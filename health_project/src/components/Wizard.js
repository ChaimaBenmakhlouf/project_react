import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const Step1 = ({ formData, setFormData }) => (
  <div>
    <h2>Étape 1 : Informations Personnelles</h2>
    <label>Nom :</label>
    <input
      type="text"
      value={formData.nom}
      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
    />
    <br />
    <label>Prénom :</label>
    <input
      type="text"
      value={formData.prenom}
      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
    />
  </div>
);

const Step2 = ({ formData, setFormData }) => (
  <div>
    <h2>Étape 2 : Informations Médicales</h2>
    <label>Taille (cm) :</label>
    <input
      type="number"
      value={formData.taille}
      onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
    />
    <br />
    <label>Poids (kg) :</label>
    <input
      type="number"
      value={formData.poids}
      onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
    />
  </div>
);

const Step3 = ({ formData, setFormData }) => (
  <div>
    <h2>Étape 3 : Questions de Santé</h2>
    <label>Avez-vous des allergies ? :</label>
    <input
      type="text"
      value={formData.allergies}
      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
    />
    <br />
    <label>Conditions médicales :</label>
    <textarea
      value={formData.conditions}
      onChange={(e) =>
        setFormData({ ...formData, conditions: e.target.value })
      }
    />
  </div>
);

const Wizard = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    taille: '',
    poids: '',
    allergies: '',
    conditions: '',
  });

  const steps = [
    <Step1 formData={formData} setFormData={setFormData} />,
    <Step2 formData={formData} setFormData={setFormData} />,
    <Step3 formData={formData} setFormData={setFormData} />,
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Utilisateur non authentifié. Veuillez vous connecter.");
      return;
    }

    try {
      const token = await getAccessTokenSilently(); // Récupère le token depuis Auth0
      const payload = {
        utilisateur_id: user.sub, // Utilise l'identifiant utilisateur fourni par Auth0
        type_questionnaire: "formulaire_sante",
        reponses: formData, // Données collectées du formulaire
      };

      const response = await fetch('http://localhost:3001/api/questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ajoute le token JWT pour l'authentification
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur lors de la soumission :", errorData);
        alert(`Erreur lors de la soumission : ${response.statusText}`);
        return;
      }

      alert('Données soumises avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
      alert('Une erreur est survenue lors de la soumission.');
    }
  };

  return (
    <div>
      {steps[currentStep]}
      <div>
        {currentStep > 0 && <button onClick={handleBack}>Précédent</button>}
        {currentStep < steps.length - 1 && (
          <button onClick={handleNext}>Suivant</button>
        )}
        {currentStep === steps.length - 1 && (
          <button onClick={handleSubmit}>Soumettre</button>
        )}
      </div>
    </div>
  );
};

export default Wizard;
