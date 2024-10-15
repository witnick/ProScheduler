import React from "react";
import {
	addMinutes,
	format,
	fromUnixTime,
	isAfter,
	isBefore,
	parse,
} from "date-fns";
import prisma from "@/app/lib/db";
import { Prisma } from "@prisma/client";
import { nylas } from "@/app/lib/nylas";
import { GetFreeBusyRequest, GetFreeBusyResponse, NylasResponse } from "nylas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slot } from "@radix-ui/react-slot";

interface ITimeTable {
	selectedDate: Date;
	username: string;
	duration: number;
}

const getData = async (username: string, selectedDate: Date) => {
	const currDay = format(selectedDate, "EEEE");

	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);

	const data = await prisma.availability.findFirst({
		where: {
			day: currDay as Prisma.EnumDayFilter,
			User: {
				userName: username,
			},
		},
		select: {
			fromTime: true,
			tillTime: true,
			id: true,
			User: {
				select: {
					grantEmail: true,
					grantId: true,
				},
			},
			isActive: true,
		},
	});

	const nylasCalendarData = await nylas.calendars.getFreeBusy({
		identifier: data?.User?.grantId as string,
		requestBody: {
			startTime: Math.floor(startOfDay.getTime() / 1000),
			endTime: Math.floor(endOfDay.getTime() / 1000),
			emails: [data?.User?.grantEmail as string],
		},
	});

	// if (!data) return notFound();

	return {
		data,
		nylasCalendarData,
	};
};

const calcAvailableTimeSlots = async (
	date: string,
	dbAvailability: {
		fromTime: string | undefined;
		tillTime: string | undefined;
		isActive: boolean | undefined;
	},
	nylasData: NylasResponse<GetFreeBusyResponse[]>,
	duration: number
) => {
	const now = new Date();
	//converting from string to date object
	const availableFrom = parse(
		`${date} ${dbAvailability.fromTime}`,
		"yyyy-MM-dd HH:mm",
		new Date()
	);

	const availableTill = parse(
		`${date} ${dbAvailability.tillTime}`,
		"yyyy-MM-dd HH:mm",
		new Date()
	);

	//get busy slot from nylas
	//@ts-ignore
	const busySlot = nylasData.data[0].timeSlots.map((slot) => ({
		start: fromUnixTime(slot.startTime),
		end: fromUnixTime(slot.endTime),
	}));

	const allSlots = [];
	let currentSlot = availableFrom;
	//generate time slots
	while (isBefore(currentSlot, availableTill)) {
		allSlots.push(currentSlot);
		currentSlot = addMinutes(currentSlot, duration);
	}

	const freeSlots = allSlots.filter((slot) => {
		const slotEnd = addMinutes(slot, duration);

		return (
			isAfter(slot, now) &&
			//checking time slot do not overlap busy a period
			!busySlot.some(
				(busy: { start: any; end: any }) =>
					// slot start before a busy period
					(!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
					// slot ends durring a during period
					(isAfter(slotEnd, busy.start) &&
						!isAfter(slotEnd, busy.end)) ||
					// slot is during a busy period
					(!isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
			) &&
			dbAvailability.isActive
		);
	});

	return freeSlots.map((slot) => format(slot, "HH:mm"));
};

const TimeTable = async ({ selectedDate, username, duration }: ITimeTable) => {
	const { data, nylasCalendarData } = await getData(username, selectedDate);
	const formattedDate = format(selectedDate, "yyyy-MM-dd");
	const dbAvailability = {
		fromTime: data?.fromTime,
		tillTime: data?.tillTime,
		isActive: data?.isActive,
	};
	const availableSlots = await calcAvailableTimeSlots(
		formattedDate,
		dbAvailability,
		nylasCalendarData,
		duration
	);
	return (
		<div>
			<p className="text-base font-semibold">
				{format(selectedDate, "EEE")} ,
				<span className="pr-1 text-muted-foreground">
					{format(selectedDate, "MMM. d")}
				</span>
			</p>
			<div className="mt-3 max-h-[350px] overflow-y-auto ">
				{availableSlots.length > 0 ? (
					availableSlots.map((slot, index) => (
						<Link
							href={`?date=${formattedDate}&time=${slot}`}
							key={index}>
							<Button className="w-full mb-2" variant={"outline"}>
								{slot}
							</Button>
						</Link>
					))
				) : (
					<p>no slots available</p>
				)}
			</div>
		</div>
	);
};

export default TimeTable;
