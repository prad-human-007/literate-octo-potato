import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const URL = "http://localhost:3000";

let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

export default function Room() {
    const [searchParam] = useSearchParams();
    const name = searchParam.get("name");
    const age = searchParam.get("age");
    const [socket, setSocket] = useState<null | Socket>(null);
    const [socketId, setSocketId] = useState<String | null>(null);
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [peerConnection, setPeerconnection] = useState<RTCPeerConnection | null>(null);


    useEffect(() => {
        const socketInstance = io(URL);
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            setSocketId(socketInstance.id || null);
        });

        socketInstance.on("server-reply", (serverReply: string) => {
            setReply(serverReply)
        });
        // Cleanup on unmount

        return () => {
            socketInstance.disconnect();
        };
    }, []); // Empty dependency array ensures this runs once on mount

    const setupPeerConnection = () => {
        
        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [ 'stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302' ]
                }
            ]
        });

        
    };

    const onSendMessage = () => {
        // console.log(`onSendMessage: ${message}`)
        if(socket && message) {
            socket.emit("clientMsg", message);
            setMessage("");
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1> Hi {name}!! You look good for {age}</h1>
            <p>{`This is your socket ${socketId}`}</p>
            <div className="flex flex-row gap-2 justify-center">
                <input 
                type="text"
                className="rounded rounded-lg px-4"
                value={message}
                onChange={(ip) => setMessage(ip.target.value)}
                placeholder="Enter Your Msg Here"
                />
                <button onClick={onSendMessage}>Send</button>
            </div>
            <h3>Reply: {reply}</h3>
        </div>
    );
}


// import { useSearchParams } from "react-router-dom";
// import { io, Socket } from "socket.io-client";
// import { useEffect, useState } from "react";

// const URL = "http://localhost:3000";

// const peerConfiguration = {
//     iceServers:[
//         {
//             urls:[
//               'stun:stun.l.google.com:19302',
//               'stun:stun1.l.google.com:19302'
//             ]
//         }
//     ]
// };

// export default function Room() {
//     const [searchParam] = useSearchParams();
//     const name = searchParam.get("name");
//     const age = searchParam.get("age");
//     const [socket, setSocket] = useState<null | Socket>(null);
//     const [socketId, setSocketId] = useState<string | null>(null);
//     const [message, setMessage] = useState("");
//     const [reply, setReply] = useState("");
//     const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

//     useEffect(() => {
//         // Initialize socket
//         const socketInstance = io(URL);
//         setSocket(socketInstance);

//         // Handle socket connection
//         socketInstance.on("connect", () => {
//             setSocketId(socketInstance.id || null);
//         });

//         socketInstance.on("server-reply", (serverReply: string) => {
//             setReply(serverReply);
//         });

//         // Cleanup on unmount
//         return () => {
//             socketInstance.disconnect();
//         };
//     }, []); 

//     const setupPeerConnection = () => {
//         const pc = new RTCPeerConnection(peerConfiguration);

//         pc.onicecandidate = (event) => {
//             if (event.candidate && socket) {
//                 socket.emit("ice-candidate", event.candidate);
//             }
//         };

//         pc.onconnectionstatechange = () => {
//             if (pc.connectionState === "connected") {
//                 console.log("Peers connected!");
//             }
//         };

//         setPeerConnection(pc);
//     };

//     const createAndSendOffer = async () => {
//         if (!peerConnection || !socket) return;

//         try {
//             const offer = await peerConnection.createOffer();
//             await peerConnection.setLocalDescription(offer);

//             socket.emit("offer", offer); // Send offer to signaling server
//         } catch (err) {
//             console.error("Error creating offer:", err);
//         }
//     };

//     const onSendMessage = () => {
//         if (socket && message) {
//             socket.emit("clientMsg", message);
//             setMessage("");
//         }
//     };

//     return (
//         <div className="flex flex-col gap-4">
//             <h1> Hi {name}!! You look good for {age}</h1>
//             <p>{`This is your socket ${socketId}`}</p>
//             <div className="flex flex-row gap-2 justify-center">
//                 <input 
//                 type="text"
//                 className="rounded rounded-lg px-4"
//                 value={message}
//                 onChange={(ip) => setMessage(ip.target.value)}
//                 placeholder="Enter Your Msg Here"
//                 />
//                 <button onClick={onSendMessage}>Send</button>
//                 <button onClick={() => { setupPeerConnection(); createAndSendOffer(); }}>Create Offer</button>
//             </div>
//             <h3>Reply: {reply}</h3>
//         </div>
//     );
// }
