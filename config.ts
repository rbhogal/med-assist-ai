interface Config {
  useMockApi: boolean;
  useRateLimiting: boolean;
}

const config: Config = {
  useMockApi: true,
  useRateLimiting: true, // Uses upstash rate limiting to limit number of requests per user
};

export default config;
