module.exports = {
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    ".*\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
  },
  "transform": {
    "^.+\\.[t|j]sx?$": "ts-jest"
  },
  "testMatch": [
    "**/__tests__/**/*.test.(t|j)s",
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/build/*"
  ],
  "modulePathIgnorePatterns": [
    "<rootDir>/build/*"
  ]
}