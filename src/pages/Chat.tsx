"use client";

import type React from "react";

import Header from "@/components/nav-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ArrowLeft, MoreVertical, Send, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Mock data - replace with your actual data fetching logic
const mockData = {
  following: [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey, how's it going?",
      lastMessageTime: "10:30 AM",
    },
    {
      id: 2,
      name: "Sam Rivera",
      username: "samr",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Did you see that new movie?",
      lastMessageTime: "Yesterday",
    },
    {
      id: 3,
      name: "Taylor Kim",
      username: "taylork",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for the help!",
      lastMessageTime: "Monday",
    },
  ],
  followers: [
    {
      id: 2,
      name: "Sam Rivera",
      username: "samr",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Jordan Lee",
      username: "jlee",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Let's catch up soon",
      lastMessageTime: "2 days ago",
    },
  ],
  messages: {
    1: [
      { id: 1, text: "Hey there!", sender: "user", timestamp: "10:25 AM" },
      {
        id: 2,
        text: "Hey, how's it going?",
        sender: "contact",
        timestamp: "10:30 AM",
      },
      {
        id: 3,
        text: "Pretty good! Working on that project we discussed.",
        sender: "user",
        timestamp: "10:32 AM",
      },
      {
        id: 4,
        text: "How's your progress?",
        sender: "user",
        timestamp: "10:32 AM",
      },
      {
        id: 5,
        text: "It's coming along well. I should have something to show you by tomorrow.",
        sender: "contact",
        timestamp: "10:35 AM",
      },
    ],
    2: [
      {
        id: 1,
        text: "Did you watch that new show?",
        sender: "contact",
        timestamp: "Yesterday",
      },
      {
        id: 2,
        text: "Not yet, is it good?",
        sender: "user",
        timestamp: "Yesterday",
      },
      {
        id: 3,
        text: "Did you see that new movie?",
        sender: "contact",
        timestamp: "Yesterday",
      },
    ],
    3: [
      {
        id: 1,
        text: "Can you help me with something?",
        sender: "contact",
        timestamp: "Monday",
      },
      {
        id: 2,
        text: "Sure, what do you need?",
        sender: "user",
        timestamp: "Monday",
      },
      {
        id: 3,
        text: "Thanks for the help!",
        sender: "contact",
        timestamp: "Monday",
      },
    ],
    4: [
      {
        id: 1,
        text: "We should catch up sometime",
        sender: "user",
        timestamp: "2 days ago",
      },
      {
        id: 2,
        text: "Definitely! Let's catch up soon",
        sender: "contact",
        timestamp: "2 days ago",
      },
    ],
  },
};

export default function ChatPage() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState<number | null>(
    id ? Number.parseInt(id) : null
  );
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Combine following and followers for contacts list
  useEffect(() => {
    const allContacts = [...mockData.following];
    mockData.followers.forEach((follower) => {
      if (!allContacts.some((contact) => contact.id === follower.id)) {
        allContacts.push(follower);
      }
    });
    setContacts(allContacts);
  }, []);

  // Set active chat messages
  useEffect(() => {
    if (activeChat && mockData.messages[activeChat]) {
      setChatMessages(mockData.messages[activeChat]);
    }
  }, [activeChat]);

  // Set active chat from URL param
  useEffect(() => {
    if (id) {
      setActiveChat(Number.parseInt(id));
      if (isMobile) {
        setShowSidebar(false);
      }
    }
  }, [id, isMobile]);

  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages([...chatMessages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const getActiveContact = () => {
    return contacts.find((contact) => contact.id === activeChat);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-6xl h-[calc(100vh-80px)]">
        <div className="flex h-full rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Sidebar - Contact List */}
          {(showSidebar || !isMobile) && (
            <div
              className={`${
                isMobile ? "w-full" : "w-1/3"
              } border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold">Messages</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-3 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ${
                      activeChat === contact.id
                        ? "bg-gray-100 dark:bg-gray-900"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveChat(contact.id);
                      if (isMobile) setShowSidebar(false);
                    }}
                  >
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
                      <AvatarImage
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                      />
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-900">
                        {contact.name.charAt(0)}
                        {contact.name.split(" ")[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {contact.lastMessageTime}
                          </span>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Area */}
          {(!showSidebar || !isMobile) && (
            <div
              className={`${
                isMobile ? "w-full" : "w-2/3"
              } flex flex-col bg-white dark:bg-black`}
            >
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center">
                      {isMobile && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowSidebar(true)}
                          className="mr-2"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={getActiveContact()?.avatar || "/placeholder.svg"}
                          alt={getActiveContact()?.name}
                        />
                        <AvatarFallback>
                          {getActiveContact()?.name.charAt(0)}
                          {getActiveContact()?.name.split(" ")[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">
                          {getActiveContact()?.name}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{getActiveContact()?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Video className="h-5 w-5" />
                        <span className="sr-only">Video Call</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Block user</DropdownMenuItem>
                          <DropdownMenuItem>
                            Clear chat history
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            msg.sender === "user"
                              ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                              : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-gray-200 dark:border-gray-800"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="ml-2"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <Card className="w-[80%] max-w-md border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                    <CardHeader>
                      <CardTitle className="text-center">
                        Select a conversation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-500 dark:text-gray-400">
                      Choose a contact from the list to start chatting
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
