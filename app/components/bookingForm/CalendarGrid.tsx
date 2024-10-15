import React from "react";
import { DateValue, useCalendarGrid, useLocale } from "react-aria";
import {
	DateDuration,
	getWeeksInMonth,
	endOfMonth,
} from "@internationalized/date";
import CalendarCell from "./CalendarCell";
import { CalendarState } from "react-stately";

interface ICalendarGrid {
	state: CalendarState;
	offset?: DateDuration;
	isDateUnavailable?: (date: DateValue) => boolean;
}
const CalendarGrid = ({
	state,
	offset = {},
	isDateUnavailable,
}: ICalendarGrid) => {
	const startDate = state.visibleRange.start.add(offset);
	const endDate = endOfMonth(startDate);
	const { locale } = useLocale();
	const { gridProps, headerProps, weekDays } = useCalendarGrid(
		{
			startDate,
			endDate,
			weekdayStyle: "short",
		},
		state
	);

	// Get the number of weeks in the month so we can render the proper number of rows.
	const weeksInMonth = getWeeksInMonth(startDate, locale);

	return (
		<table {...gridProps} className="flex-1">
			<thead {...headerProps} className="tex-sm font-medium">
				<tr>
					{weekDays.map((day, index) => (
						<th key={index}>{day}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{[...new Array(weeksInMonth).keys()].map((weekIndex) => (
					<tr key={weekIndex}>
						{state
							.getDatesInWeek(weekIndex)
							.map((date, i) =>
								date ? (
									<CalendarCell
										key={i}
										state={state}
										date={date}
										currentMonth={startDate}
										isUnavailable={isDateUnavailable?.(
											date
										)}
									/>
								) : (
									<td key={i} />
								)
							)}
					</tr>
				))}
			</tbody>
		</table>
	);
};
export default CalendarGrid;
