import { useDisclosure, usePrevious } from "@mantine/hooks";
import {
	type PropsWithChildren,
	createContext,
	memo,
	useContext,
	useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import type { Disclosure } from "../types/disclosure.ts";
import { useDefaultLayoutStub } from "./use-default-layout.stub.ts";

export function useDefaultLayout(): UseDefaultLayout {
	return useContext(defaultLayoutContext);
}

export interface UseDefaultLayout {
	isDrawerOpened: boolean;
	drawer: Disclosure;
	isNavOpened: boolean;
	nav: Disclosure;
}

export const DefaultLayoutProvider = memo(({ children }: PropsWithChildren) => {
	const [isDrawerOpened, drawer] = useDisclosure(false);
	const [isNavOpened, nav] = useDisclosure(false);
	const { pathname } = useLocation();
	const prevPathname = usePrevious(pathname);

	useEffect(() => {
		if (pathname !== prevPathname) {
			nav.close();
		}
	}, [nav, pathname, prevPathname]);

	return (
		<defaultLayoutContext.Provider
			value={{ isDrawerOpened, drawer, isNavOpened, nav }}
		>
			{children}
		</defaultLayoutContext.Provider>
	);
});

const defaultLayoutContext =
	createContext<UseDefaultLayout>(useDefaultLayoutStub);
