/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import MockCardData from "../../../mock/watchListMock.json";
import { CircleX, FilePlus2, MicOff, PanelRightClose, PanelRightOpen, Pause, Phone, PhoneIncoming, PhoneOff, VideoOff } from "lucide-react";
import Tooltip from "@/components/ui/ToolTip";
import Layout from "@/components/Layout";
import ScreenshotComponent from "@/components/ui/Screenshotcomponent";
import Image from "next/image";
import toast from "react-hot-toast";
import Toast from "@/components/ui/Toast";
import CallingCard from "./_components/CallingCard";



export default function Index() {
  const [inCall, setInCall] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isRightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [takeScreenshot, setTakeScreenshot] = useState(false);
  const [screenshotImage, setScreenshotImage] = useState<string[]>([]);
  const [bookingId, setBookingId] = useState("");

  const handleFilterChange = (status: string) => {
    setFilter(status);
  };

  const filteredData = MockCardData.filter((card) => {
    if (filter === "all") return true;
    return card.status === filter;
  });

  const handleScreenshot = (image: string) => {
    setScreenshotImage((prevImages) =>
      prevImages ? [...prevImages, image] : [image]
    );
    setTakeScreenshot(false);
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = screenshotImage!.filter((_, i) => i !== index);
    setScreenshotImage(updatedImages);
  };

  const cancelScreenshot = () => {
    if (screenshotImage!.length > 0) {
      setTakeScreenshot(false);
    } else {
      setTakeScreenshot(false);
    }
  }

  const handleCallEnd = () => {
    if (screenshotImage!.length === 0) {
      return toast.custom((t: any) => (<Toast t={t} type="warning" content="No document(s) captured" />));
    }
    if (bookingId === "") {
      return toast.custom((t: any) => (<Toast t={t} type="warning" content="Booking ID is required" />));
    }

    setScreenshotImage([]);
    setTakeScreenshot(false);
    setBookingId("");
    setInCall(false);
    toast.custom((t: any) => (<Toast t={t} type="success" content="Document(s) submitted successfully" />));
  }

  return (
    <Layout headerTitle="CHECK-IN HUB" header={
      <div>
        {
          !isRightPanelCollapsed ? (
            <Tooltip tooltip="Close Panel" position="bottom">
              <div className="w-fit h-fit rounded-md flex items-center justify-center cursor-pointer" onClick={() => setRightPanelCollapsed(true)}>
                <PanelRightClose className="w-6 h-6" />
              </div>
            </Tooltip>
          ) : (
            <Tooltip tooltip="Open Panel" position="bottom">
              <div className="w-fit h-fit rounded-md flex items-center justify-center cursor-pointer" onClick={() => setRightPanelCollapsed(false)}>
                <PanelRightOpen className="w-6 h-6" />
              </div>
            </Tooltip>
          )
        }
      </div>}>
      <div className="w-full h-full flex">
        {/* Left Panel */}
        <div className={`h-[90.5vh] ${isRightPanelCollapsed ? 'w-full pr-0' : 'w-2/3'} transition-all duration-300 ease-in-out border-r-2 border-r-border pr-2`}>
          {inCall ? (
            <div className="w-full h-full bg-black rounded-md relative">
              {/* TODO: Implement Video Feed Below */}
              <div className="w-full h-full">
                <video
                  autoPlay
                  loop
                  className="w-full h-full object-cover rounded-md"
                  src="/videos/placeholder.mp4"
                />
              </div>

              {/* Screenshot Component */}
              {takeScreenshot && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-transparent">
                  <ScreenshotComponent onScreenshotTaken={handleScreenshot} cancelScreenshot={cancelScreenshot} />
                </div>
              )}
              {/* Toolbar */}
              <div className="w-fit h-16 bg-foreground absolute bottom-4 rounded-md left-1/2 transform -translate-x-1/2 flex space-x-2 items-center p-4">
                <div className="w-full flex space-x-2 border-r-2 border-r-border pr-2">
                  <Tooltip tooltip="Capture Document(s)">
                    <button className="w-fit rounded-md bg-highlight hover:bg-zinc-300 dark:hover:bg-zinc-700 px-4 py-2 flex items-center justify-center space-x-1"
                      onClick={() => { setTakeScreenshot(true) }}>
                      <FilePlus2 className="w-6 h-6" />
                    </button>
                  </Tooltip>
                </div>
                <div className="w-full flex space-x-2">
                  <Tooltip tooltip={micMuted ? "Unmute Mic" : "Mute Mic"}>
                    <button className={micMuted ? "bg-orange-500 hover:bg-orange-700 duration-300 w-fit rounded-md bg-foreground px-4 py-2 flex items-center justify-center space-x-1" : "w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 duration-300"} onClick={() => {
                      setMicMuted(!micMuted)
                    }}>
                      <MicOff className="w-6 h-6" />
                    </button>
                  </Tooltip>
                  <Tooltip tooltip={cameraOff ? "Turn On Camera" : "Turn Off Camera"}>
                    <button className={cameraOff ? "bg-orange-500 hover:bg-orange-700 duration-300 w-fit rounded-md bg-foreground px-4 py-2 flex items-center justify-center space-x-1" : "w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 duration-300"} onClick={() => {
                      setCameraOff(!cameraOff)
                    }}>
                      <VideoOff className="w-6 h-6" />
                    </button>
                  </Tooltip>
                  <Tooltip tooltip="Hold Call">
                    <button className="w-fit rounded-md bg-highlight hover:bg-zinc-300 dark:hover:bg-zinc-700 px-4 py-2 flex items-center justify-center space-x-1 duration-300" onClick={handleCallEnd}>
                      <Pause className="w-6 h-6" />
                    </button>
                  </Tooltip>
                  <Tooltip tooltip="End Call">
                    <button className="w-fit rounded-md bg-red-500 hover:bg-red-700 duration-300 px-4 py-2 flex items-center justify-center space-x-1" onClick={handleCallEnd}>
                      <PhoneOff className="w-6 h-6" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-foreground rounded-md mb-20 p-4 flex flex-col space-y-4 justify-center items-center">
              <div>
                <h1 className="font-bold text-2xl text-textAlt">Not In Call</h1>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className={`transition-all duration-300 ease-in-out ${isRightPanelCollapsed ? 'w-20' : 'w-1/3 pl-2'} h-[90.5vh]`}>
          {/* Summary Section */}
          {!isRightPanelCollapsed && (
            <div className="w-full h-full flex flex-col space-y-2 overflow-hidden">
              <div className="w-full border-b-2 border-b-border pb-2 flex space-x-4">
                <div
                  className={`w-full bg-green-500/30 hover:bg-green-500/50 duration-300 rounded-md p-2 py-0.5 cursor-pointer border-2 ${filter === "all" ? "border-green-500" : "border-transparent"}`}
                  onClick={() => handleFilterChange("all")}
                >
                  <div className="flex space-x-2 items-center">
                    <div className="border-r-2 border-r-green-500 pr-2">
                      <Phone className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h1 className="w-fit text-xs font-bold rounded text-green-500">ALL CALLS</h1>
                      <h1 className="font-bold text-2xl">12</h1>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full bg-indigo-500/30 hover:bg-indigo-500/50 duration-300 rounded-md p-2 py-0.5 cursor-pointer border-2 ${filter === "hold" ? "border-indigo-500" : "border-transparent"}`}
                  onClick={() => handleFilterChange("hold")}
                >
                  <div className="flex space-x-2 items-center">
                    <div className="border-r-2 border-r-indigo-500 pr-2">
                      <Pause className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h1 className="w-fit text-xs font-bold rounded text-indigo-500">ON HOLD</h1>
                      <h1 className="font-bold text-2xl">6</h1>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full bg-orange-500/30 hover:bg-orange-500/50 duration-300 rounded-md p-2 py-0.5 cursor-pointer border-2 ${filter === "incoming" ? "border-orange-500" : "border-transparent"}`}
                  onClick={() => handleFilterChange("incoming")}
                >
                  <div className="flex space-x-2 items-center">
                    <div className="border-r-2 border-r-orange-500 pr-2">
                      <PhoneIncoming className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h1 className="w-fit text-xs font-bold rounded text-orange-500">INCOMING</h1>
                      <h1 className="font-bold text-2xl">6</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`w-full ${inCall ? "h-1/2" : "h-full"} overflow-y-auto`}>
                {/* Grid Section */}
                <div className={`w-full h-full pb-2 grid grid-cols-2 gap-2 auto-rows-min overflow-x-hidden`}>
                  {/* Show Incoming and On Hold Calls in 2 columns when filter is "all" */}
                  {filter === "all" && (
                    <>
                      {(() => {
                        const incomingCalls = MockCardData.filter((card) => card.status === "incoming");
                        const holdCalls = MockCardData.filter((card) => card.status === "hold");

                        const interleavedCalls: typeof MockCardData = [];
                        const maxLength = Math.max(incomingCalls.length, holdCalls.length);

                        for (let i = 0; i < maxLength; i++) {
                          if (i < incomingCalls.length) interleavedCalls.push(incomingCalls[i]);
                          if (i < holdCalls.length) interleavedCalls.push(holdCalls[i]);
                        }

                        return interleavedCalls.length > 0 ? (
                          interleavedCalls.map((card, index) => (
                            <CallingCard
                              key={index}
                              title={card.title}
                              status={card.status}
                              setInCall={setInCall}
                            />
                          ))
                        ) : (
                          <div className="col-span-full w-full rounded-md border-2 border-dashed border-border p-4">
                            <h1 className="text-center text-xl text-textAlt font-bold">No Calls Available</h1>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {filter !== "all" && (
                    filteredData.length > 0 ? (
                      filteredData.map((card, index) => (
                        <CallingCard key={index} title={card.title} status={card.status} setInCall={setInCall} />
                      ))
                    ) : (
                      <div className="w-full rounded-md border-2 border-dashed border-border p-4">
                        <h1 className="text-center text-xl text-textAlt font-bold">No Calls Available</h1>
                      </div>
                    )
                  )}
                </div>
              </div>
              {inCall && (
                <div className="w-full h-full max-h-[50%] flex flex-col justify-between items-center border-t-2 border-t-border">
                  <div className="w-full h-full flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
                    <div className="w-full flex justify-start items-center py-1">
                      <h1 className="font-bold text-xl">Captured Documents</h1>
                    </div>
                    {/* Image Grid Container */}
                    {screenshotImage.length > 0 ? (
                      <div className="w-full h-full flex flex-col justify-start items-center">
                        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-center items-start">
                          {screenshotImage.map((image, index) => (
                            <div key={index} className="flex justify-center relative">
                              <Image
                                width={1000}
                                height={1000}
                                src={image}
                                alt="Captured Document"
                                className="max-w-full max-h-[80vh] object-contain rounded-md"
                              />
                              <Tooltip tooltip="Delete Document" position="top">
                                <button
                                  className="absolute top-0 right-0"
                                  onClick={() => handleDeleteImage(index)}
                                >
                                  <CircleX className="w-5 h-5 text-red-500" />
                                </button>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col space-y-4 justify-center items-center pb-2">
                        <h1 className="font-bold text-xl text-textAlt">No Document Captured</h1>
                      </div>
                    )
                    }
                  </div>
                  <div className="w-full h-fit flex items-center gap-2 border-t-2 border-t-border pt-2">
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Booking ID"
                        className="w-full p-2 rounded-md border-2 border-border bg-foreground outline-none text-text font-semibold"
                        onChange={(e) => setBookingId(e.target.value)}
                        value={bookingId}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {isRightPanelCollapsed && (
            <div className="w-full h-full flex flex-col space-y-4 justify-start items-center px-2">
              <div className="w-full h-fit flex flex-col space-y-2 border-b-2 border-b-border pb-2">
                <Tooltip tooltip="All Calls" position="left">
                  <div className="w-full h-fit bg-green-500/30 hover:bg-green-500/50 duration-300 p-2 rounded-md flex space-x-1 justify-center items-center cursor-pointer" onClick={() => {
                    setRightPanelCollapsed(false);
                    handleFilterChange("all");
                  }}>
                    <Phone className="w-5 h-5 text-green-500" />
                    <h1 className="font-bold text-xl">12</h1>
                  </div>
                </Tooltip>
                <Tooltip tooltip="On Hold" position="left">
                  <div className="w-full h-fit bg-indigo-500/30 hover:bg-indigo-500/50 duration-300 p-2 rounded-md flex space-x-2 justify-center items-center cursor-pointer" onClick={() => {
                    setRightPanelCollapsed(false);
                    handleFilterChange("hold");
                  }}>
                    <Pause className="w-5 h-5 text-indigo-500" />
                    <h1 className="font-bold text-xl">6</h1>
                  </div>
                </Tooltip>
                <Tooltip tooltip="Incoming" position="left">
                  <div className="w-full h-fit bg-orange-500/30 hover:bg-orange-500/50 duration-300 p-2 rounded-md flex space-x-2 justify-center items-center cursor-pointer" onClick={() => {
                    setRightPanelCollapsed(false);
                    handleFilterChange("incoming");
                  }}>
                    <PhoneIncoming className="w-5 h-5 text-orange-500" />
                    <h1 className="font-bold text-xl">6</h1>
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
