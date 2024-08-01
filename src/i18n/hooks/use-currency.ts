import { useState } from "react";

export function useCurrency(): string {
	const [currency] = useState("USD");

	// TODO connect to user settings currency once it is available

	return currency;
}
