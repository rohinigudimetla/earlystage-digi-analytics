/**
 * Performance Monitoring Utility
 * Tracks and logs component render times, API calls, and page load performance
 */

export class PerformanceMonitor {
	private static marks: Map<string, number> = new Map();

	/**
	 * Start timing an operation
	 */
	static start(label: string): void {
		this.marks.set(label, performance.now());
		if (typeof window !== "undefined" && performance.mark) {
			performance.mark(`${label}-start`);
		}
	}

	/**
	 * End timing and log the duration
	 */
	static end(label: string): number {
		const startTime = this.marks.get(label);
		if (!startTime) {
			console.warn(`⚠️ No start mark found for: ${label}`);
			return 0;
		}

		const duration = performance.now() - startTime;
		this.marks.delete(label);

		if (typeof window !== "undefined" && performance.mark) {
			performance.mark(`${label}-end`);
			try {
				performance.measure(label, `${label}-start`, `${label}-end`);
			} catch (e) {
				// Measure might fail if marks were cleared
			}
		}

		// Color-coded logging based on duration
		const emoji = duration < 100 ? "⚡" : duration < 500 ? "⏱️" : "🐌";
		const color = duration < 100 ? "green" : duration < 500 ? "orange" : "red";

		console.log(
			`%c${emoji} ${label}: ${duration.toFixed(2)}ms`,
			`color: ${color}; font-weight: bold`
		);

		return duration;
	}

	/**
	 * Measure an async function
	 */
	static async measure<T>(
		label: string,
		fn: () => Promise<T>
	): Promise<{ result: T; duration: number }> {
		this.start(label);
		const result = await fn();
		const duration = this.end(label);
		return { result, duration };
	}

	/**
	 * Measure a sync function
	 */
	static measureSync<T>(
		label: string,
		fn: () => T
	): { result: T; duration: number } {
		this.start(label);
		const result = fn();
		const duration = this.end(label);
		return { result, duration };
	}

	/**
	 * Get all performance entries
	 */
	static getEntries(): PerformanceEntry[] {
		if (typeof window === "undefined" || !performance.getEntriesByType) {
			return [];
		}
		return performance.getEntriesByType("measure");
	}

	/**
	 * Clear all performance marks and measures
	 */
	static clear(): void {
		this.marks.clear();
		if (typeof window !== "undefined" && performance.clearMarks) {
			performance.clearMarks();
			performance.clearMeasures();
		}
	}

	/**
	 * Log page load metrics
	 */
	static logPageLoadMetrics(): void {
		if (typeof window === "undefined" || !performance.timing) {
			return;
		}

		const timing = performance.timing;
		const metrics = {
			"DNS Lookup": timing.domainLookupEnd - timing.domainLookupStart,
			"TCP Connection": timing.connectEnd - timing.connectStart,
			"Server Response": timing.responseEnd - timing.requestStart,
			"DOM Processing": timing.domComplete - timing.domLoading,
			"Page Load": timing.loadEventEnd - timing.navigationStart,
		};

		console.log("%c📊 Page Load Metrics:", "color: blue; font-weight: bold");
		Object.entries(metrics).forEach(([name, duration]) => {
			const emoji = duration < 100 ? "⚡" : duration < 500 ? "⏱️" : "🐌";
			console.log(`  ${emoji} ${name}: ${duration}ms`);
		});
	}

	/**
	 * Monitor API call performance
	 */
	static async monitorApiCall<T>(
		url: string,
		options?: RequestInit
	): Promise<{ data: T; duration: number }> {
		const label = `API Call: ${url}`;
		this.start(label);

		try {
			const response = await fetch(url, options);
			const data = await response.json();
			const duration = this.end(label);

			return { data, duration };
		} catch (error) {
			this.end(label);
			throw error;
		}
	}
}

/**
 * React Hook for component render performance
 */
export function usePerformanceMonitor(componentName: string) {
	if (typeof window === "undefined") return;

	const renderCount = React.useRef(0);
	const renderTimes: number[] = [];

	React.useEffect(() => {
		renderCount.current++;
		const label = `${componentName} Render #${renderCount.current}`;
		PerformanceMonitor.start(label);

		return () => {
			const duration = PerformanceMonitor.end(label);
			renderTimes.push(duration);

			if (renderCount.current % 5 === 0) {
				const avg = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
				console.log(
					`📈 ${componentName} - Average render time: ${avg.toFixed(2)}ms (${
						renderCount.current
					} renders)`
				);
			}
		};
	});
}

// Make React available
import React from "react";
