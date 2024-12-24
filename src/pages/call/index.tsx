/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import MockCardData from "../../../mock/watchListMock.json";
import { CameraOff, CirclePause, Disc2, MicOff, PanelLeftClose, PanelRightClose, Phone, PhoneIncoming, PhoneOff } from "lucide-react";

function CallingCard({ title, status, setInCall }: { title: string, status: string, setInCall: any }) {
  return (
    <div className="w-full h-full bg-highlight rounded-lg p-4 flex flex-col space-y-2 justify-between">
      <div className="w-full flex justify-between border-b-2 border-b-border pb-1">
        <div>
          {
            status === "incoming" && (
              <h1 className="w-fit text-[0.65rem] font-bold rounded bg-orange-500/30 text-orange-500 px-2">
                INCOMING CALL
              </h1>
            )
          }
          {
            status === "active" && (
              <h1 className="w-fit text-[0.65rem] font-bold rounded bg-green-500/30 text-green-500 px-2">
                ACTIVE
              </h1>
            )
          }
          {
            status === "hold" && (
              <h1 className="w-fit text-[0.65rem] font-bold rounded bg-blue-500/30 text-blue-500 px-2">
                ON HOLD
              </h1>
            )
          }
          <h1 className="font-bold">{title}</h1>
        </div>
        <div>
          <h1 className="w-fit text-[0.65rem] font-bold rounded bg-white/20 text-white px-2">00:00</h1>
        </div>
      </div>
      <div className="w-full flex space-x-2">
        {
          status === "hold" ? (
            <div className="w-full flex justify-center space-x-2">
              <button className="w-full h-fit whitespace-nowrap rounded-md px-4 py-1 bg-green-500 font-bold text-sm justify-center items-center flex" onClick={() => setInCall(true)}>
                <Phone className="w-4 h-4" />
              </button>
              <button className="w-full h-fit whitespace-nowrap rounded-md px-4 py-1 bg-red-500 font-bold text-sm justify-center items-center flex" onClick={() => setInCall(false)}>
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full flex space-x-2">
              <button className="w-full h-fit whitespace-nowrap rounded-md px-4 py-1 bg-green-500 font-bold text-sm justify-center items-center flex" onClick={() => setInCall(true)}>
                <Phone className="w-4 h-4" />
              </button>
              <button className="w-full h-fit whitespace-nowrap rounded-md px-4 py-1 bg-red-500 font-bold text-sm justify-center items-center flex" onClick={() => setInCall(false)}>
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default function Index() {
  const [inCall, setInCall] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isRightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // Handle filter change
  const handleFilterChange = (status: string) => {
    setFilter(status);
  };

  // Filter the MockCardData based on the selected status
  const filteredData = MockCardData.filter((card) => {
    if (filter === "all") return true;
    return card.status === filter;
  });

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-2 space-y-4">
      <div className="w-full border-b-2 border-b-border py-2 flex justify-between items-center px-2">
        <h1 className="font-bold text-2xl">CALL MANAGER</h1>
        <button
          onClick={() => setRightPanelCollapsed(!isRightPanelCollapsed)}
        >
          {isRightPanelCollapsed ? <PanelLeftClose /> : <PanelRightClose />}
        </button>
      </div>
      <div className="w-full h-full flex">
        {/* Left Panel */}
        <div className={`h-[90vh] ${isRightPanelCollapsed ? 'w-full pr-0' : 'w-2/3 border-r-2 border-r-border'} transition-all duration-300 ease-in-out`}>
          {inCall ? (
            <div className="w-full h-full bg-black relative">
              <div className="w-fit h-16 bg-foreground absolute bottom-4 rounded-md left-1/2 transform -translate-x-1/2 flex space-x-2 items-center p-4">
                <div className="w-full flex space-x-2 border-r-2 border-r-border pr-2">
                  <button className="w-32 rounded-md bg-red-500 px-4 py-2 flex items-center justify-center space-x-1" onClick={() => setInCall(false)}>
                    <PhoneOff className="w-6 h-6" />
                    <h1 className="font-bold whitespace-nowrap">End Call</h1>
                  </button>
                  <button className="w-32 rounded-md bg-blue-500 px-4 py-2 flex items-center justify-center space-x-1" onClick={() => setInCall(false)}>
                    <CirclePause className="w-6 h-6" />
                    <h1 className="font-bold whitespace-nowrap">Hold</h1>
                  </button>
                  <button className="w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1">
                    <Disc2 className="w-6 h-6" />
                    <h1 className="font-bold whitespace-nowrap">Capture Document</h1>
                  </button>
                </div>
                <div className="w-full flex space-x-2">
                  <button className={micMuted ? "bg-orange-500 w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1" : "w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1"} onClick={() => {
                    setMicMuted(!micMuted)
                  }}>
                    <MicOff className="w-6 h-6" />
                  </button>
                  <button className={cameraOff ? "bg-orange-500 w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1" : "w-fit rounded-md bg-highlight px-4 py-2 flex items-center justify-center space-x-1"} onClick={() => {
                    setCameraOff(!cameraOff)
                  }}>
                    <CameraOff className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full mb-20 rounded-lg p-4 flex flex-col space-y-4 justify-center items-center">
              <div className="p-4 border-2 border-dashed border-border rounded-md">
                <h1 className="font-bold text-2xl text-textAlt">No Active Calls</h1>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className={`transition-all duration-300 ease-in-out ${isRightPanelCollapsed ? 'w-0' : 'w-1/3 px-2'} h-full flex flex-col space-y-4 overflow-hidden`}>
          {/* Summary Section */}
          <div className="w-full border-b-2 border-b-border pb-2 flex space-x-4">
            <div
              className={`w-full bg-green-500/30 rounded-md p-2 cursor-pointer border-2 ${filter === "all" ? "border-green-500" : "border-transparent"}`}
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
              className={`w-full bg-blue-500/30 rounded-md p-2 cursor-pointer border-2 ${filter === "hold" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => handleFilterChange("hold")}
            >
              <div className="flex space-x-2 items-center">
                <div className="border-r-2 border-r-blue-500 pr-2">
                  <CirclePause className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="w-fit text-xs font-bold rounded text-blue-500">ON HOLD</h1>
                  <h1 className="font-bold text-2xl">6</h1>
                </div>
              </div>
            </div>
            <div
              className={`w-full bg-orange-500/30 rounded-md p-2 cursor-pointer border-2 ${filter === "incoming" ? "border-orange-500" : "border-transparent"}`}
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

          {/* Grid Section */}
          <div className="w-full h-full overflow-y-auto pb-16 grid grid-cols-2 gap-2 auto-rows-min">
            {/* Show Incoming and On Hold Calls in 2 columns when filter is "all" */}
            {filter === "all" && (
              <>
                {/* Incoming Calls */}
                <div className="flex flex-col space-y-2">
                  {MockCardData.filter((card) => card.status === "incoming").length > 0 ? (
                    MockCardData.filter((card) => card.status === "incoming").map((card, index) => (
                      <CallingCard
                        key={index}
                        title={card.title}
                        status={card.status}
                        setInCall={setInCall}
                      />
                    ))
                  ) : (
                    <div className="w-full rounded-md border-2 border-dashed border-border p-4">
                      <h1 className="text-center text-xl text-textAlt font-bold">No Incoming Calls</h1>
                    </div>
                  )}
                </div>

                {/* On Hold Calls */}
                <div className="flex flex-col space-y-2">
                  {MockCardData.filter((card) => card.status === "hold").length > 0 ? (
                    MockCardData.filter((card) => card.status === "hold").map((card, index) => (
                      <CallingCard
                        key={index}
                        title={card.title}
                        status={card.status}
                        setInCall={setInCall}
                      />
                    ))
                  ) : (
                    <div className="w-full rounded-md border-2 border-dashed border-border p-4">
                      <h1 className="text-center text-xl text-textAlt font-bold">No Calls On Hold</h1>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* For other filters (hold, incoming, etc.) */}
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
      </div>
    </div>
  );
}
