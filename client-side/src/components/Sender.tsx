import { useEffect, useState } from "react"

export const Sender = ()=>{
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = ()=>{
            socket.send(JSON.stringify({type: 'sender' }));
        }
    },[])

    async function sendVideo() {
        if(!socket) return;

        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription}));

    }

    return <div>
        <button
        onClick={sendVideo}
        >
            open camera
        </button>
    </div>
}