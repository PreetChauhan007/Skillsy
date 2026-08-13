import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Chat = () => {
  const { swapId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState('');
  const bottomRef = useRef(null);

  const addMessage = (message) => {
    if (!message?._id) return;
    setMessages((current) => current.some((item) => item?._id === message._id) ? current : [...current, message]);
  };

  const loadConversation = async (showError = false) => {
    if (!swapId) {
      setLoadError('This chat link is invalid.');
      setLoading(false);
      return;
    }
    try {
      const response = await chatAPI.getConversation(swapId);
      setMessages(Array.isArray(response.data?.data?.messages) ? response.data.data.messages : []);
      setLoadError('');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load chat. Please try again.';
      setLoadError(message);
      if (showError) toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    let refreshTimer;
    const refreshConversation = async (showError) => {
      if (!active) return;
      await loadConversation(showError);
      if (active) refreshTimer = window.setTimeout(() => refreshConversation(false), 4000);
    };
    refreshConversation(true);
    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
    };
  }, [swapId]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim() || sending) return;
    const content = text.trim();
    setSending(true);
    try {
      const response = await chatAPI.sendMessage(swapId, content);
      addMessage(response.data?.data);
      setText('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Message could not be sent');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading chat...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6">
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
        <div className="flex items-center gap-3 border-b border-neutral-800 p-4">
          <Link to="/swaps" className="text-neutral-400 hover:text-white" aria-label="Back to swaps"><ArrowLeft /></Link>
          <div><h1 className="font-bold text-white">Swap chat</h1><p className="text-sm text-emerald-400">Plan your skill exchange safely.</p></div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {loadError && <div className="rounded-xl border border-amber-700 bg-amber-950/40 p-3 text-sm text-amber-200">{loadError}</div>}
          {messages.length === 0 && !loadError && <p className="py-10 text-center text-neutral-400">Start the conversation. You can share your email, phone number, or meeting link here.</p>}
          {messages.filter(Boolean).map((message) => {
            const mine = String(message.sender?._id || message.sender) === String(user?._id || user?.id);
            return <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 ${mine ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-100'}`}>
              {!mine && <p className="mb-1 text-xs font-semibold text-emerald-400">{message.sender?.name || 'Swap partner'}</p>}
              <p className="whitespace-pre-wrap break-words">{message.content}</p><p className={`mt-1 text-right text-xs ${mine ? 'text-emerald-100' : 'text-neutral-500'}`}>{formatTime(message.createdAt)}</p>
            </div></div>;
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3 border-t border-neutral-800 p-4">
          <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={2000} rows={1} placeholder="Write a message or share contact details..." className="flex-1 resize-none rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none focus:border-emerald-500" />
          <button disabled={!text.trim() || sending || Boolean(loadError)} className="rounded-xl bg-emerald-600 px-4 text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message"><Send size={20} /></button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
