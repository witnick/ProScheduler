import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import NavBar from "./components/navbar";
import Hero from "./components/hero";
import Logos from "./components/logos";
import Features from "./components/features";
import Testimonial from "./components/testimonial";
import CTA from "./components/cta";

export default async function Home() {
	const session = await auth();
	if (session?.user) redirect("/dashboard");
	return (
		<>
			<div className="mx-auto">
				<NavBar />
			</div>
			<Hero />
			<Logos />
			<Features />
			<Testimonial />
			<CTA />
		</>
	);
}
