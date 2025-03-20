import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ isOpen, onClose, participantName }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [messageText, setMessageText] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Simulated connection status
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Simulate connection process
      const timer = setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        
        toast({
          title: "Connected",
          description: `You are now connected with ${participantName}`,
        });
        
        // Setup local video (in a real app, this would use WebRTC)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }
              
              // In a real implementation, we would connect to the remote peer here
              // For now, we'll simulate a remote video with a timeout
              setTimeout(() => {
                if (remoteVideoRef.current) {
                  // In a real app, this would be the remote stream
                  // For demo purposes, we're using the same stream
                  remoteVideoRef.current.srcObject = stream;
                }
              }, 2000);
            })
            .catch(err => {
              console.error("Error accessing media devices:", err);
              toast({
                title: "Camera Access Error",
                description: "Could not access your camera or microphone",
                variant: "destructive"
              });
            });
        }
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        // Clean up media streams when component unmounts
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [isOpen, participantName, toast]);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    
    // In a real app, this would toggle the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    
    // In a real app, this would toggle the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const endCall = () => {
    // Clean up media streams
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    onClose();
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      const newMessage = {
        sender: 'You',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
      
      // Simulate receiving a reply
      setTimeout(() => {
        const reply = {
          sender: participantName,
          text: "Thanks for your message. I'm looking forward to discussing more about the position.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
      }, 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => isConnected && endCall()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-[80vh]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>Interview with {participantName}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsChatOpen(!isChatOpen)}>
                  <MessageSquare size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Users size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 size={16} />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex bg-slate-900 relative">
            {isConnecting ? (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="mb-4 text-xl">Connecting to {participantName}...</div>
                  <div className="loading-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Main video content */}
                <div className="flex-1 relative">
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Local video (picture-in-picture) */}
                  <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video bg-slate-800 overflow-hidden rounded-lg shadow-lg border border-slate-700">
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                    />
                    {!isVideoOn && (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                        <Video size={32} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Chat sidebar */}
                {isChatOpen && (
                  <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
                    <div className="p-3 border-b font-medium">Chat</div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                        >
                          <div className="text-xs text-gray-500 mb-1">{msg.sender} • {msg.time}</div>
                          <div 
                            className={`rounded-lg py-2 px-3 max-w-[80%] ${
                              msg.sender === 'You'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-md px-3 py-2 text-sm"
                      />
                      <Button type="submit" size="sm">Send</Button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Controls */}
          <div className="p-4 flex justify-center gap-4 bg-white border-t">
            <Button 
              variant={isMicOn ? "outline" : "secondary"} 
              size="lg" 
              className="rounded-full w-12 h-12 p-0"
              onClick={toggleMic}
            >
              {isMicOn ? <Mic /> : <MicOff />}
            </Button>
            <Button 
              variant={isVideoOn ? "outline" : "secondary"} 
              size="lg" 
              className="rounded-full w-12 h-12 p-0"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video /> : <VideoOff />}
            </Button>
            <Button 
              variant="destructive" 
              size="lg" 
              className="rounded-full w-12 h-12 p-0"
              onClick={endCall}
            >
              <PhoneOff />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
