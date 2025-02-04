export const config = {
	shortName: "ASLCA",
	fullName: "Academia Santanense de Letras, Ciências e Artes",
	basePath:
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: process.env.WEB_URL || "https://aslca.org.br",
} as const;

export const academias = [
	{
		label: "ABL",
		url: "https://www.academia.org.br/",
	},
	{
		label: "AAL",
		url: "https://www.aal.al.org.br/",
	},
	{
		label: "ACALA",
		url: "http://acala.org.br/",
	},
	{
		label: "APALCA",
		url: "https://apalca.com.br/",
	},
] as const;

export const blogs = [
	{
		label: "Apenso com Grifo",
		url: "https://www.apensocomgrifo.com/",
	},
	{
		label: "Clerisvaldo Chagas",
		url: "https://clerisvaldobchagas.blogspot.com/",
	},
	{
		label: "A palavra é para dizer",
		url: "https://apalavraeparadizer.blogspot.com/",
	},
	{
		label: "Blog do Etevaldo",
		url: "https://blogdoetevaldo.blogspot.com/"
	}
] as const;
