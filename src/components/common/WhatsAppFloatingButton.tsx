import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { TEACHER_INFO } from '../../data/mockData';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickMessages = [
    "Hello Sir, I want to enroll in 2025 A/L Theory batch.",
    "Could you send me details about the Speed Paper Class?",
    "How can I receive the monthly printed tutes to my home?",
    "I need help with my Student Portal login."
  ];

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message || "Hello Sir, I'd like more information about your classes.";
    const cleanNumber = TEACHER_INFO.contact.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-200 dark:border-blue-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Connect with Sir's Team</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Typically replies in 5 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick presets */}
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a quick question or write your message:
            </p>

            <div className="space-y-1.5">
              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(msg)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{msg}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button with Pulsing Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer border border-white/20"
        title="Connect with Sir's Official Desk"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="font-sans font-bold tracking-wide">
          Connect
        </span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
      </button>
    </div>
  );
};
