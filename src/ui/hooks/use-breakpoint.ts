import { useMediaQuery } from "@mantine/hooks";
import {
	breakpointToMediaQuery,
	type Breakpoint,
} from "../types/breakpoint.ts";

export function useBreakpoint(breakpoint: Breakpoint): boolean | undefined {
	return useMediaQuery(breakpointToMediaQuery[breakpoint]);
}
