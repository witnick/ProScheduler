import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { signIn } from "../lib/auth";
import { GithubAuthButton, GoogleAuthButton } from "./submitButtons";

const AuthModal = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Try For Free</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-width-[360px]">
				<DialogHeader className="flex flex-row justify-center items-center gap-2">
					<Image src={Logo} alt="logo" className="size-10" />
					<h4 className="text-3xl font-semibold">
						Pro<span className="text-primary">Scheduler</span>
					</h4>
				</DialogHeader>
				<div className="flex flex-col mt-5 gap-3">
					<form
						className="w-full"
						action={async () => {
							"use server";
							await signIn("google");
						}}>
						<GoogleAuthButton />
					</form>
					<form
						className="w-full"
						action={async () => {
							"use server";
							await signIn("github");
						}}>
						<GithubAuthButton />
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AuthModal;
