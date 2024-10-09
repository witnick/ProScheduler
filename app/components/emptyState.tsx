import { Button } from "@/components/ui/button";
import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
interface IEmptyState {
	title: string;
	description: string;
	btnText: string;
	href: string;
}
const EmptyState = ({ title, description, btnText, href }: IEmptyState) => {
	return (
		<div className="flex flex-col flex-1 items-center justify-center rounded-md border-dashed p-8 text-center animate-in fade-in-50">
			<div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
				<Ban className="size-10 text-primary" />
			</div>
			<h2 className="mt-6 text-xl font-semibold">{title}</h2>
			<p className="mb-8 mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
				{description}
			</p>
			<Button variant={"secondary"} asChild>
				<Link href={href}>
					<PlusCircle className="mr-2 size-4" />
					{btnText}
				</Link>
			</Button>
		</div>
	);
};

export default EmptyState;
