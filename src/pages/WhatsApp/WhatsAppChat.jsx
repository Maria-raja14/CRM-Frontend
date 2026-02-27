import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { sendWhatsAppMessage, getMessageHistory } from '../../services/whatsapp.service';
import { toast } from 'react-toastify';
import './WhatsAppChat.css';

const WhatsAppChat = () => {
  const [contacts] = useState([
    { id: 1, name: 'John Doe', phone: '+919535542288', lastMessage: 'Your appointment is confirmed', time: '10:30 AM', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', phone: '+919876543210', lastMessage: 'Please send the proposal', time: 'Yesterday', avatar: 'JS' },
  ]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const templates = [
    { id: 1, name: 'Appointment Reminder', vars: { "1": "12/1", "2": "3pm" } },
    { id: 2, name: 'Follow Up', vars: { "1": "Meeting", "2": "tomorrow" } },
  ];

  useEffect(() => {
    if (selectedContact) {
      loadMessageHistory(selectedContact.phone);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessageHistory = async (phone) => {
    try {
      const response = await getMessageHistory(phone);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      toast.error('Failed to load message history');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    setLoading(true);
    try {
      // For demo, using template variables
      const contentVariables = {
        "1": newMessage,
        "2": "now"
      };

      const response = await sendWhatsAppMessage({
        phoneNumber: selectedContact.phone,
        contentVariables,
        leadId: selectedContact.leadId
      });

      if (response.success) {
        // Add message to UI
        const newMsg = {
          _id: Date.now().toString(),
          body: response.data.body,
          direction: 'outbound',
          status: 'sent',
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [newMsg, ...prev]);
        setNewMessage('');
        toast.success('Message sent!');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template) => {
    // Pre-fill with template variables
    setNewMessage(`Appointment on ${template.vars["1"]} at ${template.vars["2"]}`);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="whatsapp-container">
      {/* Contacts Sidebar */}
      <div className="contacts-sidebar">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">WhatsApp Chats</h2>
          <div className="template-buttons mt-3">
            {templates.map(template => (
              <button
                key={template.id}
                className="template-btn"
                onClick={() => handleTemplateClick(template)}
                disabled={!selectedContact}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="contact-avatar">{contact.avatar}</div>
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.lastMessage}</p>
              </div>
              <span className="last-message-time">{contact.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact ? (
        <div className="chat-area">
          <div className="chat-header">
            <div className="contact-avatar">{selectedContact.avatar}</div>
            <div className="chat-header-info">
              <h3>{selectedContact.name}</h3>
              <p>{selectedContact.phone}</p>
            </div>
            <div className="ml-auto flex gap-3">
              <Phone size={20} className="text-gray-600 cursor-pointer" />
              <Video size={20} className="text-gray-600 cursor-pointer" />
              <MoreVertical size={20} className="text-gray-600 cursor-pointer" />
            </div>
          </div>

          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-bubble ${msg.direction === 'outbound' ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <div>{msg.body}</div>
                  <div className="message-time">
                    {formatTime(msg.createdAt)}
                    {msg.direction === 'outbound' && (
                      <span className="message-status">
                        {msg.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-area">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="no-chat-selected">
          <p>Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;



