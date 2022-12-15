/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useParams } from 'react-router-dom';

const RedirectDocument = props => {
    const { id } = useParams();
    const getDocument = async () => {
        const VcardDataColletion = doc(db, "VcardData", id);
        await getDoc(VcardDataColletion).then(res => {
            if (res.exists()) {
                window.location.href = res.data().data
            }
        })
    }
    React.useEffect(() => {
        getDocument()
    }, [])
    return (
        <div>
            <h1>Redirigiendo....</h1>
        </div>
    );
};

export default RedirectDocument;