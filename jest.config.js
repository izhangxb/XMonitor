
//jest 配置
module.exports = {
    rootDir: '',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx)?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: ['<rootDir>/test/**/*.(js|jsx|ts|tsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
};
