import { Button } from 'ariakit/button'
import {
  Popover,
  PopoverArrow,
  PopoverDescription,
  PopoverDisclosure,
  PopoverHeading,
  usePopoverState,
} from 'ariakit/popover'
import styles from './Expand.module.css'

interface IExpandProps {
  children: React.ReactNode
  heading?: string | React.ReactNode
  description?: string | React.ReactNode
  body?: string | React.ReactNode
  actionText?: string | React.ReactNode
  action?: () => void | Promise<void>
}

export const Expand = ({
  children,
  heading,
  description,
  body,
  action = () => {},
  actionText,
}: IExpandProps) => {
  const popover = usePopoverState()

  const handleAction = async () => {
    await action()
    popover.hide()
  }

  return (
    <>
      <PopoverDisclosure state={popover} className={styles['underline']}>
        {children}
      </PopoverDisclosure>
      <Popover state={popover} className={styles['popover']}>
        <PopoverArrow className={styles['arrow']} />
        <PopoverHeading className={styles['heading']}>{heading}</PopoverHeading>
        <PopoverDescription>{description}</PopoverDescription>
        {body}
        <Button className={styles['button']} onClick={handleAction}>
          {actionText || 'Close'}
        </Button>
      </Popover>
    </>
  )
}
