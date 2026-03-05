#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { KaaxApiStack } from "./stack";

const app = new cdk.App();

new KaaxApiStack(app, "KaaxApiStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1",
  },
  description: "Kaax AI API - Hono on Lambda",
});

app.synth();
