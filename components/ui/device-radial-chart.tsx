"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A radial chart with a label"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "oklch(0.646 0.222 41.116)" },
  { browser: "safari", visitors: 200, fill: "oklch(0.7 0.222 41.116)" },
  { browser: "firefox", visitors: 187, fill: "oklch(0.75 0.222 41.116)" },
  { browser: "edge", visitors: 173, fill: "oklch(0.8 0.222 41.116)" },
  { browser: "other", visitors: 90, fill: "oklch(0.85 0.222 41.116)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "oklch(0.646 0.222 41.116)",
  },
  safari: {
    label: "Safari",
    color: "oklch(0.7 0.222 41.116)",
  },
  firefox: {
    label: "Firefox",
    color: "oklch(0.75 0.222 41.116)",
  },
  edge: {
    label: "Edge",
    color: "oklch(0.8 0.222 41.116)"
  },
  other: {
    label: "Other",
    color: "oklch(0.85 0.222 41.116)",
  },
} satisfies ChartConfig

export function ChartRadialLabel() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={450}
            innerRadius="30%"
            outerRadius="100%"
            barSize={14}
            className="[&_.recharts-radial-bar-background-sector]:fill-muted"
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar 
              dataKey="visitors" 
              background
              label={{ 
                position: 'insideStart', 
                fill: '#fff',
                fontSize: 11,
                fontWeight: 'bold',
                stroke: '#000',
                strokeWidth: 0.5,
                paintOrder: 'stroke',
              }}
            >
              <LabelList
                dataKey="browser"
                position="insideStart"
                fill="#fff"
                className="font-medium capitalize"
                fontSize={10}
                offset={15}
                stroke="#000"
                strokeWidth={0.5}
                paintOrder="stroke"
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
