import EditEventTypeForm from "@/app/components/editEventTypeForm";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import React from "react";
const getData = async (eventTypeId: string) => {
	const data = await prisma.eventType.findUnique({
		where: {
			id: eventTypeId,
		},
		select: {
			id: true,
			title: true,
			description: true,
			duration: true,
			url: true,
			videoCallSoftware: true,
		},
	});

	if (!data) return notFound();

	return data;
};
const EventEditPage = async ({
	params,
}: {
	params: { eventTypeId: string };
}) => {
	const data = await getData(params.eventTypeId);
	return (
		<EditEventTypeForm
			id={data.id}
			title={data.title}
			url={data.url}
			description={data.description}
			duration={data.duration}
			callprovider={data.videoCallSoftware}
		/>
	);
};

export default EventEditPage;
