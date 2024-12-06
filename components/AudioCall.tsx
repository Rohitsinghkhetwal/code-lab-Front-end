import { getRoomDetail } from "@/app/(root)/api/room";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useStore from "@/Store/Store";

interface User {
  userId: string | null;
  username: string | null;
  socketId: string;
}

interface AudioCallProps {
  roomId: string;
  userId: string | null;
  username: string | null;
}

const AudioCall: React.FC<AudioCallProps> = ({ roomId, userId, username }) => {
  const { roomLink } = useStore();

  if (!username && !userId) {
    throw new Error("Either username or userId must be provided.");
  }
  if (username && userId) {
    throw new Error("Only one of username or userId should be provided.");
  }

  //audio call functionality
  const [users, setusers] = useState<User[]>([]);
  const [muted, setMuted] = useState(false);

  const localStreamRef = useRef<HTMLAudioElement | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<{ [socketId: string]: MediaStream }>({});
  const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const socketRef = useRef<Socket | null>(null);

  const config: RTCConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302", // stun server
      },
    ],
  };

  useEffect(() => {
    const socket = io("http://localhost:9000");
    socketRef.current = socket;

    socket.emit("join-room", { roomId, userId, username });

    socket.on("user-Joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-left", handleUserLeft);

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      socket.disconnect();
    };
  }, [roomId, userId, username]);

  const handleUserJoined = async (newUser: User) => {
    setusers((prev) => [...prev, newUser]);
    const PeerConnection = new RTCPeerConnection(config);
    peerConnections.current[newUser.socketId] = PeerConnection;

    const stream = await getLocalStream();
    stream
      .getTracks()
      .forEach((track) => PeerConnection.addTrack(track, stream));

    PeerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
          sender: socketRef.current.id,
        });
      }
    };

    PeerConnection.ontrack = (event) => {
      const [stream] = event.streams;
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
  };

  const handleOffer = async ({
    offer,
    sender,
  }: {
    offer: RTCSessionDescriptionInit;
    sender: string;
  }) => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections.current[sender] = peerConnection;

    const stream = await getLocalStream();
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

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
      socketRef.current.emit("answer", {
        roomId,
        answer,
        sender: socketRef.current.id,
      });
    }
  };

  const handleAnswer = async ({
    answer,
    sender,
  }: {
    answer: RTCSessionDescriptionInit;
    sender: string;
  }) => {
    const peerConnection = peerConnections.current[sender];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  };

  const handleIceCandidate = async ({
    candidate,
    sender,
  }: {
    candidate: RTCIceCandidate;
    sender: string;
  }) => {
    const peerConnection = peerConnections.current[sender];
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.log("failed to add peer connection ", err);
      }
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
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (err) {
        console.log("error accessing microphone", err);
        throw new Error("Could not access microphone");
      }
    }
    return localStream.current;
  };

  const updateRemoteStreams = () => {
    const combinedStream = new MediaStream();
    Object.values(remoteStream.current).forEach((stream) => {
      stream
        .getAudioTracks()
        .forEach((track) => combinedStream.addTrack(track));
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

  // const getUser = async () => {
  //   try {
  //     const room = "9zy7qlJrgmeeZaPTrU8CM0D4E8R8EpFi6PIG2mBh";
  //     const roomDetail = await getRoomDetail(room);
  //     const response = roomDetail.users;
  //     setResult(response);
  //   } catch (err) {
  //     console.log("something went wrong ", err);
  //   }
  // };

  return (
    <div className="flex flex-col items-center h-screens p-4">
      {/* Room Title */}
      <h1 className="text-xs font-bold text-gray-800 mb-3">
        Room: <span className="text-indigo-500">{roomId}</span>
      </h1>

      {/* Audio Player */}
      <div className="mb-2">
        <audio
          ref={localStreamRef}
          autoPlay
          className="border border-gray-300 rounded-md shadow-md w-64"
        />
      </div>

      {/* Mute/Unmute Button */}

      {/* Users in Room */}
      <div className="flex justify-center items-center bg-gray-100">
        <div className="w-80 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10l4.553-4.553a2 2 0 012.829 0L23 7.174a2 2 0 010 2.829L18.447 14M5.342 14l-.342.342a2 2 0 000 2.828l2.828 2.828a2 2 0 002.829 0l.343-.343m3.182-8.487L14 9.174a2 2 0 01.828-.828m-.828.828L9.553 14.553a2 2 0 01-2.829 0l-.343-.343m.828-.828L3.447 10.447a2 2 0 010-2.829l2.828-2.828a2 2 0 012.829 0L10 5.342"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-xl font-semibold text-gray-800">
            Audio Call
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Connect with others seamlessly.
          </p>
          <div className="flex justify-center items-center">
          <button
            onClick={toggleMute}
            className={`text-center px-6 py-2 text-white font-semibold rounded-md transition-all ${
              muted
                ? "bg-red-500 hover:bg-red-300"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
