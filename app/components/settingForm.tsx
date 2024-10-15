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
import React, { useRef, useState } from "react";
import { DefaultSubmitButton } from "./submitButtons";
import { useFormState } from "react-dom";
import { SettingsAction } from "../action";
import { useForm } from "@conform-to/react";
import { settingSchema } from "../lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import FormFieldError from "./formFieldError";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
// import { supabase } from "../lib/supabase";
// import { requireUser } from "../lib/hooks";
// import { v4 as uuidv4 } from "uuid";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface ISettingForm {
	fullName: string;
	email: string;
	profileImage: string;
}

const SettingForm = ({ fullName, email, profileImage }: ISettingForm) => {
	const [lastResult, action] = useFormState(SettingsAction, undefined);
	const [currentProfileImage, setCurrentProfileImage] =
		useState(profileImage);
	const [imageFile, setImageFile] = useState<File>();
	const [imageFileUrl, setImageFileUrl] = useState<string>();
	const newProfileImageInput = useRef<HTMLInputElement>(null);

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: settingSchema,
			});
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	const handleDeleteImage = () => {
		setCurrentProfileImage("");
	};

	const handleDeleteImageFile = () => {
		if (imageFileUrl) URL.revokeObjectURL(imageFileUrl!);
		setImageFileUrl(undefined);
		setImageFile(undefined);
		if (newProfileImageInput.current)
			newProfileImageInput.current.value = "";
	};

	const handleAddImage = () => {
		newProfileImageInput.current?.click();
	};

	const handleImageChange = (e: any) => {
		setImageFile(e.target.files[0]);
		const url = URL.createObjectURL(e.target.files[0]);
		setImageFileUrl(url);
		toast.success("Profile image changed", {
			closeButton: true,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Settings</CardTitle>
				<CardDescription>Manage your account settings</CardDescription>
			</CardHeader>
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate>
				<CardContent className="flex flex-col gap-y-4">
					<div className="flex flex-col gap-2">
						<Label>Full name</Label>
						<Input
							type="text"
							placeholder="John doe"
							defaultValue={fullName}
							name={fields.fullName.name}
							key={fields.fullName.key}
						/>
					</div>
					<FormFieldError messages={fields.fullName.errors} />
					<div className="flex flex-col gap-2">
						<Label>Email</Label>
						<Input
							type="email"
							placeholder="john.doe@example.com"
							defaultValue={email}
							disabled
						/>
					</div>
					<div className="grid gap-y-5">
						<Label>Profile Image</Label>
						{currentProfileImage ? (
							<div className="relative size-16">
								<img
									src={currentProfileImage}
									alt="profile image"
									className="size-16 rounded-lg"
								/>
								<Button
									onClick={handleDeleteImage}
									className="absolute -top-3 -right-3 "
									variant={"destructive"}
									size={"sm"}>
									<X className="size-4 relative"></X>
								</Button>
							</div>
						) : (
							<div className="grid gap-5">
								<div className="flex flex-col">
									{!imageFile && (
										<>
											<div>no image</div>
											<Button
												type="button"
												onClick={handleAddImage}
												variant={"default"}
												size={"sm"}
												className="w-fit mb-5">
												<Plus /> add image
											</Button>
										</>
									)}
									{imageFile && (
										<>
											{/* <span>{imageFile?.name}</span> */}
											<div className="relative size-16">
												<img
													src={URL.createObjectURL(
														imageFile
													)}
													alt="img preview"
													className="size-16 rounded-lg"
												/>

												<Button
													onClick={
														handleDeleteImageFile
													}
													className="absolute -top-3 -right-3 "
													variant={"destructive"}
													size={"sm"}>
													<X className="size-4 relative"></X>
												</Button>
											</div>
										</>
									)}
									<input
										className="hidden"
										type="file"
										name="file"
										onChange={handleImageChange}
										ref={newProfileImageInput}
									/>
								</div>
							</div>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<DefaultSubmitButton
						submitText="Save changes"
						variant={"outline"}
						className={"w-full"}
					/>
				</CardFooter>
			</form>
			<Toaster richColors />
		</Card>
	);
};

export default SettingForm;
