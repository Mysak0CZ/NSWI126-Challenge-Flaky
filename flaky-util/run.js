const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const resultsPath = path.join(__dirname, 'results.json');

async function RunTests() {
	try {
		fs.unlinkSync(resultsPath)
	} catch (error) {
		// Ignore
	}
	try {
		console.log("Running tests...");
		child_process.execSync("pnpm run test");
	} catch (error) {
		return false;
	}
	return true;
}

/**
 * @typedef {object} TestData
 * @prop { 'ok' | 'irrelevant' | 'fail' | 'flaky' } result
 * @prop {string} name
 */

/**
 * @typedef {object} FileData
 * @prop {boolean} suiteFlaky
 * @prop {TestData[]} tests
 */

/**
 * @param {Map<string, FileData>} resultObject 
 */
function ProcessResults(resultObject) {
	// Hack: This should have checks. We assume it worked
	/** @type { import("@jest/test-result").TestResult[] } */
	const testResults = JSON.parse(fs.readFileSync(resultsPath));

	for (const result of testResults) {
		/** @type { FileData | undefined } */
		let object = resultObject.get(result.testFilePath);
		if (!object) {
			object = {
				suiteFlaky: false,
				tests: []
			};
			resultObject.set(result.testFilePath, object);
		}

		if (object.tests.length === 0) {
			for (const test of result.testResults) {
				const myResult = test.status === 'passed' ? 'ok' : test.status === 'failed' ? 'fail' : 'irrelevant';
				object.tests.push({
					result: myResult,
					name: test.ancestorTitles.join(' > ') + ' > ' + test.title,
				});
			}
		} else if (object.tests.length !== result.testResults.length) {
			object.suiteFlaky = true;
		} else {
			for (let i = 0; i < result.testResults.length; i++) {
				const test = result.testResults[i];
				const myResult = test.status === 'passed' ? 'ok' : test.status === 'failed' ? 'fail' : 'irrelevant';
				const testData = object.tests[i];
				if (testData.result !== myResult) {
					testData.result = 'flaky';
				}
			}
		}

	}
}

async function Run() {
	// Run the tests
	const firstSuccess = await RunTests();

	/** @type { Map<string, FileData> } */
	const resultSuites = new Map();
	ProcessResults(resultSuites)

	// If first run wasn't fully successful, rerun the suite a few times
	if (!firstSuccess) {
		for (let i = 0; i < 2; i++) {
			RunTests();
			ProcessResults(resultSuites);
		}
	}

	// Go through the results
	console.log("\n\n--- Flakiness results ---\n\n");
	for (const [suitePath, suite] of resultSuites.entries()) {
		if (suite.suiteFlaky) {
			console.log("\nSuite:", suitePath);
			console.log("Suite is flaky - different tests run at different runs");
			continue;
		}

		const hasFlaky = suite.tests.some((t) => t.result === 'flaky');
		if (!hasFlaky)
			continue;

		console.log("\nSuite:", suitePath);
		for (const test of suite.tests) {
			if (test.result !== 'flaky')
				continue;

			console.log('\tFlaky test: ', test.name);
		}
	}
}

Run();
