import { Button } from './Button';
import {
  Popover,
  PopoverArrow,
  PopoverDescription,
  PopoverDisclosure,
  PopoverHeading,
  usePopoverState,
} from 'ariakit';

export interface ExpandProps {
  children: React.ReactNode;
  heading?: string | React.ReactNode;
  description?: string | React.ReactNode;
  body?: string | React.ReactNode;
  actionText?: string | React.ReactNode;
  action?: () => void | Promise<void>;
}

export const Expand = ({
  children,
  heading,
  description,
  body,
  action = () => { },
  actionText,
}: ExpandProps) => {
  const popover = usePopoverState();

  const handleAction = async () => {
    await action();
    popover.hide();
  };

  return (
    <>
      <PopoverDisclosure state={popover} className="hover:underline cursor-pointer">
        {children}
      </PopoverDisclosure>
      <Popover state={popover} className="popover-content">
        <PopoverArrow className="popover-arrow" />
        <PopoverHeading className="font-medium text-xl mb-2">{heading}</PopoverHeading>
        <PopoverDescription>{description}</PopoverDescription>
        {body}
        <Button className="mt-4 w-full" onClick={handleAction}>
          {actionText || 'Close'}
        </Button>
      </Popover>
    </>
  );
};
