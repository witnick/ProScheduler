import React from "react";
import {
	CalendarDate,
	isToday,
	getLocalTimeZone,
} from "@internationalized/date";
import {
	DateValue,
	mergeProps,
	useCalendarCell,
	useFocusRing,
} from "react-aria";
import { CalendarState } from "react-stately";
import { cn } from "@/lib/utils";

interface ICalendarCell {
	state: CalendarState;
	date: CalendarDate;
	currentMonth: CalendarDate;
	isUnavailable?: boolean;
}
const CalendarCell = ({
	state,
	date,
	currentMonth,
	isUnavailable,
}: ICalendarCell) => {
	const ref = React.useRef(null);
	const {
		cellProps,
		buttonProps,
		isSelected,
		isOutsideVisibleRange,
		isDisabled,
		// isUnavailable,
		formattedDate,
	} = useCalendarCell({ date }, state, ref);

	const { focusProps, isFocusVisible } = useFocusRing();
	const isDateToday = isToday(date, getLocalTimeZone());
	const finallyIsDisabled = isDisabled || isUnavailable;
	return (
		<td
			className={`py-0.5 px-0.5 relative ${
				isFocusVisible ? "z-10" : "z-0"
			}`}
			{...cellProps}>
			<div
				{...mergeProps(buttonProps, focusProps)}
				hidden={isOutsideVisibleRange}
				ref={ref}
				className="size-10 sm:size-12 outline-none group">
				<div
					className={cn(
						"size-full flex items-center justify-center text-sm font-semibold rounded-xl",
						isSelected ? "bg-primary text-white" : "",
						finallyIsDisabled
							? "text-muted-foreground cursor-not-allowed"
							: "",
						!isSelected && !finallyIsDisabled
							? "bg-secondary "
							: "",
						isDateToday ? "underline" : ""
					)}>
					{formattedDate}
					{isDateToday && (
						<div
							className={cn(
								"absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-primary rounded-full",
								isSelected && "bg-white"
							)}
						/>
					)}
				</div>
			</div>
		</td>
	);
};

export default CalendarCell;
