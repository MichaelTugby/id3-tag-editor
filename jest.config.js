module.exports = {
    "collectCoverage": true,
    "collectCoverageFrom": [
        "src/renderer/**/*.vue"
    ],
    "transform": {
        "^.+\\.ts?$": "ts-jest",
        "^.+\\.vue?$": "vue-jest"
    },
    "moduleFileExtensions": [
        "ts",
        "js",
        "vue"
    ],
    "moduleNameMapper": {
        "^.+\\.(styl)$": "<rootDir>/src/assets/styl/mock.js",
        "~(.*)$": "<rootDir>/$1"
    },
    "snapshotSerializers": [
        "jest-serializer-vue"
    ],
    "testMatch": [
        "**/*.test.ts",
        "**/*.e2e.ts"
    ]
}