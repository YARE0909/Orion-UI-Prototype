/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import MockCardData from "../../mock/watchListMock.json";
import { PhoneOutgoing } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WatchCard({ title, src }: { title: string, src?: any }) {
  const router = useRouter();

  return (
    <div className="w-full h-56 flex flex-col space-y-4 bg-highlight rounded-lg p-1">
      <div className="w-full h-full bg-background flex items-center justify-center rounded-lg relative">
        <video
          src="/videos/placeholder.mp4"
          width={1000}
          height={1000}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover rounded-md"
        />

        <div className="w-full flex justify-between items-center absolute top-0 left-0 px-2 py-2 bg-black/70">
          <div>
            <h1 className="font-bold text-lg">{title}</h1>
          </div>
          <div className="bg-green-500 rounded-md py-1 px-4 cursor-pointer" onClick={() => router.push("/call")} >
            <PhoneOutgoing className="w-5 h-5 font-bold text-text" />
            {/* <button className="rounded-md px-4 py-1 bg-green-500 font-bold" onClick={() => router.push("/call")}>Connect</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Index() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-2 space-y-4">
      <div className="w-full border-b-2 border-b-border py-2">
        <h1 className="font-bold text-2xl">WATCH CENTER</h1>
      </div>
      <div className="w-full h-full overflow-y-auto pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-stretch">
        {MockCardData.map((card, index) => (
          <WatchCard key={index} title={card.title} />
        ))}
      </div>
    </div>
  );
}
