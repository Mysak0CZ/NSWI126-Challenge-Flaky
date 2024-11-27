/* eslint-env node */
/**
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 * @type { import('jest').Config }
 */
module.exports = {
	clearMocks: true,
	errorOnDeprecated: true,
	moduleNameMapper: {
		'\\.s?css$': '<rootDir>/test/stubs/stylesheetStub.ts',
	},
	testEnvironment: 'jsdom',
	transformIgnorePatterns: [],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {
			tsconfig: './test/tsconfig.json',
			isolatedModules: true,
		}],
		'^.+\\.mjsx?$': ['babel-jest', {
			'presets': ['@babel/preset-env'],
		}],
	},
};
