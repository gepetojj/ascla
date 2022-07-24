import { config } from "config";
import { readdirSync } from "fs";
import type { GetServerSideProps, NextPage } from "next";
import { resolve } from "path";

const Sitemap: NextPage = () => {
	return null;
};

export default Sitemap;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const paths: (string | string[])[] = readdirSync("pages")
		.filter(page => {
			const ignoreList = ["admin", "api", "_", "sitemap.xml"];
			for (const path of ignoreList) if (page.startsWith(path)) return false;
			return true;
		})
		.map(path => {
			function iterate(path: string) {
				if (path.includes(".")) {
					let page = path.split(".")[0];
					if (page.includes("page")) {
						page = page.split("pages")[1].replaceAll("\\", "/").replace("/", "");
					}

					return `${config.basePath}${
						page.endsWith("index")
							? `/${page
									.replace("index", "")
									.slice(0, page.replace("index", "").length - 1)}`
							: `/${page}`
					}`;
				}

				const folder = readdirSync(resolve("pages", path));
				const subPaths: string[] = [];
				const fullPath = resolve("pages", path);

				for (const folderOrFile of folder) {
					const relativePath = resolve(fullPath, folderOrFile);
					const result = iterate(relativePath);

					if (typeof result === "string") subPaths.push(result);
					else {
						for (const item of result) {
							if (typeof item !== "string") continue;
							subPaths.push(item);
							continue;
						}
					}
				}

				return subPaths.filter((x, i) => i === subPaths.indexOf(x));
			}

			return iterate(path);
		});

	const flattenPaths = ([] as string[])
		.concat(...paths)
		.filter(page => !page.includes("[urlId]"));

	// Adicionar as páginas dinâmicas aqui.

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
				xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
		>
		${flattenPaths.map(path => {
			return `<url>
				<loc>${path}</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
				<priority>1.0</priority>
			</url>`;
		})}
    	</urlset>
  	`;

	res.setHeader("Content-Type", "text/xml");
	res.end(sitemap);

	return { props: {} };
};
