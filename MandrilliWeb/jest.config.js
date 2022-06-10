module.exports = {
    verbose: true,
    preset: 'jest-preset-angular',
    testEnvironment: 'jsdom',
    roots: ['./tests', './src', '../src'],
    setupFilesAfterEnv: ['./tests/setup-jest.ts'],
    collectCoverage: true,
    coverageReporters: ['html'],
    coverageDirectory: 'coverage/my-app',
};
