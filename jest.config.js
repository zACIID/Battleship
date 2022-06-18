module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./tests', './src'],
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['./tests/setup-jest.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['./src/**'],
};
