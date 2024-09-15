export default {
  testTimeout: 30000,
  verbose: true,
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  setupFiles: ["./__tests__/setup.js"],
  setupFilesAfterEnv: ["./__tests__/tearDown.js"],
};
