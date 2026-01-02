'use client';

import { useState } from 'react';
import ChatRoomList from '@/app/components/ChatRoomList';
import ChatRoom from '@/app/components/ChatRoom';

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState('');

  const handleSelectRoom = (roomId, roomName) => {
    setSelectedRoom(roomId);
    setSelectedRoomName(roomName);
  };

  const handleBack = () => {
    setSelectedRoom(null);
    setSelectedRoomName('');
  };

  return (
    <>
      {selectedRoom ? (
        <ChatRoom
          roomId={selectedRoom}
          roomName={selectedRoomName}
          onBackClick={handleBack}
        />
      ) : (
        <ChatRoomList onSelectRoom={handleSelectRoom} />
      )}
    </>
  );
}
