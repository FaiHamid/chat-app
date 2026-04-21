import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { currentUserQuery } from "../reactQuery/userQuery";
import { useQuery } from "@tanstack/react-query";
import { IMessageResponse, messagesService } from "../services/messagesService";
import { Link, useParams } from "react-router-dom";
import { chatsService } from "../services/chatsService";
import { queryKeys } from "../reactQuery/queriesKey";
import { io, Socket } from "socket.io-client";
import { accessTokenService } from "../services/accessTokenService";
import { IUserRespons } from "../types/User";

export const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [inputValue, setInputValue] = useState("");
  const [userTyping, setUserTyping] = useState<IUserRespons | null>(null);
  const { data: currentUser } = useQuery(currentUserQuery);
  const [allMessages, setAllMessages] = useState<IMessageResponse[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const currentUserId = currentUser ? currentUser.id : null;
  const parsedChatId = Number(chatId);
  const isChatIdValid = Number.isFinite(parsedChatId);

  const { data: chats = [] } = useQuery({
    queryKey: [queryKeys.getAllChats],
    queryFn: chatsService.getAllChats,
  });

  const activeChat = chats.find((chat) => chat.id === parsedChatId);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", parsedChatId],
    queryFn: () => messagesService.getAllMessages(parsedChatId),
    enabled: isChatIdValid,
  });

  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (!isChatIdValid) {
      return undefined;
    }

    const token = accessTokenService.get();
    if (!token) {
      return undefined;
    }

    const socket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token },
    });

    socketRef.current = socket;

    const joinCurrentRoom = () => {
      socket.emit("room:join", parsedChatId);
    };

    socket.on("connect", joinCurrentRoom);
    joinCurrentRoom();

    socket.on("chat:message", (message: IMessageResponse) => {
      if (typeof message.roomId === "number" && message.roomId !== parsedChatId) {
        return;
      }

      setAllMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('chat:type', (user: IUserRespons) => {
      setUserTyping(user);
    })

    socket.on('chat:type-leave', () => {
      setUserTyping(null);
    })

    return () => {
      socket.emit("room:leave", parsedChatId);
      socketRef.current = null;
      socket.close();
    };
  }, [isChatIdValid, parsedChatId]);

  const canSend = useMemo(() => inputValue.trim().length > 0, [inputValue]);
  const typingUserEmail =
    userTyping && userTyping.id !== currentUserId ? userTyping.email : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = inputValue.trim();
    if (!trimmedText || !currentUser || !isChatIdValid || !socketRef.current) return;

    socketRef.current.emit("chat:message", {
      roomId: parsedChatId,
      text: trimmedText,
    });
    setInputValue("");
  };

    const handleTyping = (query: string) => {
      setInputValue(query);

      if (!socketRef.current) return;

      socketRef.current.emit("chat:type", {
        roomId: parsedChatId,
      });
    }

    console.log('usertyping', userTyping);
  const handleStopTyping = () => {
    
  }
  if (!isChatIdValid) {
    return (
      <section className="mx-auto mt-6 w-full max-w-[780px] rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-sm">
        <p className="text-sm text-slate-400">Chat not found.</p>
        <Link
          to="/chats"
          className="mt-4 inline-flex text-sm font-medium text-[#8BC83F]"
        >
          Back to chats
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-6 flex w-full max-w-[780px] flex-col rounded-2xl border border-[#EAEEF4] bg-slate-800 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Link to="/chats" className="text-sm font-medium text-[#8BC83F]">
            Back to chats
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            {activeChat?.title || `Chat #${parsedChatId}`}
          </h1>
        </div>
      </div>

      <div className="mb-4 flex h-[420px] flex-col gap-3 overflow-y-auto rounded-xl bg-slate-900 p-3">
        {currentUser && allMessages.map((message) => {
          const isOwnMessage = message.userId === currentUserId;

          return (
            <div
              key={message.id}
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                isOwnMessage
                  ? "self-end bg-[#8BC83F] text-white"
                  : "self-start bg-slate-700 text-slate-100"
              }`}
            >
              <div className="flex items-end gap-2">
                <span>{message.text}</span>
                <span className={`text-xs ${isOwnMessage ? "text-slate-300" : "text-slate-500"}`}>
                  {message.user?.name || (isOwnMessage ? currentUser.name : "Unknown")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {typingUserEmail && (
        <div className="mb-3 flex items-center gap-1 text-sm text-slate-300">
          <span>{typingUserEmail} typing</span>
          <span className="inline-flex items-center gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-slate-300 [animation-delay:0ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={inputValue}
          onChange={(event) => handleTyping(event.target.value)}
          placeholder="Введіть повідомлення..."
          className="h-11 flex-1 rounded-xl border border-slate-600 bg-slate-700 text-slate-100 px-4 text-sm outline-none transition focus:border-[#8BC83F] placeholder:text-slate-400"
          onBlur={handleStopTyping}
        />
        <button
          type="submit"
          disabled={!canSend || !currentUser}
          className="h-11 rounded-xl bg-[#8BC83F] px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
};
