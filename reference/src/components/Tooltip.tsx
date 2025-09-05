import { ReactNode } from 'react'
import {
  Tooltip as AriaTooltip,
  TooltipAnchor,
  useTooltipState,
} from 'ariakit/tooltip'

type BasePlacement = 'top' | 'bottom' | 'left' | 'right'
type Placement =
  | BasePlacement
  | `${BasePlacement}-start`
  | `${BasePlacement}-end`

interface ITooltip {
  children: string | ReactNode
  content: string | ReactNode
  placement: Placement
}

export function Tooltip({ children, content, placement }: ITooltip) {
  const tooltip = useTooltipState({ placement })
  return (
    <>
      <TooltipAnchor state={tooltip}>{children}</TooltipAnchor>
      <AriaTooltip state={tooltip} className="rounded-sm bg-hsl(204, 20%, 94%)">
        {content}
      </AriaTooltip>
    </>
  )
}
