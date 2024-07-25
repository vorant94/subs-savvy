import { useMediaQuery } from "@mantine/hooks";
import {
	type Breakpoint,
	breakpointToMediaQuery,
} from "../types/breakpoint.ts";

export function useBreakpoint(breakpoint: Breakpoint): boolean | undefined {
	return useMediaQuery(breakpointToMediaQuery[breakpoint]);
}
