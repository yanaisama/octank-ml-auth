const config = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "octank-ml-auth",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "YOUR_API_GATEWAY_URL",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_mka9sjOt1",
      APP_CLIENT_ID: "2fu2a5k5ehumcg3k7qu6dlp6f0",
      IDENTITY_POOL_ID: "us-east-1:877d278a-3e1a-4d86-9a5e-74763b61ea8e",
    },
  };
  
  export default config;