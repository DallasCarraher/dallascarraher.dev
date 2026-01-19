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
      <Popover
        state={popover}
        className="max-w-[min(calc(100vw-16px),320px)] z-50 flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-gray-900 dark:text-white shadow-lg dark:shadow-2xl"
      >
        <PopoverArrow className="[&_svg]:fill-white [&_svg]:stroke-gray-200 dark:[&_svg]:fill-gray-800 dark:[&_svg]:stroke-gray-700" />
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
