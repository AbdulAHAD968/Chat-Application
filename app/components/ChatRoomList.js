'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { FiSearch, FiPlus } from 'react-icons/fi';

export default function ChatRoomList({ onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'chatRooms'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRooms = [];
      snapshot.forEach((doc) => {
        newRooms.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setRooms(newRooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = rooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [rooms, searchQuery]);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      await addDoc(collection(db, 'chatRooms'), {
        name: newRoomName,
        createdAt: serverTimestamp(),
      });
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Google Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center">
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Advertising</a>
          <a href="#" className="hover:underline">Business</a>
        </div>
        <div className="flex gap-4 items-center text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:underline">Settings</a>
          <a href="#" className="hover:underline">Sign in</a>
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
            ☰
          </button>
        </div>
      </div>

      {/* Main Content - Top Section */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8">
        {/* Logo/Title - Google Style */}
        <div className="mb-8 mt-12">
          <h1 className="text-9xl font-light tracking-tight">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </h1>
        </div>

        {/* Search/Create Section */}
        <div className="w-full max-w-3xl mb-8">
          {/* Search Bar - Google Style */}
          <div className="relative mb-6">
            <div className="flex items-center gap-3 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900 hover:shadow-lg transition shadow-sm hover:border-gray-400 dark:hover:border-gray-500">
              <FiSearch className="text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Recent Searchs..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base"
              />              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">🎤</button>            </div>
          </div>

          {/* Action Buttons - Google Style */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const query = searchQuery || 'Google';
                window.location.href = `https://www.google.com`;
              }}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium text-sm border border-gray-200 dark:border-gray-700"
            >
              Google Search
            </button>
            <button
              onClick={async () => {
                const roomName = prompt('Enter room name:');
                if (roomName && roomName.trim()) {
                  try {
                    await addDoc(collection(db, 'chatRooms'), {
                      name: roomName,
                      createdAt: serverTimestamp(),
                    });
                  } catch (error) {
                    console.error('Error creating room:', error);
                  }
                }
              }}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium text-sm border border-gray-200 dark:border-gray-700"
            >
              I'm Feeling Lucky
            </button>
          </div>
        </div>

        {/* Featured Articles/Images Section - Google Style */}
        {!searchQuery && (
          <div className="w-full py-12">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 text-center">Featured</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {[
                { title: 'Latest Tech News', color: 'from-blue-400 to-blue-600' },
                { title: 'Gaming Updates', color: 'from-purple-400 to-purple-600' },
                { title: 'Entertainment', color: 'from-pink-400 to-pink-600' },
                { title: 'Sports Highlights', color: 'from-orange-400 to-orange-600' },
                { title: 'Travel & Culture', color: 'from-emerald-400 to-emerald-600' },
                { title: 'Business & Finance', color: 'from-indigo-400 to-indigo-600' },
              ].map((article, idx) => (
                <div
                  key={idx}
                  className={`relative h-40 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer bg-gradient-to-br ${article.color}`}
                >
                  <div className="absolute inset-0 flex items-end justify-start p-4">
                    <h3 className="text-white font-semibold text-lg">{article.title}</h3>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Searchs Section - Buried Deep */}
      <div className="w-full bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recent Searches</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">See Recent Searches with no sign-in required</p>

          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading searches...
            </div>
          ) : filteredRooms.length === 0 && searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 text-base">
                No rooms found for "<strong>{searchQuery}</strong>"
              </p>
            </div>
          ) : filteredRooms.length === 0 && !searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 text-base mb-2">
                No Recent Searchs yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id, room.name)}
                  className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition group border-l-4 border-transparent hover:border-blue-500 bg-white dark:bg-gray-900"
                >
                  <h3 className="text-lg text-blue-600 dark:text-blue-400 group-hover:underline truncate font-medium">
                    {room.name}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    chatrooms • {room.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Join this chat room and start messaging with others. No sign-up required.
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Google Style */}
      <div className="bg-gray-f9f9f9 dark:bg-gray-800 border-t border-gray-e8e8e8 dark:border-gray-700 px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-70 dark:text-gray-400 max-w-7xl mx-auto">
          <div className="flex gap-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Advertising</a>
            <a href="#" className="hover:underline">Business</a>
            <a href="#" className="hover:underline">How Search works</a>
          </div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Settings</a>
          </div>
        </div>
      </div>
    </div>
  );
}
