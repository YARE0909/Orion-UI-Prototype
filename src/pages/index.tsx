/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import MockCardData from "../../mock/watchListMock.json";
import { MapPinPlus, PhoneOutgoing, Trash } from "lucide-react";
import Select from "@/components/Select";
import { ThemeToggle } from "@/components/ThemeToggle";
import Tooltip from "@/components/ToolTip";

const options = [
  { label: "Add Center", value: "all" },
  { label: "Olive Banshankari", value: "banshankari" },
  { label: "Olive Indiranagar", value: "indiranagar" },
  { label: "Olive Koramangala", value: "koramangala" },
  { label: "Olive Marathahalli", value: "marathahalli" },
  { label: "Olive Whitefield", value: "whitefield" },
  { label: "Olive Yelahanka", value: "yelahanka" },
];

function WatchCard({ title, src }: { title: string; src?: any }) {
  const router = useRouter();

  return (
    <div className="w-full h-56 flex flex-col space-y-4 bg-highlight rounded-lg group">
      <div className="w-full h-full bg-background flex items-center justify-center rounded-lg relative">
        {src ? (
          <video
            src={src}
            width={1000}
            height={1000}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div>
            <h1 className="font-bold text-xl text-text">No Video Feed</h1>
          </div>
        )}
        {/* Header */}
        <div className="w-full h-8 flex justify-between items-center absolute top-0 left-0 px-2 py-2 bg-black/60 rounded-t-md">
          <div>
            <h1 className="font-bold text-lg text-white">{title}</h1>
          </div>
          <div className="flex space-x-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Tooltip tooltip="Call Center" position="bottom">
              <div
                className="bg-green-500 duration-300 w-fit h-fit rounded-md py-1 px-3 flex items-center cursor-pointer"
                onClick={() => router.push("/call")}
              >
                <PhoneOutgoing className="w-4 h-4 font-bold text-text" />
              </div>
            </Tooltip>
            <Tooltip tooltip="Remove Center" position="bottom">
              <div
                className="bg-red-500 duration-300 w-fit h-fit rounded-md py-1 px-3 flex items-center cursor-pointer"
              >
                <Trash className="w-4 h-4 font-bold text-text" />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };


  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-2 space-y-4">
      <div className="w-full border-b-2 border-b-border py-2 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">WATCH CENTER</h1>
        </div>
        <div className="flex items-center space-x-3 pr-4">
          <Tooltip tooltip="Add Center" position="bottom">
            <div>
              <MapPinPlus />
            </div>
          </Tooltip>
          <ThemeToggle />
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-stretch">
        {MockCardData.map((card, index) => (
          <WatchCard key={index} title={card.title} src="/videos/placeholder.mp4" />
        ))}
      </div>
    </div>
  );
}
