# CloudFormation Templates

CDK Pipeline で利用する事前リソースを管理する。

## codeconnection.yaml

GitHub との CodeConnection を作成する。デプロイ後に AWS Console で手動承認が必要。

### Parameters

| Name | Description | Default |
|------|-------------|---------|
| Env | 環境コード (dev / prd) | - |
| ProjectName | プロジェクト名 | cdk-pipeline-001 |

### デプロイ

```bash
export ENV=dev
export PROJECT_NAME=cp001

aws cloudformation create-stack \
  --stack-name stack-${ENV}-${PROJECT_NAME}-codeconnection \
  --template-body file://cfn/codeconnection.yaml \
  --parameters \
    ParameterKey=Env,ParameterValue=${ENV} \
    ParameterKey=ProjectName,ParameterValue=${PROJECT_NAME}
```

### デプロイ後の手順

1. AWS Console → CodePipeline → 設定 → 接続 を開く
2. 作成された接続（`codeconnection-dev-cdk-pipeline-001-github`）を選択
3. 「保留中の接続を更新」から GitHub OAuth 認証を完了する
4. ステータスが `Available` になれば OK
