import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Auth/Dashboard';
import ModifyUser from './components/Auth/Modify';
import { AuthContext ,AuthProvider} from './components/Auth/AuthContext'; // Import the PrivateRoute component

const App = () => { 
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-user" element={<ModifyUser />} />
        </Routes>
      </AuthProvider>
    </Router>
  );  
};

export default App;