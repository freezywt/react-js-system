import { useState, createContext, useEffect } from 'react';
import firebase from '../Services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext([]);

export default function AuthProvider({ children }) {

    const [ user, setUser ] = useState(null);
    const [ loadingAuth, setLoadingAuth ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {

        function loadStorage(){
            const storageUser = localStorage.getItem('SytemUser');

            if(storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        loadStorage();

    }, [])

    async function signIn(email, password){
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                const userProfile = await firebase.firestore().collection('users')
                    .doc(uid).get();

                    let data = {
                        uid: uid,
                        name: userProfile.data().name,
                        avatarUrl: userProfile.data().avatarUrl,
                        email: value.user.email,
                    };

                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                    toast.success('Welcome back');
            })
                .catch((err) => {
                    console.log(err);
                    toast.error('Ops...Somenthing went error');
                    setLoadingAuth(false);
                })
    }

    async function signUp(email, password, name){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( async (value) => {
                let uid = value.user.uid;

                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        name: name,
                        avatarUrl: null,
                    })
                        .then( () => {
                            let data = {
                                uid: uid,
                                name: name,
                                email: value.user.email,
                                avatarUrl: null,
                            };

                            setUser(data);
                            storageUser(data);
                            setLoadingAuth(false);
                            toast.sucess('Welcome to plataform!!')
                        })
            })
                .catch((error) => {
                    console.error(error);
                    toast.error('Ops...Somenthing went wrong')
                    setLoadingAuth(false);
                })
    }

    function storageUser(data){
        localStorage.setItem('SytemUser', JSON.stringify(data))
    }

    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SytemUser');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
            value={{ 
                signed: !!user,
                user, 
                loading, 
                signUp,
                signOut,
                signIn,
                loadingAuth,
                setUser,
                storageUser,
             }}
        >
            {children}
        </AuthContext.Provider>
    )
}