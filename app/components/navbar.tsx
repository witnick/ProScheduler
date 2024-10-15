import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.png";
import AuthModal from "./authModal";
import { ThemeToggle } from "./themeToggle";

const NavBar = () => {
	return (
		<>
			<div className="flex py-5 px-5 items-center justify-between bg-muted/40">
				<Link href="/" className="flex items-center gap-2">
					<Image src={Logo} alt="logo" className="size-10" />
					<h4 className="text-3xl font-semibold">
						Pro<span className="text-blue-500">Scheduler</span>
					</h4>
				</Link>
				<div className="hidden md:flex md:justify-end md:space-x-4">
					<ThemeToggle />
					<AuthModal />
				</div>
			</div>
		</>
	);
};

export default NavBar;
