"use client";
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
import React, { useState } from "react";
import FormFieldError from "./formFieldError";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ButtonGroup from "@/components/ui/ButtonGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DefaultSubmitButton } from "./submitButtons";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { EditEventTypeAction } from "../action";

type VideoCallProvider = "Google Meet" | "Microsoft Teams" | "Zoom Meeting";

interface IEditEventTypeForm {
	id: string;
	title: string;
	url: string;
	description: string;
	duration: number;
	callprovider: VideoCallProvider;
}

const EditEventTypeForm = ({
	id,
	title,
	url,
	description,
	duration,
	callprovider,
}: IEditEventTypeForm) => {
	const [activePlatform, setActivePlatform] =
		useState<VideoCallProvider>(callprovider);
	const [lastResult, action] = useFormState(EditEventTypeAction, undefined);

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
					<CardTitle>Edit appointment type</CardTitle>
					<CardDescription>
						Edit the apointment type that allows people to book you!
					</CardDescription>
				</CardHeader>
				<form
					id={form.id}
					onSubmit={form.onSubmit}
					action={action}
					noValidate>
					<Input type="hidden" name="id" key="id" value={id} />
					<CardContent className="flex flex-col gap-y-2">
						<div className="flex flex-col gap-y-2">
							<Label>Title</Label>
							<Input
								type="text"
								placeholder="30 min meeting"
								name={fields.title.name}
								key={fields.title.key}
								defaultValue={title}
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
									defaultValue={url}
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
								defaultValue={description}
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
								value={`${duration}`}>
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
								defaultValue={activePlatform}
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
										setActivePlatform("Microsoft Teams")
									}
									variant={
										activePlatform == "Microsoft Teams"
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
						<DefaultSubmitButton submitText="Edit event type" />
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default EditEventTypeForm;
