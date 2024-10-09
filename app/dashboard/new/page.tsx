"use client";
import { CreateEventTypeAction } from "@/app/action";
import FormFieldError from "@/app/components/formFieldError";
import { DefaultSubmitButton } from "@/app/components/submitButtons";
import { requireUser } from "@/app/lib/hooks";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/ui/ButtonGroup";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useFormState } from "react-dom";

type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Team";

const NewEventPage = () => {
	const [activePlatform, setActivePlatform] =
		useState<VideoCallProvider>("Google Meet");

	const [lastResult, action] = useFormState(CreateEventTypeAction, undefined);
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: eventTypeSchema,
			});
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	return (
		<div className="w-full h-full flex flex-1 items-center justify-center">
			<Card>
				<CardHeader>
					<CardTitle>Add new appointment type</CardTitle>
					<CardDescription>
						Create new new apointment type that allows people to
						book you!
					</CardDescription>
				</CardHeader>
				<form
					id={form.id}
					onSubmit={form.onSubmit}
					action={action}
					noValidate>
					<CardContent className="flex flex-col gap-y-2">
						<div className="flex flex-col gap-y-2">
							<Label>Title</Label>
							<Input
								type="text"
								placeholder="30 min meeting"
								name={fields.title.name}
								key={fields.title.key}
								defaultValue={fields.title.initialValue}
							/>
							<FormFieldError messages={fields.title.errors} />
						</div>
						<div className="flex flex-col gap-y-2">
							<Label>URL Slug</Label>
							<div className="flex rounded-md">
								<span className="inline-flex items-center px-2 rounded-l-md border-r-0 border-muted bg-muted text-sm text-muted-foreground w-full">
									ProScheduler.com/
									{/* {session.user?.name?.replace(" ", "-")}/ */}
								</span>
								<Input
									type="text"
									name={fields.url.name}
									key={fields.url.key}
									defaultValue={fields.url.initialValue}
									placeholder="example-url-123"
									className="rounded-l-none"
								/>
							</div>
							<FormFieldError messages={fields.url.errors} />
						</div>
						<div className="flex flex-col gap-y-2">
							<Label>Description</Label>
							<Textarea
								name={fields.description.name}
								key={fields.description.key}
								defaultValue={fields.description.initialValue}
								placeholder="meeting description"
							/>
							<FormFieldError
								messages={fields.description.errors}
							/>
						</div>
						<div className="flex flex-col gap-y-2">
							<Label>Duration</Label>
							<Select
								name={fields.duration.name}
								key={fields.duration.key}
								defaultValue={fields.duration.initialValue}>
								<SelectTrigger>
									<SelectValue placeholder="select duration" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Duration</SelectLabel>
										<SelectItem value="15">
											15 Mins
										</SelectItem>
										<SelectItem value="30">
											30 Mins
										</SelectItem>
										<SelectItem value="45">
											45 Mins
										</SelectItem>
										<SelectItem value="60">
											1 Hour
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormFieldError messages={fields.duration.errors} />
						</div>
						<div className="grid gap-y-2">
							<Label>Video call provider</Label>
							<Input
								name={fields.videoCallSoftware.name}
								key={fields.videoCallSoftware.key}
								defaultValue={
									fields.videoCallSoftware.initialValue
								}
								value={activePlatform}
								type="hidden"
							/>
							<ButtonGroup>
								<Button
									type="button"
									onClick={() =>
										setActivePlatform("Zoom Meeting")
									}
									variant={
										activePlatform == "Zoom Meeting"
											? "secondary"
											: "outline"
									}
									className="w-full">
									Zoom
								</Button>
								<Button
									type="button"
									onClick={() =>
										setActivePlatform("Google Meet")
									}
									variant={
										activePlatform == "Google Meet"
											? "secondary"
											: "outline"
									}
									className="w-full ">
									Google Meet
								</Button>
								<Button
									type="button"
									onClick={() =>
										setActivePlatform("Microsoft Team")
									}
									variant={
										activePlatform == "Microsoft Team"
											? "secondary"
											: "outline"
									}
									className="w-full">
									Microsoft Team
								</Button>
							</ButtonGroup>
							<FormFieldError
								messages={fields.videoCallSoftware.errors}
							/>
						</div>
					</CardContent>
					<CardFooter className="w-full justify-between">
						<Button variant={"secondary"} asChild>
							<Link href="/dashboard">cancel</Link>
						</Button>
						<DefaultSubmitButton submitText="Create event type" />
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default NewEventPage;
