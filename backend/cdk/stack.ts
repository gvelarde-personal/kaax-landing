import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigatewayv2Integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

export class KaaxApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import existing secret
    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "KaaxSecret",
      "kaax-api-secrets"
    );

    // Lambda function
    const api = new lambda.Function(this, "KaaxAPI", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../dist"),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        SECRET_ARN: secret.secretArn,
        FRONTEND_URL: process.env.FRONTEND_URL || "https://kaax.ai",
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      architecture: lambda.Architecture.ARM_64,
    });

    // Grant Lambda permission to read the secret
    secret.grantRead(api);

    // API Gateway HTTP API
    const httpApi = new apigatewayv2.HttpApi(this, "KaaxHttpApi", {
      description: "Kaax AI API",
      corsPreflight: {
        allowOrigins: [
          process.env.FRONTEND_URL || "https://kaax.ai",
          "http://localhost:3000",
        ],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.PUT,
          apigatewayv2.CorsHttpMethod.DELETE,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ["*"],
        allowCredentials: true,
      },
      defaultIntegration: new apigatewayv2Integrations.HttpLambdaIntegration(
        "LambdaIntegration",
        api
      ),
    });

    // Import certificate (will be validated)
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      "arn:aws:acm:us-east-1:301782007691:certificate/636a2174-061a-41cb-962a-2020baf96209"
    );

    // Custom Domain
    const customDomain = new apigatewayv2.DomainName(this, "CustomDomain", {
      domainName: "auth.kaax.ai",
      certificate: certificate,
    });

    // API Mapping
    new apigatewayv2.ApiMapping(this, "ApiMapping", {
      api: httpApi,
      domainName: customDomain,
    });

    // Outputs
    new cdk.CfnOutput(this, "ApiUrl", {
      value: httpApi.url!,
      description: "HTTP API URL",
    });

    new cdk.CfnOutput(this, "CustomDomainUrl", {
      value: `https://auth.kaax.ai`,
      description: "Custom Domain URL",
    });

    new cdk.CfnOutput(this, "DomainTarget", {
      value: customDomain.regionalDomainName,
      description: "CNAME Target for Squarespace DNS",
    });

    new cdk.CfnOutput(this, "FunctionName", {
      value: api.functionName,
      description: "Lambda Function Name",
    });

    new cdk.CfnOutput(this, "FunctionArn", {
      value: api.functionArn,
      description: "Lambda Function ARN",
    });

    new cdk.CfnOutput(this, "SecretArn", {
      value: secret.secretArn,
      description: "Secrets Manager Secret ARN",
    });
  }
}
