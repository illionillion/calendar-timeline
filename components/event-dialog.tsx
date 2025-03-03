"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TimePicker } from "@/components/ui/time-picker"

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  color: string
}

interface EventDialogProps {
  open: boolean
  onClose: () => void
  onSave: (eventData: { id?: number; title: string; color: string; start: Date; end: Date }) => void
  onDelete?: (id: number) => void
  startTime: Date
  endTime: Date
  colorOptions: string[]
  event?: Event | null
}

export function EventDialog({
  open,
  onClose,
  onSave,
  onDelete,
  startTime,
  endTime,
  colorOptions,
  event,
}: EventDialogProps) {
  console.log(event)
  const [title, setTitle] = useState(event?.title || "")
  const [selectedColor, setSelectedColor] = useState(event?.color || colorOptions[0])
  const [start, setStart] = useState(startTime)
  const [end, setEnd] = useState(endTime)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setSelectedColor(event.color)
      setStart(event.start)
      setEnd(event.end)
    } else {
      setTitle("")
      setSelectedColor(colorOptions[0])
      setStart(startTime)
      setEnd(endTime)
    }
  }, [event, colorOptions, startTime, endTime])

  const handleStartTimeChange = (newDate: Date) => {
    setStart(newDate)
    if (newDate > end) {
      setEnd(newDate)
    }
  }

  const handleEndTimeChange = (newDate: Date) => {
    setEnd(newDate)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: event?.id,
      title: title || "無題の予定",
      color: selectedColor,
      start: start,
      end: end,
    })
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "予定の編集" : "新しい予定"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                placeholder="予定のタイトルを入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label>開始時間</Label>
              <TimePicker date={start} setDate={handleStartTimeChange} />
            </div>
            <div className="grid gap-2">
              <Label>終了時間</Label>
              <TimePicker date={end} setDate={handleEndTimeChange} minTime={start} />
            </div>
            <div className="grid gap-2">
              <Label>カラー</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                {colorOptions.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={color} id={`color-${index}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${index}`}
                      className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                        selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                      } ${color.split(" ")[0]}`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            {event && onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                削除
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit">{event ? "更新" : "保存"}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

