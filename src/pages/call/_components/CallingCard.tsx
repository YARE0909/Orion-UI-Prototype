/* eslint-disable @typescript-eslint/no-explicit-any */
import Tooltip from "@/components/ui/ToolTip";
import { Phone, Play } from "lucide-react";

export default function CallingCard({ title, status, setInCall }: { title: string, status: string, setInCall: any }) {
  return (
    <div className="w-full h-full bg-foreground rounded-lg p-4 flex flex-col space-y-2 justify-between">
      <div className="w-full flex flex-col gap-2 justify-between pb-1">
        <div className="w-full flex justify-between space-x-3 border-b-2 border-b-border pb-2">
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
                <h1 className="w-fit text-[0.65rem] font-bold rounded bg-indigo-500/30 text-indigo-500 px-2">
                  ON HOLD
                </h1>
              )
            }
          </div>
          <div>
            <h1 className="w-fit text-[0.65rem] font-bold rounded bg-highlight text-text px-2">00:00</h1>
          </div>
        </div>
        <div className="h-fit flex justify-between items-start space-x-3">
          <div>
            <h1 className="font-bold">{title}</h1>
          </div>
          <div>
            <Tooltip tooltip={
              status === "incoming" ? "Accept Call" : "Resume Call"
            } position="bottom">
              <button className={`w-fit h-fit whitespace-nowrap rounded-md ${status === "incoming" ? "bg-green-500/30 hover:bg-green-500/50 border-2 border-green-500" : "bg-indigo-500/30 hover:bg-indigo-500/50 border-2 border-indigo-500"
                } duration-300 font-bold text-sm justify-center items-center flex px-4 py-1`} onClick={() => setInCall(true)}>
                {status === "incoming" ?
                  <Phone className="w-4 h-4" /> :
                  <Play className="w-4 h-4" />
                }
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}