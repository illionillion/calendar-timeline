import { DayTimeline } from "@/components/day-timeline"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">1日のスケジュール</h1>
      <DayTimeline />
    </main>
  )
}

