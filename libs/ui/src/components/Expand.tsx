import * as stylex from "@stylexjs/stylex";
import { Button } from "./Button";
import { styles } from "./Expand.stylex";
import {
  Popover,
  PopoverArrow,
  PopoverDescription,
  PopoverDisclosure,
  PopoverHeading,
  usePopoverState,
} from "ariakit";

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
  action = () => {},
  actionText,
}: ExpandProps) => {
  const popover = usePopoverState();

  const handleAction = async () => {
    await action();
    popover.hide();
  };

  return (
    <>
      <PopoverDisclosure state={popover} {...stylex.props(styles.disclosure)}>
        {children}
      </PopoverDisclosure>
      <Popover state={popover} {...stylex.props(styles.popover)}>
        {/* PopoverArrow reads the popover's computed background-color/border-color
            to color itself, so it automatically tracks colors.popoverBg/popoverBorder
            above without any additional styling. */}
        <PopoverArrow />
        <PopoverHeading {...stylex.props(styles.heading)}>{heading}</PopoverHeading>
        <PopoverDescription>{description}</PopoverDescription>
        {body}
        <Button style={styles.actionButton} onClick={handleAction}>
          {actionText || "Close"}
        </Button>
      </Popover>
    </>
  );
};
