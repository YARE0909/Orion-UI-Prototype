/* eslint-disable @typescript-eslint/no-unused-vars */
import MockCardData from "../../../mock/watchListMock.json";
import { MapPinPlus } from "lucide-react";
import Tooltip from "@/components/ui/ToolTip";
import Layout from "@/components/Layout";
import WatchCard from "./_components";


export default function Index() {
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <Layout headerTitle="WATCH CENTER" header={
      <div>
        <Tooltip tooltip="Add Location" position="bottom">
          <div>
            <MapPinPlus />
          </div>
        </Tooltip>
      </div>}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-stretch">
        {MockCardData.map((card, index) => (
          <WatchCard key={index} title={card.title} src="/videos/placeholder.mp4" />
        ))}
      </div>
    </Layout>
  );
}
