import { CreateMeetingAction } from "@/app/action";
import RenderCalendar from "@/app/components/bookingForm/RenderCalendar";
import TimeTable from "@/app/components/bookingForm/TimeTable";
import { DefaultSubmitButton } from "@/app/components/submitButtons";
import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const getData = async (eventUrl: string, userName: string) => {
	const data = await prisma.eventType.findFirst({
		where: {
			url: eventUrl,
			User: {
				userName: userName,
			},
			active: true,
		},
		select: {
			id: true,
			description: true,
			title: true,
			duration: true,
			videoCallSoftware: true,
			User: {
				select: {
					image: true,
					name: true,
					availability: {
						select: {
							day: true,
							isActive: true,
						},
					},
				},
			},
		},
	});

	if (!data) return notFound();

	return data;
};

const BookingPage = async ({
	params,
	searchParams,
}: {
	params: { username: string; eventUrl: string };
	searchParams: { date?: string; time?: string };
}) => {
	const data = await getData(params.eventUrl, params.username);
	console.log(`searchParams.date ${searchParams.date}`);
	const selectedDate = searchParams.date
		? new Date(`${searchParams.date}T00:00:00`)
		: new Date();

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(selectedDate);

	const showForm = !!searchParams.date && !!searchParams.time;

	return (
		<div className="min-h-screen w-screen flex items-center justify-center">
			{showForm ? (
				<Card className="max-w-[600px] w-full">
					<CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr] gap-4">
						<div>
							<img
								src={data.User?.image as string}
								alt="profile image"
								className="size-10 rounded-full"
							/>
							<p className="text-sm font-medium text-muted-foreground mt-1">
								{data.User?.name}
							</p>
							<h1 className="text-xl font-semibold mt-2">
								{data.title}
							</h1>
							<p className="text-sm font-medium text-muted-foreground">
								{data.description}
							</p>

							<div className="mt-5 flex flex-col gap-y-3">
								<p className="flex items-center">
									<CalendarX2 className="size-4 mr-2 text-primary" />
									<span className="text-sm font-medium text-muted-foreground">
										{formattedDate.toString()}
									</span>
								</p>
								<p className="flex items-center">
									<Clock className="size-4 mr-2 text-primary" />
									<span className="text-sm font-medium text-muted-foreground">
										{data.duration} Minutes
									</span>
								</p>
								<p className="flex items-center">
									<VideoIcon className="size-4 mr-2 text-primary" />
									<span className="text-sm font-medium text-muted-foreground">
										{data.videoCallSoftware}
									</span>
								</p>
							</div>
						</div>
						<Separator
							orientation="vertical"
							className="h-full w-[1px]"
						/>
						<form
							action={CreateMeetingAction}
							className="flex flex-col gap-y-4">
							<input
								type="hidden"
								name="fromTime"
								value={searchParams.time}
							/>
							<input
								type="hidden"
								name="eventDate"
								value={searchParams.date}
							/>
							<input
								type="hidden"
								name="meetingLength"
								value={data.duration}
							/>
							<input
								type="hidden"
								name="provider"
								value={data.videoCallSoftware}
							/>
							<input
								type="hidden"
								name="username"
								value={params.username}
							/>
							<input
								type="hidden"
								name="eventTypeId"
								value={data.id}
							/>
							<div className="flex flex-col gap-y-2">
								<Label>Name</Label>
								<Input
									type="text"
									name="name"
									placeholder="your name"
								/>
							</div>
							<div className="flex flex-col gap-y-2">
								<Label>Email</Label>
								<Input
									name="email"
									type="email"
									placeholder="john.doe@domain.com"
								/>
							</div>
							<DefaultSubmitButton
								submitText={"Book meeting"}
								className="w-full"
							/>
						</form>
					</CardContent>
				</Card>
			) : (
				<Card className="max-w-[1000px] w-full mx-auto">
					<CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-4">
						<div>
							<img
								src={data.User?.image as string}
								alt="profile image"
								className="size-10 rounded-full"
							/>
							<p className="text-sm font-medium text-muted-foreground mt-1">
								{data.User?.name}
							</p>
							<h1 className="text-xl font-semibold mt-2">
								{data.title}
							</h1>
							<p className="text-sm font-medium text-muted-foreground">
								{data.description}
							</p>

							<div className="mt-5 flex flex-col gap-y-3">
								<p className="flex items-center">
									<CalendarX2 className="size-4 mr-2 text-primary" />
									<span className="text-sm font-medium text-muted-foreground">
										{formattedDate.toString()}
									</span>
								</p>
								<p className="flex items-center">
									<Clock className="size-4 mr-2 text-primary" />
									<span className="text-sm font-medium text-muted-foreground">
										{data.duration} Minutes
									</span>
								</p>
								<p className="flex items-center">
									<VideoIcon className="size-4 mr-2 text-primary" />
									<span className="text-sm font-medium text-muted-foreground">
										{data.videoCallSoftware}
									</span>
								</p>
							</div>
						</div>
						<Separator
							orientation="vertical"
							className="h-full w-[1px]"
						/>
						<div>
							<RenderCalendar
								availability={data.User?.availability as any}
							/>
						</div>

						<Separator
							orientation="vertical"
							className="h-full w-[1px]"
						/>
						<div>
							<TimeTable
								selectedDate={selectedDate}
								username={params.username}
								duration={data.duration}
							/>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default BookingPage;
