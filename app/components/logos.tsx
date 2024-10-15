import React from "react";
import NylasLogo from "@/public/nylas-logo.png";
import NextJsLogo from "@/public/nextjs-logo.svg";
import Image from "next/image";

const Logos = () => {
	return (
		<div className="py-10">
			<h2 className="text-center text-lg font-semibold leading-7">
				Trusted by companies in the world
			</h2>
			<div className="mt-10 grid max-w-lg mx-auto grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
				<Image
					src={NylasLogo}
					alt="next logo"
					className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
				/>
				<Image
					src={NextJsLogo}
					alt="next logo"
					className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
				/>
			</div>
		</div>
	);
};

export default Logos;
