import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import { config, StageName } from "./config";

export interface StaticSiteStackProps extends cdk.StackProps {
  stageName: StageName;
}

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const { stageName } = props;
    const pj = config.projectName;

    // S3 Bucket: s3-[env]-[project]-site
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `s3-${stageName}-${pj}-site`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy:
        stageName === "prd"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: stageName !== "prd",
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // CloudFront Distribution: cf-[env]-[project]-site
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      comment: `cf-${stageName}-${pj}-site`,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin:
          cloudfront_origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    // Outputs
    new cdk.CfnOutput(this, "BucketName", {
      value: siteBucket.bucketName,
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
  }
}
