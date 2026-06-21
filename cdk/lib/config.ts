export const config = {
  projectName: "cp001",
  region: "ap-northeast-1",
  repository: "m-kotaro/cdk-pipeline-001",
  branch: "main",
  stages: {
    dev: "dev",
    prd: "prd",
  },
} as const;

export type StageName = (typeof config.stages)[keyof typeof config.stages];
