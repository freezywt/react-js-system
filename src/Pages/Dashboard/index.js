import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import firebase from '../../Services/firebaseConnection';

import './dashboard.css';

import Header from '../../Components/Header';
import Title from '../../Components/Title';
import Modal from '../../Components/Modal';

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const listRef = firebase.firestore().collection('calls').orderBy('created', 'desc');

export default function Dashboard() {
    const [ calls, setCalls ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ loadingMore, setLoadingMore ] = useState(false);
    const [ isEmpty, setIsEmpty ] = useState(false);
    const [ lastDocs, setLastDocs ] = useState();

    const [ showPostModal, setShowPostModal ] = useState(false);
    const [ detail, setDetail ] = useState();

    useEffect(() => {
  
      loadCalls();

      return () => {

      }
    },[]);

    async function loadCalls(){
      await listRef.limit(5)
        .get()
          .then((snapshot) => {
            updateState(snapshot);
          })
            .catch(() => {
              toast.error('Ops...Somenthing went error [loading posts]');
              setLoadingMore(false);
            })
      setLoading(false);
    }

    async function updateState(snapshot){
      const isCollectionEmpty = snapshot.size === 0;

      if(!isCollectionEmpty){
        let callList = [];

        snapshot.forEach((doc) => {
          callList.push({
            id: doc.id,
            subject: doc.data().subject,
            custumer: doc.data().custumer,
            custumerId: doc.data().custumerId,
            created: doc.data().created,
            createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
            state: doc.data().state,
            complement: doc.data().complement,
          })

          const lastDoc = snapshot.docs[snapshot.docs.length - 1];

          setCalls([...callList]);
          setLastDocs(lastDoc);
        })
      }else{
        setIsEmpty(true);
      }

      setLoadingMore(false);
    }

    async function handleMore(){
      setLoadingMore(true);
      await listRef.startAfter(lastDocs).limit(5)
        .get()
          .then((snapshot) => {
            updateState(snapshot);
          })
    }

    function togglePostModal(item){
      setShowPostModal(!showPostModal);
      setDetail(item);
    }

    if(loading){
      return(
        <div>
          <Header />
          
          <div className="content">
            <Title name="Calls">
              <FiMessageSquare color='#000' size={25} />
            </Title>

            <div className="container dashboard">
              <span>looking for calls</span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
          <Header />
          <div className="content">
            <Title name="Calls">
              <FiMessageSquare color='#000' size={25} />
            </Title>

            {calls.length === 0 ?
              (
                <div className="container dashboard">
                  <span>No calls registred...</span>
                  <Link to="/new" className="new"><FiPlus color='#fff' size={25} />New call</Link>
                </div>
              ) :
              (
                <>
                  <Link to="/new" className="new"><FiPlus color='#fff' size={25} />New call</Link>

                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Custumer</th>
                        <th scope="col">Subject</th>
                        <th scope="col">State</th>
                        <th scope="col">Created at</th>
                        <th scope="col">#</th>
                      </tr>
                    </thead>
                    <tbody>
                        {calls.map((item, index) => {
                          return(
                            <tr key={index}>
                                <td data-label="Custumer">{item.custumer}</td>
                                <td data-label="Subject">{item.subject}</td>
                                <td data-label="Status">
                                  <button className="badge" style={{ backgroundColor: item.state === 'Opened' ? '#5cb85c' : '#999' }}>{item.state}</button>
                                </td>
                                <td data-label="Registered">{item.createdFormated}</td>
                                <td data-label="#">
                                  <button className='action' style={{ backgroundColor: '#3583f6'}} onClick={ () => togglePostModal(item) }>
                                    <FiSearch color='#fff' size={17} />
                                  </button>
                                  <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: '#f6a935'}}>
                                    <FiEdit2 color='#fff' size={17} />
                                  </Link>
                                </td>
                            </tr>
                          )
                        })}            
                    </tbody>
                  </table>
                  
                  {loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15}}>Loading calls</h3>}
                  { !loadingMore && !isEmpty &&  <button className='btn-more' onClick={handleMore}>Load more</button>}
                </>
              )
            }
          </div>

          {showPostModal && (
            <Modal 
              content={detail}
              close={togglePostModal}
            />
          )}
      </div>
    );
  }