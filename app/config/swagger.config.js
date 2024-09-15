import swaggerJsdoc from "swagger-jsdoc";
import swaggerAutogen from "swagger-autogen";

const swaggerOptions = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      title: "Chimikee API",
      description: "Chimikee API",
      contact: {
        name: "Softup LLC",
        email: "info@softup.io",
      },
    },
  },
  apis: ["../routes/*.routes.js"],
  info: {
    title: "Chimikee API",
    description: "Chimikee API",
    contact: {
      name: "Softup LLC",
      email: "info@softup.io",
    },
  },
  host: "localhost:8080",
  basePath: "/api/v1",
};

const outputFile = "../../swagger_output.json";
const endpointsFiles = ["../routes/index.js"];

swaggerAutogen()(outputFile, endpointsFiles, swaggerOptions);

export default swaggerJsdoc(swaggerOptions);
