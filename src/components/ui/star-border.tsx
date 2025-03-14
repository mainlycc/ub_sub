import { cn } from "@/lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button"
  const defaultColor = color || "hsl(var(--foreground))"

  return (
    <Component 
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px]",
        className
      )} 
      {...props}
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-70" 
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 25%)`,
          backgroundSize: "15px 15px",
          animationDuration: speed,
          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.2))"
        }}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 25%)`,
          backgroundSize: "15px 15px",
          animationDuration: speed,
          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.2))"
        }}
      />
      <div className={cn(
        "relative z-1 text-center text-base py-0 px-0 rounded-[20px]",
      )}>
        {children}
      </div>
    </Component>
  )
}