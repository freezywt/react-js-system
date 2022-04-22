import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/auth';

import { MdWifiCalling2 } from 'react-icons/md';

export default function SignUp() {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const { signUp } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();

    if(name !== '' && email !== '' && password !== ''){
      signUp(email, password, name);
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
          <h1>Create a account</h1>
          <input type="text" placeholder="Your Name"  value={name} onChange={ (e) => setName(e.target.value) } required/>
          <input type="text" placeholder="email@email.com"  value={email} onChange={ (e) => setEmail(e.target.value) } required/>
          <input type="password" placeholder="*****" value={password} onChange={ (e) => setPassword(e.target.value) } required/>
          <button type="submit">Register</button>
        </form>

        <Link to="/">already have an account? Login</Link>
      </div>
    </div>
  );
}
