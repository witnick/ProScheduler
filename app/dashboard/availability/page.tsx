import { updateAvailabilityAction } from "@/app/action";
import AvailabilityRow from "@/app/components/availabilityRow";
import { DefaultSubmitButton } from "@/app/components/submitButtons";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { notFound } from "next/navigation";

const getData = async (userId: string) => {
	const d = prisma.availability.findMany({
		where: {
			userId: userId,
		},
	});

	if (!d) return notFound();

	return d;
};
const AvailibilityPage = async () => {
	const session = await requireUser();
	const data = await getData(session.user?.id as string);
	return (
		<>
			<CardHeader>
				<CardTitle>Availability</CardTitle>
				<CardDescription>
					{" "}
					You can manage your availabilities
				</CardDescription>
			</CardHeader>
			<form action={updateAvailabilityAction}>
				<CardContent className="flex flex-col gap-y-4">
					{data &&
						data.map((d, i) => (
							<AvailabilityRow
								key={i}
								id={d.id}
								isActive={d.isActive}
								fromTime={d.fromTime}
								tillTime={d.tillTime}
								day={d.day}
							/>
						))}
				</CardContent>
				<CardFooter>
					<DefaultSubmitButton submitText="Save" className="w-full" />
				</CardFooter>
			</form>
		</>
	);
};

export default AvailibilityPage;
