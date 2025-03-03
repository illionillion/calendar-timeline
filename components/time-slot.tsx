interface TimeSlotProps {
  hour: number
}

export function TimeSlot({ hour }: TimeSlotProps) {

  return (
    <div className="h-[60px] relative flex items-start justify-center pt-1 text-sm text-gray-500">
      {`${hour}時`}
    </div>
  )
}

