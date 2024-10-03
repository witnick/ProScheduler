"use client";

import { Button } from "@/components/ui/button";
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
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { onboardingAction } from "../action";
import { DefaultSubmitButton } from "../components/submitButtons";
const OnboardingRoute = () => {
	const [lastResult, action] = useFormState(onboardingAction, undefined);

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: onboardingSchema,
			});
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	return (
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
			className="flex min-h-screen  w-screen items-center justify-center">
			<Card>
				<CardHeader>
					<CardTitle>
						Welcome to Pro
						<span className="text-primary">Scheduler</span>
					</CardTitle>
					<CardDescription>
						We need the following information to set up your
						profile!
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-y-5">
					{/* <form> */}
					<div className="grid gap-y-2">
						<Label>Full Name</Label>
						<Input
							type="text"
							name={fields.fullName.name}
							defaultValue={fields.fullName.initialValue}
							key={fields.fullName.key}
							placeholder="Jon Doe"
						/>

						{fields.fullName.errors && (
							<p className="bg-red-600 opacity-100 text-white p-2 ">
								{fields.fullName.errors}
							</p>
						)}
					</div>
					<div className="grid gap-y-2">
						<Label>Username</Label>
						<div className="flex rounded-md">
							<span className="inline-flex items-center px-2 rounded-l-md border-r-0 border-muted bg-muted text-sm text-muted-foreground">
								ProScheduler.com/
							</span>
							<Input
								type="text"
								name={fields.userName.name}
								defaultValue={fields.userName.initialValue}
								key={fields.userName.key}
								placeholder="example-user-123"
								className="rounded-l-none"
							/>
						</div>

						{fields.userName.errors && (
							<p className="bg-red-600 opacity-100 text-white p-2 ">
								{fields.userName.errors}
							</p>
						)}
					</div>
					{/* </form> */}
				</CardContent>
				<CardFooter>
					<DefaultSubmitButton
						submitText={"Submit"}
						variant={"outline"}
						className={"w-full"}
					/>
				</CardFooter>
			</Card>
		</form>
	);
};

export default OnboardingRoute;
