import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class KaaxApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function
    const api = new lambda.Function(this, "KaaxAPI", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../dist", {
        exclude: ["*.ts", "*.map"],
      }),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        NODE_ENV: process.env.NODE_ENV || "production",
        DATABASE_URL: process.env.DATABASE_URL || "",
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
        STRIPE_SECRET_KEY_PROD: process.env.STRIPE_SECRET_KEY_PROD || "",
        STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID || "",
        STRIPE_PRICE_ID_PROD: process.env.STRIPE_PRICE_ID_PROD || "",
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
        STRIPE_WEBHOOK_SECRET_PROD: process.env.STRIPE_WEBHOOK_SECRET_PROD || "",
        FRONTEND_URL: process.env.FRONTEND_URL || "https://kaax.ai",
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      architecture: lambda.Architecture.ARM_64, // Graviton2 - más barato y rápido
    });

    // Function URL (HTTP endpoint público)
    const functionUrl = api.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: [
          process.env.FRONTEND_URL || "https://kaax.ai",
          "http://localhost:3000",
        ],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ["*"],
        allowCredentials: true,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, "ApiUrl", {
      value: functionUrl.url,
      description: "API Gateway URL",
    });

    new cdk.CfnOutput(this, "FunctionName", {
      value: api.functionName,
      description: "Lambda Function Name",
    });

    new cdk.CfnOutput(this, "FunctionArn", {
      value: api.functionArn,
      description: "Lambda Function ARN",
    });
  }
}
