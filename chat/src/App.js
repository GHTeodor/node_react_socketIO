import {useEffect, useReducer} from "react";
import axios from "axios";

import './App.css';
import Chat from "./components/Chat";
import JoinBlock from "./components/JoinBlock";
import reducer from "./reducer";
import socket from "./socket";

function App() {
    const [state, dispatch] = useReducer(reducer,{
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
    });

    const onLogin = async (obj) => {
        dispatch({type: "JOINED", payload: obj});
        socket.emit("ROOM:JOIN", obj);

        const {data} = await axios.get(`/rooms/${obj.roomId}`);
        dispatch({
            type: "SET_DATA",
            payload: data,
        }) // todo Show old messages for new joined user
        // setUsers(data.users); // todo Don't show old messages for new joined user
    };

    const setUsers = (users) => {
        dispatch({
            type: "SET_USERS",
            payload: users
        });
    }

    const addMessage = ({userName, text}) => {
        dispatch({
            type: "NEW_MESSAGE",
            payload: {
                text,
                userName
            },
        });
    };

    useEffect(() => {
        socket.on("ROOM:SET_USERS", setUsers);
        socket.on("ROOM:NEW_MESSAGE", addMessage);
    }, []);

    window.socket = socket;

    return (
        <div className="wrapper">
            {!state.joined
                ? <JoinBlock onLogin={onLogin} />
                : <Chat  {...state} onAddMessage={addMessage} />}
        </div>
    );
}

export default App;
