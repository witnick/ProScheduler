import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import Logo from "@/public/logo.png";
import DashboardLinks from "../components/dashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/themeToggle";
import { signOut } from "../lib/auth";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { requireUser } from "../lib/hooks";
import prisma from "../lib/db";
import { redirect } from "next/navigation";

async function getData(userId: string) {
	const data = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			userName: true,
			grantId: true,
		},
	});
	if (!data?.userName) return redirect("/onboarding");
	if (!data?.grantId) return redirect("/onboarding/grant-id/");

	return data;
}
const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const session = await requireUser();
	const userNameData = await getData(session.user?.id as string);
	return (
		<div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[290px_1fr]">
			<div className="hidden md:block border-white bg-muted/40">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ">
						<Link href="/" className="flex items-center  gap-2">
							<Image src={Logo} alt="logo" className="size-10" />
							<h4 className="text-xl font-semibold">
								Pro
								<span className="text-primary">Scheduler</span>
							</h4>
						</Link>
					</div>
					<div className="flex-1">
						<nav className="grid items-start px-2 lg:px-4">
							<DashboardLinks />
						</nav>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<header className=" flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant={"outline"}
								className="md:hidden shrink-0"
								size={"icon"}>
								<Menu />
							</Button>
						</SheetTrigger>
						<SheetContent side={"left"} className="flex flex-col">
							<nav className="grid items-start px-2 lg:px-4 mt-[44px]">
								<DashboardLinks />
							</nav>
						</SheetContent>
					</Sheet>
					<div className="ml-auto flex items-center gap-x-4">
						<div>Hello, {userNameData.userName}</div>
						<ThemeToggle />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant={"secondary"}
									size={"icon"}
									className="rounded-full">
									<img
										src={session?.user?.image as string}
										// src={Logo.src}
										alt="Profile image"
										width={20}
										height={20}
										className="w-full h-full rounded-full"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>
									<span className="flex justify-center">
										My Account
									</span>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link
										href="/dashboard/settings"
										className="justify-center">
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<form
										action={async () => {
											"use server";
											await signOut();
										}}>
										<Button
											className="w-full h-full text-left"
											variant={"ghost"}>
											Log out
										</Button>
									</form>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{children}
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
