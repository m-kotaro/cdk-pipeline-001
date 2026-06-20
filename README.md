# cdk-pipeline-001

S3 + CloudFront の静的サイトを CDK Pipelines で dev/prd にデプロイする。

## セットアップ

### CDK Bootstrap

AWS CloudShell を開いて以下を実行する。

```bash
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export REGION=ap-northeast-1

npx cdk bootstrap aws://${ACCOUNT_ID}/${REGION}
```

### CodeConnection の作成

[cfn/README.md](./cfn/README.md) を参照。

### GitHub に push して Pipeline デプロイ

[cdk/README.md](./cdk/README.md) を参照。
