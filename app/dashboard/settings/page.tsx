import { getProfileImagePublicUrl } from "@/app/action";
import SettingForm from "@/app/components/settingForm";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { notFound } from "next/navigation";
import React from "react";

const getData = async function (id: string) {
	const data = await prisma.user.findUnique({
		where: {
			id: id,
		},
		select: {
			email: true,
			name: true,
			image: true,
		},
	});

	if (!data) {
		return notFound();
	}

	return data;
};
const SettingsPage = async () => {
	const session = await requireUser();
	const data = await getData(session.user?.id as string);
	const profileImageUrl = await getProfileImagePublicUrl(session.user?.id!);
	const profileImage = profileImageUrl ?? data.image;
	return (
		<SettingForm
			fullName={data.name as string}
			email={data.email}
			profileImage={profileImage as string}
		/>
	);
};

export default SettingsPage;
