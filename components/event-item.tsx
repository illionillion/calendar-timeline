import { cn } from "@/lib/utils"

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  color: string
  column: number
  totalColumns: number
}

interface EventItemProps {
  event: Event
  startHour: number
  onClick: () => void
}

export function EventItem({ event, startHour, onClick }: EventItemProps) {
  // イベントの開始時間と終了時間から位置と高さを計算
  const startMinutes = (event.start.getHours() - startHour) * 60 + event.start.getMinutes()
  const endMinutes = (event.end.getHours() - startHour) * 60 + event.end.getMinutes()
  const duration = endMinutes - startMinutes

  // 時間のフォーマット
  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  const columnWidth = 100 / event.totalColumns
  const left = event.column * columnWidth
  const width = columnWidth

  return (
    <div
      className={cn(
        "absolute z-10 rounded-md border p-2 shadow-sm select-none",
        "overflow-hidden text-sm cursor-pointer hover:brightness-95 transition-all",
        event.color,
      )}
      style={{
        top: `${startMinutes}px`,
        height: `${duration}px`,
        left: `${left}%`,
        width: `${width}%`,
        minWidth: "120px", // 最小幅を設定
      }}
      onClick={onClick}
      onTouchEnd={onClick}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs truncate">{`${formatTime(event.start)} - ${formatTime(event.end)}`}</div>
    </div>
  )
}

