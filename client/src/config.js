const liveConfig = {
  apiUrl: process.env.REACT_APP_LIVE_API_URL,
};
const demoConfig = {
  apiUrl: process.env.REACT_APP_DEMO_API_URL,
};

const config = liveConfig;

console.log("config",liveConfig, config)

export default config;
