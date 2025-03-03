"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  date: Date
  setDate: (date: Date) => void
  minTime?: Date
}

export function TimePicker({ date, setDate, minTime }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const [selectedHour, setSelectedHour] = React.useState(date.getHours())
  const [selectedMinute, setSelectedMinute] = React.useState(date.getMinutes())

  const updateDate = (hour: number, minute: number) => {
    const newDate = new Date(date)
    newDate.setHours(hour, minute)
    setDate(newDate)
  }

  React.useEffect(() => {
    setSelectedHour(date.getHours())
    setSelectedMinute(date.getMinutes())
  }, [date])

  const isDisabled = (hour: number, minute: number) => {
    if (!minTime) return false
    if (hour < minTime.getHours()) return true
    if (hour === minTime.getHours() && minute < minTime.getMinutes()) return true
    return false
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? (
            date.toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          ) : (
            <span>時間を選択</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-auto w-[280px] flex-col justify-between py-2">
          <div className="flex justify-center p-2">
            <div className="flex items-center space-x-2">
              <Select
                value={selectedHour.toString()}
                onValueChange={(value) => {
                  const hour = Number.parseInt(value)
                  setSelectedHour(hour)
                  updateDate(hour, selectedMinute)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="時" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()} disabled={isDisabled(hour, selectedMinute)}>
                      {hour.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-lg">:</span>
              <Select
                value={selectedMinute.toString()}
                onValueChange={(value) => {
                  const minute = Number.parseInt(value)
                  setSelectedMinute(minute)
                  updateDate(selectedHour, minute)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="分" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute.toString()} disabled={isDisabled(selectedHour, minute)}>
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

