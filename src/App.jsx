import React from 'react';
import Auth from './components/Auth';
import Journal from './components/Journal';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {user ? <Journal /> : <Auth />}
    </div>
  );
}

export default App;