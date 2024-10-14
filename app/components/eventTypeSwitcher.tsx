"use client";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { updateEventTypeStatusAction } from "../action";
import { toast } from "sonner";
interface IEventTypeSwitcher {
	initialChecked: boolean;
	eventTypeId: string;
}
const EventTypeSwitcher = ({
	initialChecked,
	eventTypeId,
}: IEventTypeSwitcher) => {
	const [isPending, startTransition] = useTransition();

	const [state, action] = useFormState(
		updateEventTypeStatusAction,
		undefined
	);

	useEffect(() => {
		if (state?.status === "success") {
			toast.success(state.message);
		} else if (state?.status === "error") {
			toast.error(state.message);
		}
	}, [state]);
	return (
		<>
			<Switch
				disabled={isPending}
				defaultChecked={initialChecked}
				onCheckedChange={(isChecked) => {
					startTransition(() => {
						action({
							eventTypeId: eventTypeId,
							isChecked: isChecked,
						});
					});
				}}
			/>
		</>
	);
};

export default EventTypeSwitcher;
