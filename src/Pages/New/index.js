import { useState, useEffect, useContext } from 'react';
import firebase from '../../Services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';
import './new.css';

import Header from '../../Components/Header';
import Title from '../../Components/Title';
import { AuthContext } from '../../Contexts/auth';

import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function New(){
    const { id } = useParams();
    const history = useHistory();


    const [ loadCustomers, setLoadCustomers ] = useState(true);
    const [ customers, setCustomers ] = useState([]);
    const [ customerSelected, setCustomerSelected ] = useState(0);

    const [ subject, setSubject ] = useState('Support');
    const [ state, setState ] = useState('Opened');
    const [ complement, setComplement ] = useState('');

    const [ idCustumer, setIdCustumer ] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
                .get()
                    .then((snapshot) => {
                        let list = [];
                        snapshot.forEach((doc) => {
                            list.push({
                                id: doc.id,
                                name: doc.data().name,
                            })
                        })

                        if(list.length === 0){
                            toast.warning('No componies found');
                            setCustomers([ {id: 1, name: 'Freela'}]);
                            setLoadCustomers(false);
                            return;
                        }

                        setCustomers(list);
                        setLoadCustomers(false);

                        if(id){
                            loadId(list);
                        }
                    })
                        .catch((error) => {
                            toast.error('Ops...Somenthing went error', error);
                            setLoadCustomers(false);
                            setCustomers([ {id: 1, name: ''}]);
                        })
        }

        loadCustomers();
    }, [id]);

    async function loadId(list){
        await firebase.firestore().collection('calls').doc(id)
            .get()
                .then((snapshot) => {
                    setSubject(snapshot.data().subject);
                    setState(snapshot.data().state);
                    setComplement(snapshot.data().complement);

                    let index = list.findIndex(item => item.id === snapshot.data().custumerId);
                    setCustomerSelected(index);
                    setIdCustumer(true);
                })
                    .catch((err) => {
                        console.log(err);
                        setIdCustumer(false);
                        setCustomers([{id: '1', name: ''}])
                    })
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustumer){
            await firebase.firestore().collection('calls')
                .doc(id)
                    .update({
                        custumer: customers[customerSelected].name,
                        custumerId: customers[customerSelected].id,
                        subject: subject,
                        state: state,
                        complement: complement,
                        userId: user.uid,
                    })
                        .then(() => {
                            toast.success('Call edited with succefully!');
                            setCustomerSelected(0);
                            setComplement('');
                            history.push('/dashboard');
                        })
                            .catch(() => {
                                toast.error('Ops...Somenthing went error');
                            })
        }

        await firebase.firestore().collection('calls')
            .add({
                created: new Date(),
                custumer: customers[customerSelected].name,
                custumerId: customers[customerSelected].id,
                subject: subject,
                state: state,
                complement: complement,
                userId: user.uid,
            })
                .then(() => {
                    toast.success('Call created sucefully');
                    setComplement('');
                    setCustomerSelected(0);
                })
                    .catch((error) => {
                        toast.error('Ops...Somenthing went error');
                    })
    }

    function handleChangeSelect(e){
        setSubject(e.target.value);
    }

    function handleOptionChange(e){
        setState(e.target.value);
    }

    function handleChangeCustomers(e){
        setCustomerSelected(e.target.value);
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="New call">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Custumers</label>

                        {loadCustomers ? 
                            (
                                <input type="text" disabled={true} value="Loading customers..."/>
                            ):
                            (
                                <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.name}
                                        </option>
                                    )
                                })}
                            </select>
                            )
                        }

                        <label>Subject</label>
                        <select value={subject} onChange={handleChangeSelect}>
                            <option value="Support">Support</option>
                            <option value="Technical Visit">Technical Visit</option>
                            <option value="Financial">Financial</option>
                        </select>

                        <label>State</label>
                        <div className="state">
                            <input type="radio" name="radio" value="Opened" onChange={handleOptionChange} checked={ state === 'Opened' }/>
                            <span>Opened</span>

                            <input type="radio" name="radio" value="Progress" onChange={handleOptionChange} checked={ state === 'Progress' }/>
                            <span>Progress</span>

                            <input type="radio" name="radio" value="Answered" onChange={handleOptionChange} checked={ state === 'Answered' }/>
                            <span>Answered</span>
                        </div>

                        <label>Complement</label>
                        <textarea 
                            type="text" 
                            placeholder="Describe your problem (optional)." 
                            value={complement} 
                            onChange={ (e) => setComplement(e.target.value) }
                            />

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}