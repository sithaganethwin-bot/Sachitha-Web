import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Video,
  Mic,
  MicOff,
  Hand,
  Send,
  Users,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle?: string;
  batchName?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isTeacher?: boolean;
}

export const LiveZoomModal: React.FC<LiveZoomModalProps> = ({
  isOpen,
  onClose,
  sessionTitle = "Business Studies – Foundations Masterclass",
  batchName = "2027 A/L Theory",
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Sachitha Sir', text: 'Good morning everyone! Please have your Unit 01 Business Environment mind map open.', time: '08:02 AM', isTeacher: true },
    { id: '2', sender: 'Dineth Mendis', text: 'Sir, horizontal integration example ekada apply karanna oni?', time: '08:04 AM' },
    { id: '3', sender: 'Kavindu Perera', text: 'Mind map concept crystal clear sir!', time: '08:05 AM' },
    { id: '4', sender: 'Senuri Jayathilaka', text: 'Part II structured answer format clear sir!', time: '08:07 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participantCount, setParticipantCount] = useState(864);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setParticipantCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You (Student)',
      text: chatInput,
      time: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulated quick teacher or moderator acknowledgement
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'Class Coordinator',
          text: 'Thank you! Sir will address this question at the end of the step.',
          time: 'Just now',
          isTeacher: true
        }
      ]);
    }, 1500);
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    if (!isHandRaised) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-[#090d16] border border-blue-900/80 shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Control Bar */}
        <div className="h-14 px-4 sm:px-6 bg-[#0c1220] border-b border-blue-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm truncate max-w-[200px] sm:max-w-md">
                {sessionTitle}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-cyan-300 border border-blue-700/50">
                {batchName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{participantCount} Students Online</span>
            </div>

            <a
              href="https://zoom.us"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-cyan-300"
            >
              <span>Launch Desktop Zoom</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Classroom Body (Main Stage + Live Chat) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main Stage (Simulated Digital Smartboard) */}
          <div className="lg:col-span-8 bg-black relative flex flex-col justify-between p-6 overflow-hidden">
            {/* Background Grid Pattern simulating interactive board */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Smartboard Drawing / Derivation Content */}
            <div className="relative z-10 space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                
                <span>Live Interactive Smartboard • 1080p HD</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-900/60 font-mono text-xs sm:text-sm text-cyan-200 space-y-2 shadow-2xl backdrop-blur-md">
                <div className="text-slate-400">// Theorem: Integration by Parts</div>
                <div className="text-amber-300 font-bold">∫ u (dv/dx) dx = u·v - ∫ v (du/dx) dx</div>
                <div className="text-slate-300 pt-2">
                  Let u = x², dv/dx = e^(2x)
                </div>
                <div className="text-emerald-400">
                  du/dx = 2x,  v = ½ e^(2x)
                </div>
                <div className="text-cyan-300 font-bold pt-1">
                  =&gt; ½ x² e^(2x) - ∫ x e^(2x) dx + C
                </div>
              </div>
            </div>

            {/* Presenter Picture-in-Picture Webcam */}
            <div className="absolute top-4 right-4 w-32 sm:w-44 aspect-4/3 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-2xl bg-slate-900 z-20">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                alt="Sachitha Sankalpa"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-1.5 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white">
                Sachitha Sankalpa (Host)
              </div>
            </div>

            {/* In-Meeting Controls Bar */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 border border-blue-950/80 rounded-2xl p-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRaiseHand}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isHandRaised
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{isHandRaised ? 'Hand Raised!' : 'Raise Hand'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>End-to-End Encrypted Session</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Class Chat */}
          <div className="lg:col-span-4 bg-[#0a0f1d] border-l border-blue-950/80 flex flex-col justify-between h-full">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-blue-950/80 flex items-center gap-2 text-xs font-bold text-slate-200">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Student Live Q&A Stream</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[50vh] lg:max-h-none">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl text-xs ${
                    msg.isTeacher
                      ? 'bg-blue-950/80 border border-blue-700/60 text-blue-100'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-cyan-300">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Send Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-blue-950/80 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Sir a question in class..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
