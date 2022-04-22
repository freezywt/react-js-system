import { useState } from 'react';
import firebase from '../../Services/firebaseConnection';

import './customers.css';

import Title from '../../Components/Title';
import Header from '../../Components/Header';

import { FiUser } from 'react-icons/fi';

import { toast } from 'react-toastify';

export default function Customers(){
    const [ name, setName ] = useState('');
    const [ cnpj, setCnpj ] = useState('');
    const [ adress, setAdress ] = useState('');

    async function handleAdd(e){
        e.preventDefault();

        if(name !== '' && cnpj !== '' && adress !== ''){
            await firebase.firestore().collection('customers')
                .add({
                    name: name,
                    cnpj: cnpj,
                    adress: adress,
                })
                    .then(() => {
                        setName('')
                        setCnpj('');
                        setAdress('');
                        toast.info('Company registred with sucefully')
                    })
                        .catch((error) => {
                            console.log(error);
                            toast.error('Error registering this company');
                        })
        }else{
            toast.error('Fill in all fields');
        }

    }

    return(
        <div>
            <Header />

            <div className="content">
                <Title name="Customers">
                    <FiUser color="#000" size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Name</label>
                        <input type="text" placeholder="Your Company name" value={name} onChange={ (e) => setName(e.target.value) }/>

                        <label>Cnpj</label>
                        <input type="text" placeholder="Your cpnj" value={cnpj} onChange={ (e) => setCnpj(e.target.value) }/>

                        <label>Adress</label>
                        <input type="text" placeholder="Company's adress" value={adress} onChange={ (e) => setAdress(e.target.value) }/>

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}