"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LuMessageSquare,
  LuX,
  LuSend,
  LuLoader,
  LuPaperclip,
  LuFileText,
  LuDownload,
  LuChevronDown,
} from "react-icons/lu";
import { useAuth } from "@/context/auth";
import {
  sendChatMessage,
  getChatMessages,
  uploadChatFile,
  type ChatMessage,
} from "@/api/chat";

interface DisplayMessage {
  id: string;
  type: "text" | "photo" | "document";
  text?: string;
  fileUrl?: string;
  fileName?: string;
  fileMime?: string;
  from: "user" | "support";
  timestamp: Date;
  pending?: boolean;
}

const POLL_MS = 4000;

function toDisplay(msg: ChatMessage): DisplayMessage {
  return {
    id: msg.id,
    type: msg.type ?? "text",
    text: msg.text,
    fileUrl: msg.fileUrl,
    fileName: msg.fileName,
    fileMime: msg.fileMime,
    from: msg.sender === "user" ? "user" : "support",
    timestamp: new Date(msg.createdAt),
  };
}

const WELCOME: DisplayMessage = {
  id: "welcome",
  type: "text",
  text: "Halo! 👋 Selamat datang di Help Center Open Themes. Ada yang bisa kami bantu?",
  from: "support",
  timestamp: new Date(),
};

// ── Support Avatar ─────────────────────────────────────────────────────────────

function SupportAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0 text-white text-[10px] font-bold shadow-sm select-none">
      OT
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: DisplayMessage }) {
  const isUser = msg.from === "user";

  const timeLabel = msg.pending
    ? "Mengirim..."
    : msg.timestamp.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

  const timeClass = `text-[10px] mt-1 select-none ${
    isUser ? "text-white/60 text-right" : "text-gray-400"
  }`;

  const bubbleBase = `max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm transition-opacity ${
    isUser
      ? `bg-[var(--color-primary)] text-white rounded-br-sm ${msg.pending ? "opacity-60" : "opacity-100"}`
      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm"
  }`;

  const content = (() => {
    if (msg.type === "photo" && msg.fileUrl) {
      return (
        <>
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src={msg.fileUrl}
              alt={msg.fileName ?? "image"}
              width={240}
              height={160}
              className="rounded-xl object-cover max-h-44 w-auto"
              unoptimized
            />
          </a>
          {msg.text && <p className="leading-relaxed mt-1.5 text-xs">{msg.text}</p>}
          <p className={timeClass}>{timeLabel}</p>
        </>
      );
    }

    if (msg.type === "document") {
      const name = msg.fileName ?? "File";
      return (
        <>
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 hover:opacity-80"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isUser ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              <LuFileText size={18} className={isUser ? "text-white" : "text-gray-500"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold">{name}</p>
            </div>
            <LuDownload size={14} className="shrink-0 opacity-70" />
          </a>
          {msg.text && <p className="leading-relaxed mt-1.5 text-xs">{msg.text}</p>}
          <p className={timeClass}>{timeLabel}</p>
        </>
      );
    }

    return (
      <>
        <p className="leading-relaxed">{msg.text}</p>
        <p className={timeClass}>{timeLabel}</p>
      </>
    );
  })();

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && <SupportAvatar />}
      <div className={bubbleBase}>{content}</div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export const HelpCenterChat: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [messages, setMessages] = React.useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const [filePreview, setFilePreview] = React.useState<File | null>(null);

  const lastTimestampRef = React.useRef<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load history when chat opens
  React.useEffect(() => {
    if (!isOpen || !user) return;

    setLoadingHistory(true);
    lastTimestampRef.current = null;

    getChatMessages()
      .then((data) => {
        if (!data.messages || data.messages.length === 0) {
          setMessages([WELCOME]);
        } else {
          setMessages(data.messages.map(toDisplay));
          lastTimestampRef.current = data.messages[data.messages.length - 1].createdAt;
        }
        setUnread(0);
      })
      .catch(() => setMessages([WELCOME]))
      .finally(() => setLoadingHistory(false));
  }, [isOpen, user]);

  // Polling for admin replies
  React.useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!isOpen || !user) return;

    pollRef.current = setInterval(async () => {
      try {
        const data = await getChatMessages(lastTimestampRef.current ?? undefined);
        if (!data.messages || data.messages.length === 0) return;

        const fresh = data.messages.map(toDisplay);
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newOnes = fresh.filter((m) => !existingIds.has(m.id));
          if (newOnes.length === 0) return prev;

          if (isMinimized) {
            const adminCount = newOnes.filter((m) => m.from === "support").length;
            if (adminCount > 0) setUnread((u) => u + adminCount);
          }
          return [...prev, ...newOnes];
        });

        lastTimestampRef.current = data.messages[data.messages.length - 1].createdAt;
      } catch {
        // silent — network blip, try again next tick
      }
    }, POLL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, user, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
    setFilePreview(null);
    lastTimestampRef.current = null;
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const handleMinimize = () => {
    setIsMinimized((v) => !v);
    if (isMinimized) setUnread(0);
  };

  const handleSend = async () => {
    if (filePreview) {
      await handleSendFile(filePreview);
      return;
    }
    if (!inputValue.trim() || sending) return;
    const text = inputValue.trim();
    setInputValue("");

    const tempId = `pending-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, type: "text", text, from: "user", timestamp: new Date(), pending: true },
    ]);
    setSending(true);

    try {
      const resp = await sendChatMessage(text);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, id: resp.messageId, pending: false, timestamp: new Date(resp.createdAt) }
            : m
        )
      );
      lastTimestampRef.current = resp.createdAt;
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleSendFile = async (file: File) => {
    if (sending) return;
    setFilePreview(null);
    setSending(true);

    const isImage = file.type.startsWith("image/");
    const tempId = `pending-${Date.now()}`;
    const localUrl = isImage ? URL.createObjectURL(file) : undefined;

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        type: isImage ? "photo" : "document",
        fileUrl: localUrl,
        fileName: file.name,
        fileMime: file.type,
        from: "user",
        timestamp: new Date(),
        pending: true,
      },
    ]);

    try {
      const resp = await uploadChatFile(file);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: resp.messageId,
                pending: false,
                timestamp: new Date(resp.createdAt),
                fileUrl: resp.fileUrl ?? m.fileUrl,
                fileName: resp.fileName ?? m.fileName,
              }
            : m
        )
      );
      lastTimestampRef.current = resp.createdAt;
      if (localUrl && resp.fileUrl) URL.revokeObjectURL(localUrl);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      if (localUrl) URL.revokeObjectURL(localUrl);
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFilePreview(file);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !sending && !loadingHistory && (!!inputValue.trim() || !!filePreview);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center ${
          isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        }`}
        aria-label="Buka Help Center"
      >
        <LuMessageSquare size={24} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[380px] bg-white rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ease-out`}
          style={{
            height: isMinimized ? "64px" : "520px",
            boxShadow:
              "0 24px 64px -12px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="bg-[var(--color-primary)] text-white px-4 py-3 flex items-center justify-between shrink-0"
            style={{ cursor: isMinimized ? "pointer" : "default" }}
            onClick={isMinimized ? handleMinimize : undefined}
          >
            <div className="flex items-center gap-3">
              {/* Avatar with online dot */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm select-none">
                  OT
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Open Themes Support</h3>
                <p className="text-[11px] text-white/70 leading-tight mt-0.5">
                  {isMinimized && unread > 0 ? (
                    <span className="text-yellow-300 font-medium">{unread} pesan baru</span>
                  ) : (
                    "Biasanya membalas dalam beberapa menit"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMinimize();
                }}
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label={isMinimized ? "Perbesar" : "Perkecil"}
              >
                <LuChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${isMinimized ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label="Tutup chat"
              >
                <LuX size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Guest: prompt to login */}
              {!authLoading && !user ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-50 to-white">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-100)] flex items-center justify-center mb-4 shadow-sm">
                    <LuMessageSquare size={28} className="text-[var(--color-primary)]" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-base mb-2">Login untuk Mulai Chat</h4>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-[200px]">
                    Masuk ke akun kamu untuk menghubungi tim support kami secara langsung.
                  </p>
                  <Link
                    href="/auth/login"
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary-600)] transition-all hover:shadow-md hover:scale-105 active:scale-95"
                  >
                    Masuk Sekarang
                  </Link>
                </div>
              ) : (
                <>
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/80">
                    {loadingHistory ? (
                      <div className="flex items-center justify-center h-full">
                        <LuLoader size={22} className="animate-spin text-gray-300" />
                      </div>
                    ) : (
                      messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* File preview bar */}
                  {filePreview && (
                    <div className="border-t border-gray-100 px-4 py-2.5 bg-white flex items-center gap-3 shrink-0">
                      {filePreview.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={URL.createObjectURL(filePreview)}
                          alt="preview"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <LuFileText size={18} className="text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{filePreview.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {(filePreview.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => setFilePreview(null)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                        aria-label="Hapus file"
                      >
                        <LuX size={12} />
                      </button>
                    </div>
                  )}

                  {/* Input */}
                  <div className="border-t border-gray-100 px-4 py-3 bg-white shrink-0">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl pl-3 pr-2 py-2 border border-gray-200 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/15 transition-all">
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending || loadingHistory}
                        className="text-gray-400 hover:text-[var(--color-primary)] transition-colors disabled:opacity-40 shrink-0"
                        aria-label="Lampirkan file"
                      >
                        <LuPaperclip size={18} />
                      </button>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                          filePreview ? "Tambah caption (opsional)..." : "Ketik pesan..."
                        }
                        disabled={sending || loadingHistory}
                        className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 py-0.5 disabled:opacity-60"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                          canSend
                            ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] hover:scale-105 shadow-sm"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        aria-label="Kirim pesan"
                      >
                        {sending ? (
                          <LuLoader size={14} className="animate-spin" />
                        ) : (
                          <LuSend size={14} />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      Powered by Open Themes · via Telegram
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default HelpCenterChat;
