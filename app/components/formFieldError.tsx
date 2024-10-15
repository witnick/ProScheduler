import React from "react";
interface IFormFieldError {
	messages: string[] | undefined;
}
const FormFieldError = ({ messages: messages }: IFormFieldError) => {
	return (
		messages && (
			<p className="bg-red-600 opacity-100 text-white p-2 ">
				{messages.map((m, i) => (
					<span key={i}>{m}</span>
				))}
			</p>
		)
	);
};

export default FormFieldError;
