import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddUser from './components/AddUser';
import Home from './components/Home';
import Axios from './components/Axios';
import Swal from 'sweetalert2'

function App() {
  //check for server start or not
  useEffect(() => {
    Axios.get('/sanctum/csrf-cookie').then(response => {
    })
      .catch(({ response }) => {
        if (!response) {
          Swal.fire({
            icon: 'error',
            title: 'Something is wrong',
            text: 'Server is not started!',
          })
        }
      });
  }, [])
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/user" component={AddUser} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
