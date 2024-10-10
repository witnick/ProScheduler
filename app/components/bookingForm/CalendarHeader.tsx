import React from "react";
import { type CalendarState } from "react-stately";
import { FocusableElement, DOMAttributes } from "@react-types/shared";
import { type AriaButtonProps } from "@react-aria/button";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import CalendarButton from "./CalendarButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ICalendarHeader {
	state: CalendarState;
	calendarProps: DOMAttributes<FocusableElement>;
	prevButtonProps: AriaButtonProps<"button">;
	nextButtonProps: AriaButtonProps<"button">;
}

const CalendarHeader = ({
	state,
	calendarProps,
	prevButtonProps,
	nextButtonProps,
}: ICalendarHeader) => {
	const monthDateFormatter = useDateFormatter({
		month: "short",
		year: "numeric",
		timeZone: state.timeZone,
	});

	const [monthName, _, year] = monthDateFormatter
		.formatToParts(state.visibleRange.start.toDate(state.timeZone))
		.map((part) => part.value);

	return (
		<>
			<div className="flex items-center pb-4">
				<VisuallyHidden>
					<h2>{calendarProps["aria-label"]}</h2>
				</VisuallyHidden>
			</div>

			<div className="flex items-center justify-between w-full">
				<CalendarButton {...prevButtonProps}>
					<ChevronLeft className="size-4" />
				</CalendarButton>
				<h2 className="font-semibold">
					{monthName}.{" "}
					<span className="text-muted-foreground text-sm font-medium">
						{year}
					</span>
				</h2>
				<CalendarButton {...nextButtonProps}>
					<ChevronRight className="size-4" />
				</CalendarButton>
			</div>
		</>
	);
};

export default CalendarHeader;
