"use client";
import React from "react";
import { useCalendar, useLocale } from "react-aria";
import { CalendarProps, DateValue } from "@react-types/calendar";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import { Button } from "@/components/ui/button";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";

const Calendar = (
	props: CalendarProps<DateValue> & {
		isDateUnavailable?: (date: DateValue) => boolean;
	}
) => {
	const { locale } = useLocale();
	const state = useCalendarState({
		...props,
		visibleDuration: { months: 1 },
		locale,
		createCalendar,
	});

	const { calendarProps, prevButtonProps, nextButtonProps, title } =
		useCalendar(props, state);

	return (
		<div className="inline-block items-center justify-center">
			<div {...calendarProps} className="calendar">
				<CalendarHeader
					prevButtonProps={prevButtonProps}
					nextButtonProps={nextButtonProps}
					state={state}
					calendarProps={calendarProps}
				/>
				<CalendarGrid
					state={state}
					isDateUnavailable={props.isDateUnavailable}
				/>
			</div>
		</div>
	);
};

export default Calendar;
