"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Google from "@/public/google.svg";
import Github from "@/public/github.svg";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const GoogleAuthButton = () => {
	const { pending } = useFormStatus();
	return (
		<>
			{pending ? (
				<Button disabled variant="outline" className="w-full">
					<Loader2 className="size-4 mr-2 animate-spin" /> Please wait
					...
				</Button>
			) : (
				<Button variant="outline" className="w-full">
					<Image
						src={Google}
						alt="Google Logo"
						className="size-4 mr-2"
					/>
					Sign in with Google
				</Button>
			)}
		</>
	);
};

const GithubAuthButton = () => {
	const { pending } = useFormStatus();
	return (
		<>
			{pending ? (
				<Button disabled variant="outline" className="w-full">
					<Loader2 className="size-4 mr-2 animate-spin" /> Please wait
					...
				</Button>
			) : (
				<Button className="w-full" variant="outline">
					<Image
						src={Github}
						alt="Github Logo"
						className="size-4 mr-2"
					/>
					Sign in with Github
				</Button>
			)}
		</>
	);
};

interface ButtonInterface {
	submitText: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| null
		| undefined;
	className?: string;
}
const DefaultSubmitButton = ({
	submitText,
	variant,
	className,
}: ButtonInterface) => {
	const { pending } = useFormStatus();
	return (
		<>
			{pending ? (
				<Button
					disabled
					variant={variant}
					className={cn("w-fit", className)}>
					<Loader2 className="size-4 mr-2 animate-spin" /> Please wait
					...
				</Button>
			) : (
				<Button className={cn("w-fit", className)} variant={variant}>
					{submitText}
				</Button>
			)}
		</>
	);
};
export { GoogleAuthButton, GithubAuthButton, DefaultSubmitButton };
