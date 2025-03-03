"use client"

import { useState, useRef, useMemo, MouseEvent } from "react"
import { format, addDays, subDays } from "date-fns"
import { ja } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TimeSlot } from "@/components/time-slot"
import { EventItem } from "@/components/event-item"
import { cn } from "@/lib/utils"
import { EventDialog } from "@/components/event-dialog"

// サンプルイベントデータ
const initialEvents = [
  {
    id: 1,
    title: "朝のミーティング",
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 0, 0, 0)),
    color: "bg-blue-100 border-blue-300 text-blue-800",
  },
  {
    id: 2,
    title: "プロジェクト計画",
    start: new Date(new Date().setHours(11, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 30, 0, 0)),
    color: "bg-green-100 border-green-300 text-green-800",
  },
  {
    id: 3,
    title: "ランチ",
    start: new Date(new Date().setHours(12, 30, 0, 0)),
    end: new Date(new Date().setHours(13, 30, 0, 0)),
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
  },
  {
    id: 4,
    title: "クライアントミーティング",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    color: "bg-purple-100 border-purple-300 text-purple-800",
  },
  {
    id: 5,
    title: "週次レビュー",
    start: new Date(new Date().setHours(16, 0, 0, 0)),
    end: new Date(new Date().setHours(17, 0, 0, 0)),
    color: "bg-red-100 border-red-300 text-red-800",
  },
]

const timeSlots = Array.from({ length: 24 }, (_, i) => i)

// 色のオプション
const colorOptions = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-red-100 border-red-300 text-red-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
]

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  color: string
}

interface PositionedEvent extends Event {
  column: number
  totalColumns: number
}

export function DayTimeline() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [newEventTimes, setNewEventTimes] = useState<{ start: Date; end: Date } | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = useState(false)

  const handlePrevDay = () => {
    setSelectedDate((prev) => subDays(prev, 1))
  }

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1))
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  // マウスダウンでドラッグ開始
  const handleMouseDown = (e: MouseEvent) => {
    if (!timelineRef.current) return
    console.log("handleMouseDown")

    const rect = timelineRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top

    setIsDragging(true)
    setDragStart(y)
    setDragEnd(y)
  }

  // マウス移動でドラッグ中
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return
    console.log("handleMouseMove")

    const rect = timelineRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top

    setDragEnd(y)
  }

  // マウスアップでドラッグ終了
  const handleMouseUp = () => {
    if (!isClicked && isDragging && dragStart !== null && dragEnd !== null) {
      console.log("handleMouseUp")
      // ドラッグ範囲から時間を計算
      const startMinutes = Math.min(dragStart, dragEnd)
      const endMinutes = Math.max(dragStart, dragEnd)

      // 分単位に変換（1ピクセル = 1分と仮定）
      const startHour = Math.floor(startMinutes / 60)
      const startMin = Math.floor(startMinutes % 60)
      const endHour = Math.floor(endMinutes / 60)
      const endMin = Math.floor(endMinutes % 60)

      // 新しいイベントの開始時間と終了時間を設定
      const startDate = new Date(selectedDate)
      startDate.setHours(startHour, startMin, 0, 0)

      const endDate = new Date(selectedDate)
      endDate.setHours(endHour, endMin, 0, 0)

      // 最低15分の長さを確保
      if (endDate.getTime() - startDate.getTime() < 15 * 60 * 1000) {
        endDate.setTime(startDate.getTime() + 15 * 60 * 1000)
      }

      setNewEventTimes({ start: startDate, end: endDate })
      setShowEventDialog(true)
    }
    console.log("handleMouseUpEnd")
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
    setIsClicked(false)
  }

  // 新しいイベントを追加または既存のイベントを更新
  const handleSaveEvent = (eventData: { id?: number; title: string; color: string; start: Date; end: Date }) => {
    if (eventData.id) {
      // 既存のイベントを更新
      setEvents(events.map((event) => (event.id === eventData.id ? { ...event, ...eventData } : event)))
    } else {
      // 新しいイベントを追加
      const newEvent = {
        ...eventData,
        id: events.length + 1,
      }
      setEvents([...events, newEvent])
    }
    setShowEventDialog(false)
    setNewEventTimes(null)
    setEditingEvent(null)
  }

  // イベントの削除
  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id))
    setShowEventDialog(false)
    setEditingEvent(null)
  }

  // イベントクリック時の処理
  const handleEventClick = (event: Event) => {
    console.log("handleEventClick")
    setEditingEvent(event)
    setShowEventDialog(true)
    setIsClicked(true)
  }

  // ドラッグ選択範囲の表示スタイル
  const getDragSelectionStyle = () => {
    if (!isDragging || dragStart === null || dragEnd === null) return {}

    const top = Math.min(dragStart, dragEnd)
    const height = Math.abs(dragEnd - dragStart)

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  // イベントの重なりを検出し、位置を計算する関数
  const calculateEventPositions = (events: Event[]): PositionedEvent[] => {
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())
    const columns: PositionedEvent[][] = []

    sortedEvents.forEach((event) => {
      let placed = false
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        const lastEvent = column[column.length - 1]
        if (event.start >= lastEvent.end) {
          column.push({ ...event, column: i, totalColumns: columns.length + 1 })
          placed = true
          break
        }
      }
      if (!placed) {
        columns.push([{ ...event, column: columns.length, totalColumns: columns.length + 1 }])
      }
    })

    // totalColumnsを更新
    const flattenedEvents = columns.flat()
    flattenedEvents.forEach((event) => {
      event.totalColumns = columns.length
    })

    return flattenedEvents
  }

  // 位置計算を含むフィルタリングされたイベント
  const positionedEvents = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      )
    })
    return calculateEventPositions(filteredEvents)
  }, [events, selectedDate]) // Removed calculateEventPositions from dependencies

  // 最大の列数を計算
  const maxColumns = useMemo(() => {
    return Math.max(...positionedEvents.map((event) => event.totalColumns), 1)
  }, [positionedEvents])

  return (
    <div className="border rounded-lg shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前日</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">翌日</span>
          </Button>
          <h2 className="text-xl font-semibold ml-2 select-none">{format(selectedDate, "yyyy年M月d日 (EEEE)", { locale: ja })}</h2>
        </div>
        <Button className="select-none" variant="outline" onClick={handleToday}>
          今日
        </Button>
      </div>

      {/* タイムライン */}
      <div className="flex relative">
        {/* 時間表示カラム（固定） */}
        <div className="w-16 flex-shrink-0 border-r absolute left-0 top-0 bottom-0 bg-white z-10 select-none">
          {timeSlots.map((hour) => (
            <TimeSlot key={hour} hour={hour} />
          ))}
        </div>

        {/* スクロール可能なイベント表示エリア */}
        <div className="flex-grow overflow-x-auto hide-scrollbar ml-16">
          <div
            ref={timelineRef}
            className="relative"
            style={{
              minWidth: `${maxColumns * 180}px`,
              height: `${timeSlots.length * 60}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* 時間区切り線 */}
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className={cn("absolute w-full border-t border-gray-200", "h-[60px]")}
                style={{ top: `${hour * 60}px` }}
              >
                <div className="h-full w-full"></div>
              </div>
            ))}

            {/* イベント */}
            {positionedEvents.map((event) => (
              <EventItem key={event.id} event={event} startHour={0} onClick={() => handleEventClick(event)} />
            ))}

            {/* ドラッグ選択範囲 */}
            {isDragging && dragStart !== null && dragEnd !== null && (
              <div
                className="absolute left-1 right-1 bg-blue-100 opacity-50 border border-blue-300 rounded-md"
                style={getDragSelectionStyle()}
              />
            )}
          </div>
        </div>
      </div>

      {/* イベント作成/編集ダイアログ */}
      {showEventDialog && (newEventTimes || editingEvent) && (
        <EventDialog
          open={showEventDialog}
          onClose={() => {
            setShowEventDialog(false)
            setNewEventTimes(null)
            setEditingEvent(null)
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          startTime={editingEvent?.start || newEventTimes?.start || new Date()}
          endTime={editingEvent?.end || newEventTimes?.end || new Date()}
          colorOptions={colorOptions}
          event={editingEvent}
        />
      )}
    </div>
  )
}

