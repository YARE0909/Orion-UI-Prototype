import { toTitleCase } from "@/utils/stringFunctions";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import Peer, { MediaConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Index() {
  const [userId, setUserId] = useState<string>("");
  const [, setPeerId] = useState<string>('');
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerInstance = useRef<Peer | null>(null);
  const mediaConnectionRef = useRef<MediaConnection | null>(null); // Ref to store the current call
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const [inCall, setInCall] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<string>('notInCall');
  const socketRef = useRef<ReturnType<typeof io> | null>(null);


  const router = useRouter();

  const call = (remotePeerId: string) => {
    console.log("Calling peer with ID: ", remotePeerId);
    // Use modern getUserMedia method
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream: MediaStream) => {
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        }

        const peerCall = peerInstance.current?.call(remotePeerId, mediaStream);
        if (peerCall) {
          mediaConnectionRef.current = peerCall; // Store the current call in the ref
          peerCall.on('stream', (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
  };

  const initiateCall = () => {
    const roomId = `room-${Math.floor(Math.random() * 1000)}`;
    setCurrentRoomId(roomId);
    setInCall(true);
    setCallStatus('calling');
    if (socketRef.current) {
      socketRef.current.emit("initiate-call", JSON.stringify({ roomId }));
    }
  };

  const handleLogOut = () => {
    destroyCookie(null, "userToken");
    return router.push("/");
  }

  useEffect(() => {
    const cookies = parseCookies();
    const { userToken } = cookies;

    if (!userToken) {
      router.push("/");
    } else {
      setUserId(userToken);
    }
  }, []);

  useEffect(() => {
    if (userId !== "") {
      const peer = new Peer(userId);
      peerInstance.current = peer;

      const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        query: {
          userId,
        },
        withCredentials: true,
      });

      socketRef.current = socket; // Store socket in ref

      socket.on("call-joined", (data) => {
        if (data.roomId === currentRoomId) {
          call(data.to);
          setCallStatus("inProgress");
        }
      });

      socket.on("call-on-hold", (data) => {
        if (data.roomId === currentRoomId) {
          setCallStatus("onHold");
        }
      });

      socket.on("call-resumed", (data) => {
        if (data.roomId === currentRoomId) {
          call(data.to);
          setCallStatus("inProgress");
        }
      });

      socket.on("call-ended", (data) => {
        if (data.roomId === currentRoomId) {
          if (mediaConnectionRef.current) {
            mediaConnectionRef.current.close();
            mediaConnectionRef.current = null;
          }
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = null;
          }
          setInCall(false);
          setCallStatus("notInCall");
        }
      });

      peer.on("open", (id: string) => {
        setPeerId(id);
      });

      peer.on("call", (call: MediaConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((mediaStream: MediaStream) => {
            if (currentUserVideoRef.current) {
              currentUserVideoRef.current.srcObject = mediaStream;
              currentUserVideoRef.current.play();
            }

            call.answer(mediaStream);
            call.on("stream", (remoteStream: MediaStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
              }
            });

            mediaConnectionRef.current = call;
          })
          .catch((err) => {
            console.error("Error accessing media devices.", err);
          });
      });

      return () => {
        socket.disconnect();
        peerInstance.current?.destroy();
      };
    }
  }, [userId, currentRoomId]);


  return (
    <div className="w-full h-screen bg-background flex flex-col text-white">
      <div className="w-full h-16 flex items-center justify-between border-b-2 border-b-border z-50 bg-background px-2 absolute top-0 left-0">
        <div>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="w-28"
          />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-bold text-[46px]">Welcome To {toTitleCase(userId)}</h1>
        </div>
      </div>
      {!inCall && callStatus === "notInCall" && (
        <div className="w-full h-full flex justify-center items-center relative">
          <Image
            src="/images/background.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="w-full h-full absolute object-fill"
          />
          <div className="w-80 h-72 rounded-lg p-4 flex flex-col justify-between items-center space-y-4 z-50 bg-zinc-900">
            <div className="w-full flex justify-center">
              <h1 className="font-bold text-2xl">Receptionist</h1>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-foreground border border-zinc-600 rounded-md p-2 cursor-pointer" onClick={initiateCall}>
              <Image
                src="/images/receptionist.png"
                alt="Receptionist"
                width={1000}
                height={1000}
                className="w-28"
              />
              <h1 className="text-xl font-bold whitespace-nowrap">Meet Virtual Receptionist</h1>
            </div>
          </div>
        </div>
      )}
      {inCall && callStatus === "inProgress" && (
        <div className="w-full h-full relative">
          <div className="flex flex-col items-center absolute bottom-5 right-5">
            <video ref={currentUserVideoRef} autoPlay muted className="rounded-lg shadow-lg w-64 h-48 object-cover" />
          </div>
          <div>
            <video ref={remoteVideoRef} autoPlay className="w-full h-screen rounded-lg shadow-lg object-cover" />
          </div>
        </div>
      )}
      {
        callStatus === 'calling' && (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="font-bold text-xl">Calling Virtual Receptionist...</h1>
          </div>
        )
      }
      {
        callStatus === 'onHold' && (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="font-bold text-xl">Call on hold</h1>
          </div>
        )
      }
      <div className="absolute top-4 right-2 z-50 flex items-center">
        <LogOut className="cursor-pointer" color="red" onClick={handleLogOut} />
      </div>
    </div>
  )
}