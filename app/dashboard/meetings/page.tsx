import { cancelMeetingAction } from "@/app/action";
import EmptyState from "@/app/components/emptyState";
import { DefaultSubmitButton } from "@/app/components/submitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { nylas } from "@/app/lib/nylas";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";
import React from "react";

const getData = async (userId: string) => {
	const userData = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			grantId: true,
			grantEmail: true,
		},
	});

	const data = await nylas.events.list({
		identifier: userData?.grantId as string,
		queryParams: {
			calendarId: userData?.grantEmail as string,
		},
	});

	return data;
};
const MeetingsPage = async () => {
	const session = await requireUser();
	const data = await getData(session.user?.id as string);
	console.log(data);

	return (
		<>
			{data.data.length < 1 ? (
				<EmptyState
					title="No meeting found"
					description="You don't have any meetings yet"
					btnText="Create new event type"
					href="/dashboard/new"
				/>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Bookings</CardTitle>
						<CardDescription>See upcoming meetings</CardDescription>
					</CardHeader>
					<CardContent>
						{data.data.map((item, index) => (
							<form key={index} action={cancelMeetingAction}>
								<input
									type="hidden"
									name="eventId"
									value={item.id}
								/>
								<div className="grid grid-cols-3 justify-between items-center">
									<div>
										<p className="text-muted-foreground text-sm">
											{format(
												fromUnixTime(
													item.when.startTime
												),
												"EEE, dd MMM HH:mm"
											)}
										</p>
										<p className="text-xs text-muted-foreground">
											{format(
												fromUnixTime(
													item.when.startTime
												),
												"hh:mm a"
											)}{" "}
											-{" "}
											{format(
												fromUnixTime(item.when.endTime),
												"hh:mm a"
											)}
										</p>

										<div className="flex items-center mt-1 gap-2">
											<Video className="size-4 text-primary" />
											<a
												className="text-xs text-primary underline underline-offset-4 "
												//href="+"
												href={
													item.conferencing?.details
														.url
												}
												target="_blank">
												Join meeting
											</a>
										</div>
									</div>
									<div className="flex flex-col items-start">
										<h2>{item.title}</h2>
										{item.participants[0] && (
											<p>
												You and{" "}
												{!!item.participants[0] &&
													item.participants[0]?.name}
											</p>
										)}
									</div>

									<DefaultSubmitButton
										submitText={"Cancel Event"}
										variant={"destructive"}
										className="w-fit ml-auto"
									/>
								</div>
								<Separator className="my-3" />
							</form>
						))}
					</CardContent>
				</Card>
			)}
		</>
	);
};

export default MeetingsPage;
