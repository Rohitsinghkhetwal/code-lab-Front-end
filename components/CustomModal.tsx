import { useState } from 'react';
import toast from 'react-hot-toast';

interface RoomIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomId: string) => void;
}

const RoomIdModal: React.FC<RoomIdModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [roomId, setRoomId] = useState<string>("");

  const handleSubmit = () => {
    if (roomId) {
      onSubmit(roomId);
      onClose(); 
    } else {
      toast.error("Room ID is required to join the room.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4">
        {/* Modal title */}
        <h3 className="text-2xl font-semibold text-gray-800">Enter Room ID</h3>

        {/* Room ID Input */}
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Buttons container */}
        <div className="flex justify-between">
          {/* Join Room button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Join Room
          </button>

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomIdModal;
