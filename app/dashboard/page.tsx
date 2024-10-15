import React from "react";
import { requireUser } from "../lib/hooks";
import prisma from "../lib/db";
import { notFound } from "next/navigation";
import EmptyState from "../components/emptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Pen, Settings, Trash, User2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CopyLinkMenuItem from "../components/copyLinkMenuItem";
import EventTypeSwitcher from "../components/eventTypeSwitcher";

const getData = async (id: string) => {
	const data = prisma.user.findUnique({
		where: {
			id: id,
		},
		select: {
			userName: true,
			eventType: {
				select: {
					id: true,
					active: true,
					title: true,
					url: true,
					duration: true,
				},
			},
		},
	});

	if (!data) return notFound();

	return data;
};
const DashboardPage = async () => {
	const session = await requireUser();
	const eventTypeData = await getData(session.user?.id as string);

	return (
		<>
			{eventTypeData?.eventType.length === 0 ? (
				<EmptyState
					title={"you have no Event Types"}
					description="You can create your first event type by clicking the button bellow"
					btnText="add event type"
					href="/dashboard/new"
				/>
			) : (
				<>
					<div className="flex items-center justify-between px-2">
						<div className=" hidden sm:grid gap-y-1">
							<h1 className="text text-3xl md:text-4xl font-semibold">
								Event Types
							</h1>
							<p className="text-muted-foreground">
								Create and manage your event type right here
							</p>
						</div>
						<Button asChild>
							<Link href="/dashboard/new">create new event</Link>
						</Button>
					</div>
					<div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
						{eventTypeData?.eventType.map((item) => (
							<div
								className="overflow-hidden shadow rounded-lg border relative"
								key={item.id}>
								<div className="absolute top-2 right-2">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant={"outline"}
												size={"icon"}>
												<Settings className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>
												Event
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuGroup>
												<DropdownMenuItem asChild>
													<Link
														href={`/${eventTypeData.userName}/${item.url}`}>
														<ExternalLink className="mr-2 size-4" />
														Preview
													</Link>
												</DropdownMenuItem>
												<CopyLinkMenuItem
													meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${eventTypeData.userName}/${item.url}`}
												/>
												<DropdownMenuItem>
													<Link
														href={`/dashboard/event/${item.id}`}
														className="flex flex-row w-full">
														<Pen className="mr-2 size-4" />
														Edit
													</Link>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem>
													<Link
														href={`/dashboard/event/${item.id}/delete`}
														className="flex flex-row w-full">
														<Trash className="mr-2 size-4" />
														Delete
													</Link>
												</DropdownMenuItem>
											</DropdownMenuGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<Link
									href={"/"}
									className="flex items-center p-5">
									<div className="flex-shrink-0">
										<User2 className="size-6" />
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-muted-foreground">
												{item.duration} Minutes Meeting
											</dt>
											<dd className="text-lg font-medium">
												{item.title}
											</dd>
										</dl>
									</div>
								</Link>
								<div className="flex flex-row items-center justify-between bg-muted p-4 gap-y-5">
									<div className=" p-1 flex rounded-full items-center justify-center bg-transparent/20">
										<EventTypeSwitcher
											initialChecked={item.active}
											eventTypeId={item.id}
										/>
									</div>
									<Link href={`/dashboard/event/${item.id}`}>
										<Button className="w-full">
											Edit event
										</Button>
									</Link>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
};

export default DashboardPage;
