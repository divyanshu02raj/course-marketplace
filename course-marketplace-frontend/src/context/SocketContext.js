// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Connect to the backend server
            const newSocket = io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');
            setSocket(newSocket);

            // Send the user's ID to the server to register them as "online"
            newSocket.emit('addUser', user.id);

            return () => newSocket.close();
        } else {
            // If there's no user, disconnect any existing socket
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
