import { Calendar, Clock, User } from "lucide-react";

interface CallCardProps {
  name: string;
  date: string;
  time: string;
  ticket: string;
  onClick?: () => void;
}

export default function CallCard({
  name,
  date,
  time,
  ticket,
  onClick,
}: CallCardProps) {
  return (
    <div className='w-full h-fit flex flex-col gap-2 bg-background border border-border hover:bg-foreground duration-300 p-2 rounded-md cursor-pointer' onClick={onClick}>
      <div>
        <div>
          <h1 className='font-bold'>{ticket}</h1>
        </div>
        <div className="w-full flex flex-col gap-1 justify-between">
          <div className="w-full flex items-center gap-1 justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 text-textAlt" />
              <h1 className="font-semibold text-sm text-textAlt">{date}</h1>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 text-textAlt" />
              <h1 className="font-semibold text-sm text-textAlt">{time}</h1>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 text-textAlt" />
              <h1 className="font-semibold text-sm text-textAlt">{name}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}