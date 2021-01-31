import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/typeorm";
import ormconfig from './ormconfig'
import { OpenSpec3 } from "@tsed/openspec";

export const rootDir = __dirname;

const spec: Partial<OpenSpec3> = {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
}

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  port: 3000,
  mount: {
    '/':
      `${rootDir}/controllers/**/*.ts`
  },
  componentsScan: [
    `${rootDir}/middlewares/**/*.ts`
  ],
  swagger: [
    {
      path: "/docs",
      spec: spec
    }
  ],
  typeorm: ormconfig,
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
