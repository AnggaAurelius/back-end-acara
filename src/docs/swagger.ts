import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsfiles = ["../routes/api.ts"];
const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi",
    description: "Dokumentasi",
  },
  servers: [
    {
      url: " http://localhost:3000/api/",
      description: "Local Server",
    },
    {
      url: " https://back-end-acara-beta-lilac.vercel.app/api/",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "vayne",
        password: "123456",
      },
      RegisterRequest: {
        fullName: "vayne",
        userName: "vayne",
        email: "vayne@gmail.com",
        password: "123456",
        confirmPassword: "123456",
      },
      ActivaionRequset: {
        code: "abcdef",
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsfiles, doc);
