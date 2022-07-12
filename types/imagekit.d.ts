declare module "imagekitio-react" {
	interface LQIP {
		quality?: number;
		threshold?: number;
		blur?: number;
		raw?: string;
		active: boolean;
	}

	interface IKImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
		loading?: "lazy";
		lqip?: LQIP;
		path?: string;
		src?: string;
		queryParameters?: Record<string, unknown>;
		transformation?: Record<string, unknown>[];
		publicKey?: string;
		urlEndpoint?: string;
		authenticationEndpoint?: string;
	}

	interface IKContextProps {
		children: React.ReactNode;
		urlEndpoint?: string;
		publicKey?: string;
		authenticationEndpoint?: string;
	}

	interface IKUploadResponse {
		fileId: string;
		filePath: string;
		fileType: string;
		width: number;
		height: number;
		name: string;
		size: number;
		thumbnailUrl?: string;
		url: string;
	}

	interface IKUploadProps {
		fileName: string;
		tags?: string[];
		useUniqueFileName?: boolean;
		isPrivateFile?: boolean;
		folder?: string;
		onError?: (err: Error) => void;
		onSuccess?: (res: IKUploadResponse) => void;
	}

	export function IKImage(props: IKImageProps): JSX.Element;
	export function IKContext(props: IKContextProps): JSX.Element;
	export function IKUpload(props: IKUploadProps): JSX.Element;
}
