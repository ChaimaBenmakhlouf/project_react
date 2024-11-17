import React, { useEffect } from "react"; 
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import UserData from "./views/UserData";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

const App = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading, error } = useAuth0();

  
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently(); 
          console.log("User ID (auth0_id):", user.sub); 
          console.log("Token utilisé:", token); 
        } catch (err) {
          console.error("Erreur lors de la récupération du token:", err);
        }
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/user-data" component={UserData} /> 
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
