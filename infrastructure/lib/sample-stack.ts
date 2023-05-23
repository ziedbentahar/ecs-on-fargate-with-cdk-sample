import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Certificate } from "./certificate";
import { ECSService } from "./ecs-service";
import { Route53Record } from "./route53-record";
import { SampleVPC } from "./vpc";

class SampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new SampleVPC(this, SampleVPC.name, {});

    const applicationName = this.node.tryGetContext("applicationName");
    const hostedZoneDomainName = this.node.tryGetContext(
      "hostedZoneDomainName"
    );

    const domainName = `${applicationName}.${hostedZoneDomainName}`;

    const certificate = new Certificate(this, Certificate.name, {
      hostedZoneDomainName,
      domainName,
    });

    const ecsServiceStack = new ECSService(this, ECSService.name, {
      certificate: certificate.certificate,
      vpc: vpc.vpc,
      applicationName,
    });

    const records = new Route53Record(this, Route53Record.name, {
      hostedZoneDomainName,
      applicationName,
      loadBalancer: ecsServiceStack.loadBalancer,
    });
  }
}

export { SampleStack };
