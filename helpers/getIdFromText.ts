import removeAccents from "remove-accents";

/**
 * Gera um ID a partir de um texto. Retira todo tipo de acento e/ou caracter especial e transforma os espaços em `-`.
 * 
 * @param {string} text Texto desejado para extrair o ID
 * @returns {string} ID retirado do texto
 */
export const getIdFromText = (text: string): string => {
	const id = text
		.toLowerCase()
		.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`´~()]/g, "")
		.replaceAll(" ", "-");
	return removeAccents(id);
};
