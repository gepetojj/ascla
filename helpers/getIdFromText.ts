import removeAccents from "remove-accents";

export const getIdFromText = (text: string): string => {
	const id = text
		.toLowerCase()
		.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`´~()]/g, "")
		.replaceAll(" ", "-");
	return removeAccents(id);
};
