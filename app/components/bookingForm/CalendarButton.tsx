import React, { useRef } from "react";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { CalendarState } from "@react-stately/calendar";
import { Button } from "@/components/ui/button";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";

const CalendarButton = (
	props: AriaButtonProps<"button"> & {
		state?: CalendarState;
		side?: "left" | "right";
	}
) => {
	const ref = useRef(null);
	const { buttonProps } = useButton(props, ref);
	const { focusProps: focusProps } = useFocusRing();
	return (
		<Button
			variant={"outline"}
			size={"icon"}
			ref={ref}
			disabled={props.isDisabled}
			{...mergeProps(buttonProps, focusProps)}>
			{props.children}
		</Button>
	);
};

export default CalendarButton;
