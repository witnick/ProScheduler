import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import React, { useState } from "react";
import { times } from "../lib/times";

interface IAvailabilityData {
	id: string;
	isActive: boolean;
	fromTime: string;
	tillTime: string;
	day: string;
}

const AvailabilityRow = (data: IAvailabilityData) => {
	// const [activeSelect, setActiveSelect] = useState<boolean>(data.isActive);
	return (
		<div
			key={data.id}
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
			<input type="hidden" value={data.id} name={`id-${data.id}`} />
			<div className="flex items-center gap-x-3">
				<Switch
					name={`isActive-${data.id}`}
					defaultChecked={data.isActive}
				/>
				<p>{data.day}</p>
			</div>
			<Select
				// disabled={!data.isActive}
				name={`fromTime-${data.id}`}
				defaultValue={data.fromTime}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="from Time" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{times.map((time) => (
							<SelectItem key={time.id} value={time.time}>
								{time.time}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select
				// disabled={!data.isActive}
				name={`tillTime-${data.id}`}
				defaultValue={data.tillTime}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Untill Time" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{times.map((time) => (
							<SelectItem key={time.id} value={time.time}>
								{time.time}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default AvailabilityRow;
