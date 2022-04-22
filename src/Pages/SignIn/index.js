import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/auth';
import './signin.css';

import { MdWifiCalling2 } from 'react-icons/md';

function SignIn() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      signIn(email, password);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <MdWifiCalling2 color="#fff" size={40} />
          <p>React Call</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Join</h1>
          <input type="text" placeholder="youremail@email.xyz"  value={email} onChange={ (e) => setEmail(e.target.value) }/>
          <input type="password" placeholder="••••••••••••••••" value={password} onChange={ (e) => setPassword(e.target.value) }/>
          <button type="submit">{loadingAuth ? 'Loading...' : 'Login'}</button>
        </form>

        <Link to="/register">Create a account</Link>
      </div>
    </div>
  );
}

export default SignIn;
