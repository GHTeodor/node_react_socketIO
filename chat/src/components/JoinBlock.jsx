import React, {useState} from 'react';
import axios from 'axios';

const JoinBlock = ({onLogin}) => {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);

    const onEnter = async () => {
        if (!roomId || !userName) {
            alert('Wrong roomId and/or userName');
        }
        setLoggedIn(true);

        await axios.post('/rooms', {roomId, userName});
        onLogin({roomId, userName});
    };

    return (
        <div className="join-block">
            <input type="text" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)}/>
            <input type="text" placeholder="Your name" value={userName} onChange={e => setUserName(e.target.value)}/>
            <button disabled={isLoggedIn} onClick={onEnter} className="btn btn-success">Sign{isLoggedIn ? "Out" : "In"}</button>
        </div>
    );
};

export default JoinBlock;
