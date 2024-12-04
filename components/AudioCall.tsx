import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from "socket.io-client"

interface User {
  userId: string | null;
  username: string | null;
  socketId: string;
}

interface AudioCallProps {
  roomId: string ;
  userId: string | null;
  username: string | null;
}

const AudioCall: React.FC<AudioCallProps> = ({ roomId, userId, username }) => {

  
  if (!username && !userId) {
    throw new Error("Either username or userId must be provided.");
  }
  if (username && userId) {
    throw new Error("Only one of username or userId should be provided.");
  }

  //audio call functionality
  const [users , setusers] = useState<User[]>([])
  const [ muted, setMuted] = useState(false);


  const localStreamRef = useRef<HTMLAudioElement | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<{[socketId: string]: MediaStream}>({});
  const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection}>({});
  const socketRef = useRef<Socket | null >(null);

  const config: RTCConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302" // stun server
      },
    ],
  };

  useEffect(() => {
    const socket = io("http://localhost:9000");
    socketRef.current = socket;

    socket.emit("join-room", { roomId, userId, username });

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-left", handleUserLeft);

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      socket.disconnect();
    };

  },[roomId, userId, username])


  const handleUserJoined = async(newUser: User) => {
    setusers((prev) => [...prev, newUser]);
    const PeerConnection = new RTCPeerConnection(config);
    peerConnections.current[newUser.socketId] = PeerConnection;

    const stream = await getLocalStream();
    stream.getTracks().forEach((track) => PeerConnection.addTrack(track, stream));

    PeerConnection.onicecandidate = (event) => {
      if(event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
          sender: socketRef.current.id,
        });
      }
    };

    PeerConnection.ontrack = (event) => {
      const [ stream ] = event.streams;
      remoteStream.current[newUser.socketId] = stream;
      updateRemoteStreams();
    };

    const offer = await PeerConnection.createOffer();
    await PeerConnection.setLocalDescription(offer);

    if (socketRef.current) {
      socketRef.current.emit("offer", {
        roomId,
        offer,
        sender: socketRef.current.id,
        receiver: newUser.socketId,
      });
    }
  }



  const handleOffer = async ({ offer, sender }: { offer: RTCSessionDescriptionInit; sender: string }) => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections.current[sender] = peerConnection;

    const stream = await getLocalStream();
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
          sender: socketRef.current.id,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      remoteStream.current[sender] = stream;
      updateRemoteStreams();
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (socketRef.current) {
      socketRef.current.emit("answer", { roomId, answer, sender: socketRef.current.id });
    }
  };



  const handleAnswer = async ({ answer, sender }: { answer: RTCSessionDescriptionInit; sender: string }) => {
    const peerConnection = peerConnections.current[sender];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };



  const handleIceCandidate = async ({ candidate, sender }: { candidate: RTCIceCandidate; sender: string }) => {
    const peerConnection = peerConnections.current[sender];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };



  const handleUserLeft = ({ socketId }: { socketId: string }) => {
    setusers((prev) => prev.filter((user) => user.socketId !== socketId));
    const peerConnection = peerConnections.current[socketId];
    if (peerConnection) {
      peerConnection.close();
      delete peerConnections.current[socketId];
    }

    delete remoteStream.current[socketId];
    updateRemoteStreams();
  };



  const getLocalStream = async (): Promise<MediaStream> => {
    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    return localStream.current;
  };



  const updateRemoteStreams = () => {
    const combinedStream = new MediaStream();
    Object.values(remoteStream.current).forEach((stream) => {
      stream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
    });

    if (localStreamRef.current) {
      localStreamRef.current.srcObject = combinedStream;
    }
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMuted((prev) => !prev);
    }
  };


  return (
    <div>
    <h1>Audio Call Room: {roomId}</h1>
    <audio ref={localStreamRef} autoPlay />
    <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
    <div>
      <h2>Users in Room</h2>
      <ul>
        {users.map((user) => (
          <li key={user.socketId}>{user.username}</li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default AudioCall