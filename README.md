A sample of an application using CDK's L3 construct ApplicationLoadBalancedFargateService 

# prerequisites

a hosted zone needs to be created upfront on your accout for `your-hosted-zome.domain.name`


# To run


`cdk synth --require-approval never --profile <your-profile-name> --context hostedZoneDomainName=<your-hosted-zome.domain.name> --context applicationName=testing-host-header`
