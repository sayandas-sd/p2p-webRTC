import { useEffect, useState } from "react"

export const Sender = ()=>{
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = ()=>{
            socket.send(JSON.stringify({type: 'sender' }));
        }
        setSocket(socket)
    },[])

    async function sendVideo() {
        if(!socket) return;

        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        //send ice candidate :-)
        pc.onicecandidate = (event)=>{
            if(event.candidate){
                socket?.send(JSON.stringify({type: 'iceCandidate', candidate: event.candidate}));
            }
        }

        socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription}));
        
        //sender catch the event in here
        socket.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if(data.type === "createAnswer") {
                pc.setRemoteDescription(data.sdp)
            } else if(data.type === 'iceCandidate'){
                pc.addIceCandidate(data.candidate)
            }
        }
    }

    return <div>
        <button
        onClick={sendVideo}
        >
            open camera
        </button>
    </div>
}