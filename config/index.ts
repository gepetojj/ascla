export const config = {
	shortName: "ASLCA",
	fullName: "Academia Santanense de Letras, Ciências e Artes",
	basePath: process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://aslca.org.br",
} as const;
