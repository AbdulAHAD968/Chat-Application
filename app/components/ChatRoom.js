'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { FiSend, FiImage, FiX } from 'react-icons/fi';

export default function ChatRoom({ roomId, roomName, onBackClick }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameSet, setUserNameSet] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setUserNameSet(true);
    }
  }, []);

  useEffect(() => {
    if (!userNameSet || !roomId) return;

    const q = query(
      collection(db, 'chatRooms', roomId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        });
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId, userNameSet]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let item of items) {
        if (item.type.indexOf('image') > -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
            setImagePreview(base64);
            setImageBase64(base64);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSetUserName = () => {
    if (userName.trim()) {
      localStorage.setItem('userName', userName);
      setUserNameSet(true);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImagePreview(base64);
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() && !imageBase64) return;

    try {
      setUploading(true);
      const messageData = {
        text: inputValue,
        userName,
        timestamp: serverTimestamp(),
      };

      if (imageBase64) {
        messageData.imageData = imageBase64;
      }

      if (replyingTo) {
        messageData.replyTo = {
          id: replyingTo.id,
          userName: replyingTo.userName,
          text: replyingTo.text?.substring(0, 50),
        };
      }

      await addDoc(
        collection(db, 'chatRooms', roomId, 'messages'),
        messageData
      );
      setInputValue('');
      setImagePreview(null);
      setImageBase64(null);
      setReplyingTo(null);
      setUploading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setUploading(false);
    }
  };

  const handleSendWithImage = async () => {
    await sendMessage();
  };

  if (!userNameSet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Welcome to Chat
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSetUserName()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white"
          autoFocus
        />
        <button
          onClick={handleSetUserName}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
      {/* Messenger Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {roomName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userName}
            </p>
          </div>
        </div>
        <button
          onClick={onBackClick}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Exit
        </button>
      </div>

      {/* Messages Area - Messenger Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
            <div>
              <div className="text-5xl mb-3">
                <span>💬</span>
              </div>
              <p className="text-base font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.userName === userName ? 'justify-end' : 'justify-start'
              } items-end gap-2 group`}
            >
              {msg.userName !== userName && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {msg.userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 relative ${
                  msg.userName === userName
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700'
                }`}
              >
                {msg.replyTo && (
                  <div
                    className={`text-xs mb-2 pb-2 border-l-2 pl-2 ${
                      msg.userName === userName
                        ? 'border-blue-300 text-blue-100'
                        : 'border-gray-400 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <p className="font-semibold">{msg.replyTo.userName}</p>
                    <p className="truncate">{msg.replyTo.text}</p>
                  </div>
                )}
                {msg.userName !== userName && (
                  <p className="text-xs font-bold opacity-75 mb-1">
                    {msg.userName}
                  </p>
                )}
                {msg.text && <p className="break-words text-sm leading-relaxed">{msg.text}</p>}
                {msg.imageData && (
                  <img
                    src={msg.imageData}
                    alt="shared"
                    className="max-w-full rounded-xl mt-2 max-h-64 cursor-pointer hover:opacity-90"
                  />
                )}
                <span
                  className={`text-xs opacity-70 mt-1 block ${
                    msg.userName === userName
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {msg.userName !== userName && (
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className={`absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition text-sm px-2 py-1 rounded ${
                      msg.userName === userName
                        ? 'text-blue-500'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    ↩
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-3">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="max-h-20 rounded-lg" />
            <button
              onClick={() => {
                setImagePreview(null);
                fileInputRef.current.value = '';
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
            >
              <FiX size={14} />
            </button>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Ready to send</span>
        </div>
      )}

      {/* Reply Preview */}
      {replyingTo && (
        <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold">Replying to {replyingTo.userName}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{replyingTo.text?.substring(0, 50)}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Messenger Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition disabled:opacity-50 text-gray-600 dark:text-gray-400"
          title="Attach image"
        >
          <FiImage size={20} />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendWithImage();
            }
          }}
          onPaste={handlePaste}
          placeholder="Aa"
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={uploading}
        />
        <button
          onClick={handleSendWithImage}
          disabled={(!inputValue.trim() && !imagePreview) || uploading}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}
