/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogOut, Mic, MicOff, Volume1, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import Peer, { MediaConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tooltip from "@/components/ui/ToolTip";
import { Location } from "@/utils/types";

export default function Index() {
  const [userId, setUserId] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerInstance = useRef<Peer | null>(null);
  const mediaConnectionRef = useRef<MediaConnection | null>(null); // Ref to store the current call
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const [inCall, setInCall] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<string>('notInCall');
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const uploadedChunks = useRef<string[]>([]); // Store uploaded chunk paths
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [volume, setVolume] = useState<number>(1); // Volume range: 0 to 1
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>();

  const [confirmLogoutModal, setConfirmLogoutModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    password: ''
  });

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

        // Recording Start
        const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp9,opus' });

        // Queue for storing chunks to upload
        const chunkQueue: Blob[] = [];
        let isUploading = false;

        const uploadChunk = async () => {
          if (chunkQueue.length === 0 || isUploading) return;

          isUploading = true;
          const chunk = chunkQueue.shift(); // Remove the first chunk from the queue

          const formData = new FormData();
          formData.append("videoChunk", chunk!, "chunk.webm");
          formData.append("sessionId", currentRoomId);
          formData.append("user", "guest");

          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-chunk`, {
              method: "POST",
              body: formData
            });
            const result = await response.json();
            uploadedChunks.current.push(result.chunkPath); // Store uploaded chunk path
          } catch (error) {
            console.error("Error uploading chunk:", error);
          } finally {
            isUploading = false;
            uploadChunk(); // Check for the next chunk in the queue
          }
        };

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunkQueue.push(event.data); // Add the chunk to the queue
            uploadChunk(); // Start the upload process
          }
        };

        // Start recording, then stop every 2 seconds to prepare for the next chunk
        mediaRecorder.start();

        recordingIntervalRef.current = setInterval(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();  // Stop to trigger ondataavailable event
            mediaRecorder.start(); // Start again for the next chunk
          }
        }, 2000); // Send video chunks every 2 seconds

        mediaRecorderRef.current = mediaRecorder;
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

  const handleLogOut = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ formData });

    const cookies = parseCookies();
    const { userToken } = cookies;

    const decoded = jwt.decode(userToken) as { userName: string };
    const { userName } = decoded;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verifyUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ userName, password: formData.password })
      });

      if (response.status === 200) {
        destroyCookie(null, "userToken");
        router.push("/");
        return toast.custom((t: any) => <Toast content="Logged Out Successfully" type="success" t={t} />);
      } else {
        return toast.custom((t: any) => <Toast content="Invalid Credentials!" type="error" t={t} />);
      }
    } catch {
      return toast.custom((t: any) => <Toast content="Something Went Wrong" type="error" t={t} />);
    }
  }

  const logOut = () => {
    destroyCookie(null, "userToken");
    router.push("/");
  }

  const handleOpenConfirmLogoutModal = () => {
    setConfirmLogoutModal(true);
  }

  const handleCloseConfirmLogoutModal = () => {
    setConfirmLogoutModal(false);
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (currentUserVideoRef.current) {
      const currentVideo = currentUserVideoRef.current;
      currentVideo.volume = newVolume; // Set local video volume
    }

    if (remoteVideoRef.current) {
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.volume = newVolume; // Set remote video volume
    }
  };

  const toggleMute = () => {
    console.log(mediaConnectionRef.current?.localStream.getAudioTracks());
    const audioTracks = mediaConnectionRef.current?.localStream.getAudioTracks();
    audioTracks![0].enabled = !audioTracks![0].enabled;
    setIsMuted(!isMuted);
  };

  const fetchLocationData = async () => {
    try {
      const cookies = parseCookies();
      const { userToken } = cookies;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/userLocationList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log({ data });
        setLocation(data[0]);
      } else {
        return toast.custom((t: any) => <Toast content="Error fetching location data" type="error" t={t} />);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      return toast.custom((t: any) => <Toast content="Something Went Wrong" type="error" t={t} />);
    }
  }

  useEffect(() => {
    const cookies = parseCookies();
    const { userToken } = cookies;

    try {
      if (!userToken) {
        router.push("/");  // Redirect if token doesn't exist
      } else {
        const decoded = jwt.decode(userToken) as { userName: string, exp: number };
        console.log({ decoded });

        const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
        if (decoded.exp < currentTime) {
          toast.custom((t: any) => (<Toast t={t} type="error" content="Token has expired" />));
          console.error("Token has expired");
          logOut();  // Log out if token has expired
        } else {
          const { userName } = decoded;
          setUserId(userName);  // Set userId from token if valid
          fetchLocationData();
        }
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      router.push("/");  // Redirect to login on error
    }
  }, []);


  useEffect(() => {
    if (userId !== "") {
      const peer = new Peer(userId, {
        config: {
          iceServers: [
            {
              urls: "turn:relay1.expressturn.com:80",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay1.expressturn.com:443",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay1.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay2.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay3.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay4.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay5.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay6.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay7.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay8.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay9.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay10.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
            {
              urls: "turn:relay11.expressturn.com:3478",
              username: "efE34XGFPG52SHEMJJ",
              credential: "sI43EOvU8Z3d0hFk"
            },
          ]
        }
      });
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

      socket.on("call-ended", async (data) => {
        if (data.roomId === currentRoomId) {
          if (mediaConnectionRef.current) {
            mediaConnectionRef.current.close();
            mediaConnectionRef.current = null;
          }
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = null;
          }
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop(); // Stop recording
            mediaRecorderRef.current = null;
          }
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current); // Clear the interval
            recordingIntervalRef.current = null;
          }
          setInCall(false);
          setCallStatus("notInCall");

          // try {
          //   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/merge-chunks`, {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({ sessionId: currentRoomId, user: "guest" }),
          //   });
          //   const result = await response.json();
          //   console.log("Merged video path:", result.mergedVideoPath); // Handle the merged video path as needed
          // } catch (error) {
          //   console.error("Error merging video:", error);
          // }
        }
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
          {
            location?.LocationLogo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${location?.LocationLogo}`}
                alt="Logo"
                width={1000}
                height={1000}
                className="w-28"
              />
            ) : (
              <h1 className="font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                ORION.
              </h1>
            )
          }
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="font-bold text-[46px]">Welcome To {location?.LocationName}</h1>
        </div>
      </div>
      {!inCall && callStatus === "notInCall" && (
        <div className="w-full h-full flex justify-center items-center relative">
          {
            location?.LocationImage && (
              <img
                src={
                  (location?.LocationImage && location?.LocationImage !== "") ? (
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}${location?.LocationImage}`
                  ) :
                    "/images/background.png"}
                alt="Logo"
                className="w-full h-full absolute object-fill"
              />
            )
          }
          <div className="w-80 h-72 rounded-lg p-4 flex flex-col justify-between items-center space-y-4 z-50 bg-zinc-900">
            <div className="w-full flex justify-center">
              <h1 className="font-bold text-2xl">Receptionist</h1>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-foreground border border-zinc-600 rounded-md p-2 cursor-pointer" onClick={initiateCall}>
              <img
                src={
                  (location?.LocationReceptionistPhoto && location?.LocationReceptionistPhoto !== "") ? (
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}${location?.LocationReceptionistPhoto}`
                  ) :
                    "/images/receptionist.png"
                }
                alt="Receptionist"
                className="w-28"
              />
              <h1 className="text-xl font-bold whitespace-nowrap">Meet Virtual Receptionist</h1>
            </div>
          </div>
        </div>
      )}
      {inCall && callStatus === "inProgress" && (
        <div className="w-full h-full relative">
          <div className="flex flex-col items-center absolute bottom-2 right-2">
            <video ref={currentUserVideoRef} autoPlay muted className="rounded-lg shadow-lg w-64 h-48 object-cover" />
          </div>
          <div>
            <video ref={remoteVideoRef} autoPlay className="w-full h-screen rounded-lg shadow-lg object-cover" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-foreground p-2 rounded-md">
              {/* Volume Slider */}
              <div className="w-44 flex items-center gap-2 border-r-2 border-r-border pr-3">
                {
                  volume === 0 && (
                    <VolumeX className="w-9 h-9" />
                  )
                }
                {
                  volume > 0 && volume < 0.5 && (
                    <Volume1 className="w-9 h-9" />
                  )
                }
                {
                  volume >= 0.5 && (
                    <Volume2 className="w-9 h-9" />
                  )
                }
                <Tooltip className="mb-2 -translate-x-28" tooltip="Volume">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="cursor-pointer appearance-none w-full h-2 bg-zinc-400 rounded-lg focus:outline-none focus:ring-offset-2 accent-indigo-600 transition-all"
                  />
                </Tooltip>
              </div>
              <div className="w-16">
                <Button
                  className={isMuted ? "bg-orange-500/30 border border-orange-500 hover:bg-orange-500 duration-300 w-full rounded-md px-4 py-2 flex items-center justify-center space-x-1 cursor-pointer"
                    : "bg-zinc-500/30 border border-zinc-500 hover:bg-zinc-500 duration-300 w-full rounded-md px-4 py-2 flex items-center justify-center space-x-1 cursor-pointer"}
                  color={!isMuted ? "zinc" : null}
                  icon={<Tooltip className="mb-4" tooltip={isMuted ? "Unmute Mic" : "Mute Mic"}>
                    {
                      !isMuted ?
                        <Mic className="w-6 h-6" />
                        :
                        <MicOff className="w-6 h-6" />
                    }
                  </Tooltip>} onClick={toggleMute} />
              </div>
            </div>
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
            <h1 className="font-bold text-xl">Call On Hold, Thank you for your patience. We&apos;ll be with you shortly.</h1>
          </div>
        )
      }
      <div className="absolute top-4 right-2 z-50 flex items-center">
        <LogOut className="cursor-pointer" color="red" onClick={handleOpenConfirmLogoutModal} />
      </div>
      {
        confirmLogoutModal && (
          <Modal onClose={handleCloseConfirmLogoutModal} title="Confirm Logout">
            <div className="flex flex-col gap-2 p-2">
              <div>
                <h1 className="font-bold">Password</h1>
              </div>
              <form className="flex flex-col gap-2" onSubmit={handleLogOut}>
                <div>
                  <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button text="Submit" color="foreground" type="submit" />
                  <Button text="Cancel" color="foreground" type="button" onClick={handleCloseConfirmLogoutModal} />
                </div>
              </form>
            </div>
          </Modal>
        )
      }
    </div>
  )
}