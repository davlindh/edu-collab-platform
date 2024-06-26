import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const Chat = ({ contentId }) => {
  const [message, setMessage] = useState('');
  const messagesRef = collection(db, 'messages');
  const [q, setQ] = useState(query(messagesRef, orderBy('createdAt')));

  useEffect(() => {
    setQ(query(messagesRef, orderBy('createdAt')));
  }, [contentId]);
  const [messages] = useCollectionData(q, {
    idField: 'id',
    refField: 'ref',
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, displayName } = auth.currentUser;
    await addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      uid,
      displayName,
      contentId,
    });
    setMessage('');
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages && messages.map(msg => (
          <div key={msg.id} className={`message ${msg.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
            <p><strong>{msg.displayName}</strong>: {msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;