"use client"

import * as React from "react"
import { format, isValid, parse } from "date-fns"
import { pl } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function parseYmd(value: string): Date | undefined {
  if (!value) return undefined
  const d = parse(value, "yyyy-MM-dd", new Date())
  return isValid(d) ? d : undefined
}

interface VehicleFormDateFieldProps {
  id: string
  label: string
  value: string
  onChange: (ymd: string) => void
  error?: string
}

export function VehicleFormDateField({
  id,
  label,
  value,
  onChange,
  error,
}: VehicleFormDateFieldProps) {
  const [open, setOpen] = React.useState(false)
  const selected = parseYmd(value)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-amber-500"
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            {selected ? (
              format(selected, "d MMMM yyyy", { locale: pl })
            ) : (
              <span>Wybierz datę</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={pl}
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => {
              onChange(d ? format(d, "yyyy-MM-dd") : "")
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {error ? <p className="text-sm text-amber-800">{error}</p> : null}
    </div>
  )
}
