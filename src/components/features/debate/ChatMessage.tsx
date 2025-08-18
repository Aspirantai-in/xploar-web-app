'use client';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex items-start space-x-3",
                isUser ? "flex-row-reverse space-x-reverse" : ""
            )}
        >
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isUser ? "bg-electric-aqua" : "bg-neon-lilac"
            )}>
                {isUser ? (
                    <User className="h-4 w-4 text-void-black" />
                ) : (
                    <Bot className="h-4 w-4 text-void-black" />
                )}
            </div>

            <div className={cn(
                "max-w-[70%] p-3 rounded-lg",
                isUser
                    ? "bg-electric-aqua text-void-black"
                    : "bg-ice-white border border-electric-aqua/20"
            )}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={cn(
                    "text-xs mt-1",
                    isUser ? "text-void-black/70" : "text-void-black/50"
                )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </motion.div>
    );
}