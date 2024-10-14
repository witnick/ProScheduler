import { deleteEventTypeAction } from "@/app/action";
import { DefaultSubmitButton } from "@/app/components/submitButtons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const DeleteEventTypePage = ({
	params,
}: {
	params: {
		eventTypeId: string;
	};
}) => {
	return (
		<div className="flex flex-1 items-center justify-center">
			<Card className="max-w-[400px] w-full">
				<CardHeader>
					<CardTitle>Delete event type</CardTitle>
					<CardDescription>
						Are you sure you want to delete this event?
					</CardDescription>
				</CardHeader>
				<CardContent></CardContent>
				<CardFooter className="gap-2 justify-between">
					<Button variant={"secondary"} asChild>
						<Link href="/dashboard">Cancel</Link>
					</Button>
					<form action={deleteEventTypeAction}>
						<input
							type="hidden"
							name="id"
							value={params.eventTypeId}
						/>
						<DefaultSubmitButton
							variant={"destructive"}
							submitText={"Delete"}
						/>
					</form>
				</CardFooter>
			</Card>
		</div>
	);
};

export default DeleteEventTypePage;
