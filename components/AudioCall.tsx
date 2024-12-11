import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { FaPhoneAlt } from "react-icons/fa";
import useStore from "@/Store/Store";

type RemoteStreams = {
  [socketId: string]: MediaStream;
};

type PeerConnections = {
  [socketId: string]: RTCPeerConnection;
};

const AudioCall: React.FC = () => {
  const { users, roomLink, joinedUser, fetchJoinedUser, removeUser } = useStore();

  const userId = users[0]?.user?._id;
  const username = null;
  const name = users[0]?.user?.username;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreams>({});
  const peerConnections = useRef<PeerConnections>({});
  const socket = useRef<Socket | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!roomLink) {
      console.error("Room ID is required to join a call.");
      return;
    }

    socket.current = io("https://codelab-backend-mx5k.onrender.com"); // Replace with your backend URL

    const captureAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.error("Error accessing audio stream", error);
      }
    };

    captureAudio();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
    };
  }, [roomLink]);

  // Handle Socket Events
  useEffect(() => {
    if (!socket.current || !localStream) return;

    // Join the room
    socket.current.emit("join-room", { roomLink, username, userId });

    // When a user joins
    socket.current.on("user-Joined", async({ socketId }: { socketId: string }) => {
      fetchJoinedUser(roomLink);

      if (!peerConnections.current[socketId]) {
        const peerConnection = createPeerConnection(socketId);
        peerConnections.current[socketId] = peerConnection;

        try {
          if (peerConnection.signalingState === "stable") {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
    
            socket.current?.emit("offer", {
              roomLink,
              offer,
              sender: socket.current.id,
            });
          } else {
            console.warn("Signaling state not stable:", peerConnection.signalingState);
          }
        } catch (error) {
          console.error("Error creating or sending offer:", error);
        }
      
      }
    });

    // Handle received offer
    socket.current.on(
      "offer",
      async ({
        offer,
        sender,
      }: {
        offer: RTCSessionDescriptionInit;
        sender: string;
      }) => {
        if (!peerConnections.current[sender]) {
          const peerConnection = createPeerConnection(sender);
          peerConnections.current[sender] = peerConnection;
        }

        const peerConnection = peerConnections.current[sender];

        if (!localStream) {
          console.error("Local stream is not initialized");
          return;
        }

        if (peerConnection.signalingState !== "stable") {
          console.warn(
            "Unexpected signaling state",
            peerConnection.signalingState
          );
          return;
        }

        try {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socket.current?.emit("answer", {
            roomLink,
            answer,
            sender: socket.current.id,
          });
        } catch (error) {
          console.error("Error handling offer", error);
        }
      }
    );

    // Handle received answer
    socket.current.on(
      "answer",
      async ({
        answer,
        sender,
      }: {
        answer: RTCSessionDescriptionInit;
        sender: string;
      }) => {
        const peerConnection = peerConnections.current[sender];
        if (
          peerConnection &&
          peerConnection.signalingState === "have-local-offer"
        ) {
          try {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } catch (error) {
            console.error("Error setting remote description for answer", error);
          }
        }
      }
    );

    // Handle ICE candidates
    socket.current.on(
      "ice-candidate",
      async ({
        candidate,
        sender,
      }: {
        candidate: RTCIceCandidateInit;
        sender: string;
      }) => {
        const peerConnection = peerConnections.current[sender];
        if (peerConnection) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error("Error adding received ICE candidate", error);
          }
        }
      }
    );

    // Handle user disconnection
    socket.current.on("user-left", ({ socketId }: { socketId: string }) => {
      removeUser(name);
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
      }
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
    });

    return () => {
      socket.current?.off("user-Joined");
      socket.current?.off("offer");
      socket.current?.off("answer");
      socket.current?.off("ice-candidate");
      socket.current?.off("user-left");
    };
  }, [localStream]);

  // Create a PeerConnection
  const createPeerConnection = (socketId: string): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection();

    if (!localStream) {
      console.error("Local stream is not initialized");
      return peerConnection;
    }


    // Add local stream tracks to the connection
    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Handle remote tracks
    peerConnection.ontrack = (event) => {
      setRemoteStreams((prev) => {
        const newStream = prev[socketId] || new MediaStream();

        event.streams[0].getTracks().forEach((track) => {
          if (!newStream.getTracks().includes(track)) {
            newStream.addTrack(track);
          }
        });

        let audioElement = document.getElementById(`audio-${socketId}`) as HTMLAudioElement

        if(!audioElement) {
          audioElement = document.createElement("audio");
          audioElement.id = `audio-${socketId}`
          audioElement.autoplay = true;
          document.body.appendChild(audioElement)
        }
        audioElement.srcObject = newStream

        return { ...prev, [socketId]: newStream };
      });
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit("ice-candidate", {
          roomLink,
          candidate: event.candidate,
          sender: socket.current?.id,
        });
      }
    };

    return peerConnection;
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center text-slate-500 my-4">Voice Call</h1>
      <div className="flex items-center justify-center space-x-4 mb-4">
      <button
        className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md focus:outline-none"
      >
        <FaPhoneAlt className="text-lg" />
      </button>
      <button
        onClick={toggleMute}
        className={`px-4 py-2 rounded-lg text-white font-bold transition duration-300 ${
          isMuted ? "bg-red-400 hover:bg-red-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>



      </div>


      {joinedUser.length > 0 && (
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
      )}
    </div>
  );
};

export default AudioCall;
