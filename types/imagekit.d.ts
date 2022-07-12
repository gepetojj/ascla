declare module "imagekitio-react" {
	interface LQIP {
		quality?: number;
		threshold?: number;
		blur?: number;
		raw?: string;
		active: boolean;
	}

	type IKImageProps = React.ImgHTMLAttributes & {
		loading?: "lazy";
		lqip?: LQIP;
		path?: string;
		src?: string;
		queryParameters?: Record<string, unknown>;
		transformation?: Transformation[];
		transformationPosition?: TransformationPosition;
		publicKey?: string;
		urlEndpoint?: string;
		authenticationEndpoint?: string;
	};

	// declare class IKImage extends React.PureComponent<IKImageProps & React.ImgHTMLAttributes, any> {}
	// export {IKImage};
	export function IKImage(props: IKImageProps): JSX.Element;
}
