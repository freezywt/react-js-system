import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import './profile.css';

import Header from '../../Components/Header';
import Title from '../../Components/Title';

import profileimg from '../../Assets/avatar.png';

import { AuthContext } from '../../Contexts/auth';
import firebase from '../../Services/firebaseConnection';

import { FiSettings, FiUpload } from 'react-icons/fi';

export default function Profile(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [ name, setName ] = useState(user && user.name);
    const [ email, setEmail ] = useState(user && user.email);
    
    const [ avatarUrl , setAvatarUrl ] = useState(user && user.avatarUrl);
    const [ profileImg,  setProfileImg ] = useState(null);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                setProfileImg(image);
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                toast.warning('Send a PNG or JPG type image');
                setProfileImg(null);
                return null;
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
            .ref(`images/${currentUid}/${profileImg.name}`)
                .put(profileImg)
                    .then(async() => {
                        toast.success('Photo uploaded with sucefull!');

                        await firebase.storage().ref(`images/${currentUid}`)
                            .child(profileImg.name).getDownloadURL()
                                .then(async(url) => {
                                    let urlPicture = url;

                                    await firebase.firestore().collection('users')
                                        .doc(user.uid)
                                            .update({
                                                avatarUrl: urlPicture,
                                                name: name,
                                            })
                                                .then(() => {
                                                    let data = {
                                                        ...user,
                                                        avatarUrl: urlPicture,
                                                        name: name,
                                                    };
                                                    setUser(data);
                                                    storageUser(data);
                                                })
                                })
                    })
                    .catch(err => {
                        console.error(err);
                    })
    }

    async function handleSave(e){
        e.preventDefault();

        if(profileImg === null && name !== ''){
            await firebase.firestore().collection('users')
                .doc(user.uid)
                    .update({
                        name: name,
                    })
                        .then(() => {
                            let data = {
                                ...user,
                                name: name,
                            };
                            setUser(data);
                            storageUser(data);
                        })
        }
        else if(name !== '' && profileImg !== null) {
            handleUpload();
        }
    }

    return(
        <div>
            <Header />
            
            <div className="content">
                <Title name="My Profile">
                    <FiSettings color="#000" size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span><FiUpload color="#fff" size={25}/></span>

                            <input type="file" accept="image/*" onChange={handleFile}/> <br />
                            { avatarUrl === null ?
                                <img src={profileimg} width="250" height="250" alt="profile image"/>
                                :
                                <img src={avatarUrl} width="250" height="250" alt="profile image"/>
                            }
                        </label>
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type="submit">Save</button>
                    </form>
                </div>
                <div className="container">
                    <button className="logoutBtn" onClick={() => signOut()}>logout</button>
                </div>
            </div>
        </div>

    )
}