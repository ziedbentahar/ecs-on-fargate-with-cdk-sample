import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { IApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";

export interface ECSServiceProps extends NestedStackProps {
  vpc: IVpc;
  certificate: ICertificate;
  applicationName: string;
}

export class ECSService extends NestedStack {
  public readonly loadBalancer: IApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props?: ECSServiceProps) {
    super(scope, id, props);

    const { vpc, certificate, applicationName } = props!;

    const cluster = new Cluster(this, "Cluster", { vpc });
    const loadBalancedService = new ApplicationLoadBalancedFargateService(
      this,
      "FargateService",
      {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry(
            "brndnmtthws/nginx-echo-headers:latest"
          ),
          containerPort: 8080,
        },
        certificate,
      }
    );

    this.loadBalancer = loadBalancedService.loadBalancer;
  }
}
