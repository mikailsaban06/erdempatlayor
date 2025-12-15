import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, ShieldAlert, Trash2, Ban, Image as ImageIcon, X, Clock, AlertTriangle } from 'lucide-react';
import { ChatMessage, Group, GroupRole } from '../types';
import { CommunityStore, CURRENT_USER, hasPermission } from '../utils/communityStore';

interface ChatInterfaceProps {
    group: Group;
    currentUserRole?: GroupRole;
}

const RoleBadge = ({ role }: { role: GroupRole }) => {
    switch (role) {
        case 'OWNER': return <Shield size={12} className="text-amber-500" fill="currentColor" />;
        case 'MODERATOR': return <Shield size={12} className="text-emerald-500" fill="currentColor" />;
        case 'HELPER': return <ShieldAlert size={12} className="text-blue-500" />;
        default: return null;
    }
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ group, currentUserRole }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // UI State
    const [lastSentTime, setLastSentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [muteEndTime, setMuteEndTime] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Initial Load & Polling
    useEffect(() => {
        const loadMessages = () => {
            const msgs = CommunityStore.getMessages(group.id);
            setMessages(prev => {
                if (msgs.length !== prev.length || (msgs.length > 0 && msgs[msgs.length - 1].id !== prev[prev.length - 1]?.id)) {
                    return msgs;
                }
                return prev;
            });
        };

        loadMessages();
        const interval = setInterval(loadMessages, 2000);
        return () => clearInterval(interval);
    }, [group.id]);

    // Check Muted Status
    useEffect(() => {
        const member = group.members.find(m => m.userId === CURRENT_USER.id);
        if (member && member.mutedUntil && member.mutedUntil > Date.now()) {
            setIsMuted(true);
            setMuteEndTime(member.mutedUntil);
        } else {
            setIsMuted(false);
        }
    }, [group.members]); // Re-check if group members list updates

    // Auto-scroll
    useEffect(() => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            
            if (isNearBottom || messages.length <= 5) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrorMsg(null);

        // 1. Mute Check
        if (isMuted) {
            setErrorMsg(`You are muted until ${new Date(muteEndTime).toLocaleTimeString()}`);
            return;
        }

        // 2. Rate Limit (2 seconds)
        if (Date.now() - lastSentTime < 2000) {
            setErrorMsg("Slow down! You are sending messages too fast.");
            return;
        }

        const result = imagePreview 
            ? CommunityStore.sendMessage(group.id, inputValue || 'Sent an image', 'image', imagePreview)
            : inputValue.trim() 
                ? CommunityStore.sendMessage(group.id, inputValue.trim(), 'text')
                : null;

        if (result) {
            setLastSentTime(Date.now());
            setImagePreview(null);
            setInputValue('');
            // Optimistic update
            setMessages(prev => [...prev, result]);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        } else if (!inputValue.trim() && !imagePreview) {
            // Empty
        } else {
            // Failed (likely muted on server side check if local check failed)
            setErrorMsg("Failed to send. You might be muted.");
        }
    };

    const handleDelete = (msgId: string) => {
        CommunityStore.deleteMessage(group.id, msgId);
        setMessages(prev => prev.filter(m => m.id !== msgId));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert("Image too large. Please select an image under 1MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Permissions
    const role = currentUserRole || 'MEMBER';
    const canDelete = hasPermission(role, 'delete_msg');
    const canUpload = hasPermission(role, 'upload_image');

    return (
        <div className="flex flex-col h-[600px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center backdrop-blur-sm z-10">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        #{group.slug}
                        <span className="text-xs font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                             {group.members.length} members
                        </span>
                    </h3>
                </div>
            </div>

            {/* Error Toast */}
            {errorMsg && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg z-20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle size={16} /> {errorMsg}
                    <button onClick={() => setErrorMsg(null)} className="ml-2 hover:bg-red-600 rounded p-0.5"><X size={14}/></button>
                </div>
            )}

            {/* Messages Area */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar bg-zinc-950"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <Send className="opacity-50" />
                        </div>
                        <p>No messages yet. Be the first to say hi!</p>
                    </div>
                )}
                
                {messages.map((msg, index) => {
                    const user = CommunityStore.getUser(msg.userId);
                    const isMe = msg.userId === CURRENT_USER.id;
                    const prevMsg = messages[index - 1];
                    const showHeader = !prevMsg || prevMsg.userId !== msg.userId || (msg.timestamp - prevMsg.timestamp > 120000) || prevMsg.type === 'system';
                    
                    const member = group.members.find(m => m.userId === msg.userId);
                    const msgRole = member?.role || 'MEMBER';

                    if (msg.type === 'system') {
                        return (
                            <div key={msg.id} className="flex justify-center my-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50">
                                    {msg.content}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`group flex gap-3 ${showHeader ? 'mt-4' : 'mt-0.5'} hover:bg-zinc-900/30 -mx-2 px-2 py-0.5 rounded transition-colors relative`}>
                            {showHeader ? (
                                <img 
                                    src={user?.avatar || 'https://via.placeholder.com/40'} 
                                    alt={user?.username} 
                                    className="w-10 h-10 rounded-full bg-zinc-800 object-cover mt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            ) : (
                                <div className="w-10 flex-shrink-0 text-xs text-zinc-700 text-right opacity-0 group-hover:opacity-100 select-none pt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div> 
                            )}
                            
                            <div className="flex-1 min-w-0">
                                {showHeader && (
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`font-bold text-sm hover:underline cursor-pointer ${msgRole === 'OWNER' ? 'text-amber-500' : msgRole === 'MODERATOR' ? 'text-emerald-500' : 'text-zinc-200'}`}>
                                            {user?.username}
                                        </span>
                                        <RoleBadge role={msgRole} />
                                        <span className="text-[10px] text-zinc-600 ml-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="relative group/msg">
                                    {msg.type === 'image' && msg.imageUrl ? (
                                        <div className="mt-1 mb-1">
                                            <img src={msg.imageUrl} alt="User upload" className="max-w-xs md:max-w-sm rounded-lg border border-zinc-800 shadow-lg cursor-pointer hover:scale-[1.01] transition-transform" />
                                            {msg.content && msg.content !== 'Sent an image' && (
                                                <p className="text-zinc-300 text-sm mt-1">{msg.content}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                            {msg.content}
                                        </p>
                                    )}
                                    
                                    {/* Message Actions */}
                                    {(canDelete || isMe) && (
                                        <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 border border-zinc-700 rounded flex shadow-lg z-10">
                                            <button 
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-700 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 relative">
                {isMuted ? (
                    <div className="flex items-center justify-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-bold gap-2">
                        <Clock size={16} />
                        You are muted. You can send messages again at {new Date(muteEndTime).toLocaleTimeString()}.
                    </div>
                ) : (
                    <>
                        {imagePreview && (
                            <div className="absolute bottom-full left-0 right-0 p-3 bg-zinc-900 border-t border-zinc-800 flex items-start gap-3 animate-in slide-in-from-bottom-2">
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-zinc-700" />
                                    <button 
                                        onClick={() => setImagePreview(null)}
                                        className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 border border-zinc-700 hover:bg-red-500 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <div className="text-sm text-zinc-400 pt-1">
                                    <p className="font-bold text-white">Image Preview</p>
                                    <p>Ready to upload</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSend} className="flex gap-2 items-end">
                            {canUpload && (
                                <>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageUpload} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors mb-0.5"
                                        title="Upload Image"
                                    >
                                        <ImageIcon size={20} />
                                    </button>
                                </>
                            )}
                            
                            <div className="flex-1 relative">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={imagePreview ? "Add a caption..." : `Message #${group.slug}...`}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-4 pr-10 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={!inputValue.trim() && !imagePreview}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors mb-0.5"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                )}
            </div>

        </div>
    );
};

export default ChatInterface;