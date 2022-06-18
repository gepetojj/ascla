import { Editor } from "@tiptap/react";

import React, { createContext, FC, ReactNode, useContext } from "react";

export interface EditorContext {
	editor: Editor | null;
}

export interface EditorProvider {
	children: ReactNode;
	editor: Editor | null;
}

export const EditorContext = createContext<EditorContext>({ editor: null });

export const EditorProvider: FC<EditorProvider> = ({ children, editor }) => {
	return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>;
};

export const useEditor = () => useContext(EditorContext);
