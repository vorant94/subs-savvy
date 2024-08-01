import { useMediaQuery } from "@mantine/hooks";
import {
	type PropsWithChildren,
	createContext,
	memo,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	type Breakpoint,
	breakpointToMediaQuery,
} from "../types/breakpoint.ts";

export function useBreakpoint(breakpoint: Breakpoint): boolean {
	return useContext(breakpointsContext)[breakpoint];
}

export const BreakpointsProvider = memo(({ children }: PropsWithChildren) => {
	const [isSm, setIsSm] = useState(false);
	const isSmFromMediaQuery = useMediaQuery(breakpointToMediaQuery.sm);
	useEffect(() => {
		if (
			typeof isSmFromMediaQuery !== "undefined" &&
			isSm !== isSmFromMediaQuery
		) {
			setIsSm(isSmFromMediaQuery);
		}
	}, [isSmFromMediaQuery, isSm]);

	const [isMd, setIsMd] = useState(false);
	const isMdFromMediaQuery = useMediaQuery(breakpointToMediaQuery.sm);
	useEffect(() => {
		if (
			typeof isMdFromMediaQuery !== "undefined" &&
			isMd !== isMdFromMediaQuery
		) {
			setIsMd(isMdFromMediaQuery);
		}
	}, [isMdFromMediaQuery, isMd]);

	const [isLg, setIsLg] = useState(false);
	const isLgFromMediaQuery = useMediaQuery(breakpointToMediaQuery.sm);
	useEffect(() => {
		if (
			typeof isLgFromMediaQuery !== "undefined" &&
			isLg !== isLgFromMediaQuery
		) {
			setIsLg(isLgFromMediaQuery);
		}
	}, [isLgFromMediaQuery, isLg]);

	const [isXl, setIsXl] = useState(false);
	const isXlFromMediaQuery = useMediaQuery(breakpointToMediaQuery.sm);
	useEffect(() => {
		if (
			typeof isXlFromMediaQuery !== "undefined" &&
			isXl !== isXlFromMediaQuery
		) {
			setIsXl(isXlFromMediaQuery);
		}
	}, [isXlFromMediaQuery, isXl]);

	const [is2xl, setIs2xl] = useState(false);
	const is2xlFromMediaQuery = useMediaQuery(breakpointToMediaQuery.sm);
	useEffect(() => {
		if (
			typeof is2xlFromMediaQuery !== "undefined" &&
			is2xl !== is2xlFromMediaQuery
		) {
			setIs2xl(is2xlFromMediaQuery);
		}
	}, [is2xlFromMediaQuery, is2xl]);

	return (
		<breakpointsContext.Provider
			value={{ sm: isSm, md: isMd, lg: isLg, xl: isXl, "2xl": is2xl }}
		>
			{children}
		</breakpointsContext.Provider>
	);
});

const breakpointsContext = createContext<Record<Breakpoint, boolean>>({
	sm: false,
	md: false,
	lg: false,
	xl: false,
	"2xl": false,
});
