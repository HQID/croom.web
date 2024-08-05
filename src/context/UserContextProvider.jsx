import axios from 'axios';
import { useState, useEffect } from 'react'
import UserContext from './UserContext';

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        if(!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data)
            }).catch(err => {
                console.error("Error fetching profile:", err);
            });
        }
    }, [])
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;