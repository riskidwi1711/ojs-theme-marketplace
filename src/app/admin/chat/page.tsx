"use client";
import * as React from "react";
import {
  adminListChatSessions,
  adminGetChatMessages,
  type AdminChatSession,
  type AdminChatMessage,
} from "@/api/admin/chat";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/helper/date";

function formatShortDate(s?: string) {
  if (!s) return "";
  try {
    const d = new Date(s);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (isToday) {
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export default function AdminChatPage() {
  const toast = useToast();

  const [sessions, setSessions] = React.useState<AdminChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);

  const [activeEmail, setActiveEmail] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<AdminChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Load sessions on mount
  const loadSessions = React.useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await adminListChatSessions();
      setSessions(data);
    } catch (e: any) {
      toast(e.message || "Gagal memuat sesi chat", "error");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Load messages for active session
  const loadMessages = React.useCallback(
    async (email: string, silent = false) => {
      if (!silent) setMessagesLoading(true);
      try {
        const data = await adminGetChatMessages(email);
        setMessages(data);
      } catch (e: any) {
        if (!silent) toast(e.message || "Gagal memuat pesan", "error");
      } finally {
        if (!silent) setMessagesLoading(false);
      }
    },
    []
  );

  // When active session changes: load messages and set up auto-refresh
  React.useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!activeEmail) {
      setMessages([]);
      return;
    }

    loadMessages(activeEmail);

    intervalRef.current = setInterval(() => {
      loadMessages(activeEmail, true);
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeEmail, loadMessages]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectSession = (email: string) => {
    setActiveEmail(email);
  };

  const activeSession = sessions.find((s) => s.userEmail === activeEmail);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Chat Management</h1>
        <button
          onClick={loadSessions}
          className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/[0.08] transition-colors"
        >
          <RefreshIcon />
          Refresh
        </button>
      </div>

      <div className="flex h-[calc(100vh-10rem)] gap-0 bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        {/* Left panel: session list */}
        <div className="w-72 flex flex-col border-r border-white/8 flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/8 flex-shrink-0">
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Sesi Chat</p>
            {!sessionsLoading && (
              <p className="text-xs text-white/30 mt-0.5">{sessions.length} sesi aktif</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessionsLoading && (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-[#3d8c1e] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!sessionsLoading && sessions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 gap-2">
                <span className="text-white/20">
                  <ChatIcon />
                </span>
                <p className="text-xs text-white/25 text-center">Belum ada sesi chat</p>
              </div>
            )}

            {!sessionsLoading &&
              sessions.map((session) => {
                const isActive = session.userEmail === activeEmail;
                return (
                  <button
                    key={session.userEmail}
                    onClick={() => handleSelectSession(session.userEmail)}
                    className={`w-full text-left px-4 py-3.5 border-b border-white/[0.05] transition-colors ${
                      isActive
                        ? "bg-linear-to-r from-[#1c3a6e]/40 to-[#3d8c1e]/20 border-l-2 border-l-[#3d8c1e]"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1c3a6e] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                        {(session.userEmail || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-medium text-white/80 truncate">
                            {session.userEmail}
                          </span>
                          {session.lastAt && (
                            <span className="text-[10px] text-white/25 flex-shrink-0">
                              {formatShortDate(session.lastAt)}
                            </span>
                          )}
                        </div>
                        {session.lastMessage ? (
                          <p className="text-xs text-white/35 truncate mt-0.5">
                            {session.lastMessage}
                          </p>
                        ) : (
                          <p className="text-xs text-white/20 mt-0.5 italic">Tidak ada pesan</p>
                        )}
                        {session.messageCount !== undefined && (
                          <p className="text-[10px] text-white/20 mt-1">
                            {session.messageCount} pesan
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right panel: messages */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeEmail ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <span className="text-white/15">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <p className="text-sm text-white/25">Pilih sesi chat dari panel kiri</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 py-3.5 border-b border-white/8 flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#1c3a6e] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {(activeEmail || "U").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/85 truncate">{activeEmail}</p>
                  {activeSession?.messageCount !== undefined && (
                    <p className="text-xs text-white/30">{activeSession.messageCount} pesan</p>
                  )}
                </div>
                <button
                  onClick={() => loadMessages(activeEmail)}
                  className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <RefreshIcon />
                  Refresh
                </button>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {messagesLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-[#3d8c1e] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!messagesLoading && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <p className="text-xs text-white/25">Belum ada pesan dalam sesi ini</p>
                  </div>
                )}

                {!messagesLoading &&
                  messages.map((msg) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[65%] ${isAdmin ? "items-end" : "items-start"} flex flex-col gap-1`}>
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isAdmin
                                ? "bg-linear-to-br from-[#1c3a6e] to-[#3d8c1e] text-white rounded-br-sm"
                                : "bg-white/[0.07] text-white/80 border border-white/[0.08] rounded-bl-sm"
                            }`}
                          >
                            {/* Text content */}
                            {msg.text && <p className="break-words">{msg.text}</p>}

                            {/* Photo attachment */}
                            {msg.type === "photo" && msg.fileUrl && (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-1"
                              >
                                <img
                                  src={msg.fileUrl}
                                  alt={msg.fileName || "photo"}
                                  className="max-w-full rounded-lg max-h-48 object-cover border border-white/10"
                                />
                              </a>
                            )}

                            {/* Document attachment */}
                            {msg.type === "document" && msg.fileUrl && (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 mt-1 px-3 py-2 rounded-lg border text-xs font-medium transition-opacity hover:opacity-80 ${
                                  isAdmin
                                    ? "bg-white/10 border-white/20 text-white/80"
                                    : "bg-white/5 border-white/10 text-white/60"
                                }`}
                              >
                                <span className="flex-shrink-0">
                                  <FileIcon />
                                </span>
                                <span className="truncate">{msg.fileName || "Unduh file"}</span>
                              </a>
                            )}
                          </div>

                          <span
                            className={`text-[10px] text-white/25 px-1 ${isAdmin ? "text-right" : "text-left"}`}
                          >
                            {isAdmin ? "Admin · " : "User · "}
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
