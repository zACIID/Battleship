module.exports = {
    preset: 'jest-preset-angular',
    roots: ['./tests/'],
    setupFilesAfterEnv: [
        "./tests/setup-jest.ts"
    ],
    collectCoverage: true,
    coverageReporters: ['html'],
    coverageDirectory: 'coverage/my-app',
};
