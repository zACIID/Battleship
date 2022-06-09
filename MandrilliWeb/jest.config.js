module.exports = {
    preset: 'jest-preset-angular',
    roots: ['./tests/', './src'],
    setupFilesAfterEnv: ['./tests/setup-jest.ts'],
    collectCoverage: true,
    coverageReporters: ['html'],
    coverageDirectory: 'coverage/my-app',
};
