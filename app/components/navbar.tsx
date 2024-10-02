import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.png";
import AuthModal from "./authModal";

const NavBar = () => {
	return (
		<>
			<div className="flex py-5 items-center justify-between bg-white">
				<Link href="/" className="flex items-center gap-2">
					<Image src={Logo} alt="logo" className="size-10" />
					<h4 className="text-3xl font-semibold">
						Pro<span className="text-blue-500">Scheduler</span>
					</h4>
				</Link>
				<AuthModal />
			</div>
		</>
	);
};

export default NavBar;
