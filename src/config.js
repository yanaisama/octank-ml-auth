export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "octank-ml-auth-uploads"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_mka9sjOt1",
      APP_CLIENT_ID: "2fu2a5k5ehumcg3k7qu6dlp6f0",
      IDENTITY_POOL_ID: "us-east-1:50d404fb-d0a5-4cad-91b5-7b08e8c54b89"
    },
    API: {
      endpoints: [
        {
          name: "rekognition",
          endpoint: "https://rekognition.us-east-1.amazonaws.com",
          service: "rekognition",
          region: "us-east-1"
        }
      ]
    },
    social: {
      FB: "2002492656528231"
    }
  };
  