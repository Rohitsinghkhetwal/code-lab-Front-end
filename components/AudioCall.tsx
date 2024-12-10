"use client";

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

  console.log("this is the userId AUDIOCALL",userId);
  console.log("this is the room USERID" , roomId);
  const {
    setLocalStream,
    joinedUser,
    addUser,
    removeUser,
  } = useStore();

  if (!username && !userId) {
    throw new Error("Either username or userId must be provided.");
  }
  if (username && userId) {
    throw new Error("Only one of username or userId should be provided.");
  }


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
    const socket = io("https://codelab-backend-mx5k.onrender.com");
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
    addUser(newUser.socketId);
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
    const peerConnection =
      peerConnections.current[sender] || new RTCPeerConnection(config);
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

    try {
      if(peerConnection.signalingState !== "have-local-offer") {
        console.log("cannot set remote description in signailing state", peerConnection.signalingState)

      }
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      if (socketRef.current) {
        socketRef.current.emit("answer", {
          roomId,
          answer,
          sender: socketRef.current.id,
        });
      }
    } catch (err) {
      console.log("Error handling offer", err);
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
    removeUser(socketId);
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
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStream.current = stream;
        setLocalStream(stream);
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

  return (
    <div className="flex flex-col items-center h-screens p-4">
      <h1 className="text-xs font-bold text-gray-800 mb-3">
        Room: <span className="text-indigo-500">{roomId}</span>
      </h1>

      <div className="mb-2">
        <audio
          ref={localStreamRef}
          autoPlay
          className="border border-gray-300 rounded-md shadow-md w-64"
        />
      </div>

      <div className="flex justify-center items-center bg-gray-100">
        <div className="w-50 p-6 bg-white shadow-lg rounded-lg bg-red-200">
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
      {
        joinedUser.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-4  mx-auto my-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Joined User</h2>
          <ul>
            {joinedUser.map((user: string, ind: number) => (
              <li
                key={ind}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100"
              >
                <span className="text-gray-700 font-medium">{user}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-5 h-5 text-gray-600"
                >
                  <path d="M8 11a3 3 0 0 0 3-3V4a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3zm4-3a4 4 0 0 1-8 0H3a5 5 0 0 0 10 0h-1zm-4 4a5.001 5.001 0 0 0 4.546-2.914c.178.25.285.57.285.914v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1c0-.345.107-.664.285-.914A5.001 5.001 0 0 0 8 12zm1 3a1 1 0 0 1-2 0h2z" />
                </svg>
              </li>
            ))}
          </ul>
        </div>


        )
      }

     
    </div>
  );
};

export default AudioCall;
