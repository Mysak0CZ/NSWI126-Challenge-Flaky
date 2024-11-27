class JestCustomReporter {
	constructor(globalConfig, reporterOptions, reporterContext) {
		this._globalConfig = globalConfig;
		this._options = reporterOptions;
		this._context = reporterContext;
	}

	/**
	 * 
	 * @param {Set<import("@jest/test-result").TestContext>} testContexts 
	 * @param {import("@jest/test-result").AggregatedResult} results 
	 */
	onRunComplete(testContexts, results) {
		const targetPath = require("path").join(__dirname, 'results.json');
		require("fs").writeFileSync(targetPath, JSON.stringify(results.testResults, undefined, '\t'));
		console.log('Custom reporter saved results.');
	}
}

module.exports = JestCustomReporter;
