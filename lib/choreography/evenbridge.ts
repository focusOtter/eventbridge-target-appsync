import { aws_events as events } from 'aws-cdk-lib'

import { EventBus } from 'aws-cdk-lib/aws-events'
import {
	Effect,
	PolicyDocument,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

type EventBridgeBusProps = {
	busName: string
	appsyncApiArn: string
	appsyncEndpointArn: string
	graphQlOperation: string
}
export const createEventBridge = (
	scope: Construct,
	props: EventBridgeBusProps
) => {
	const bus = new EventBus(scope, props.busName)

	// Create the Policy Statement
	const policyStatement = new PolicyStatement({
		effect: Effect.ALLOW,
		actions: ['appsync:GraphQL'],
		resources: [`${props.appsyncApiArn}/types/Mutation/*`],
	})

	// Create the Role and attach the policy
	const ebRuleRole = new Role(scope, 'AppSyncInvokeRole', {
		assumedBy: new ServicePrincipal('events.amazonaws.com'),
		inlinePolicies: {
			PolicyStatement: new PolicyDocument({
				statements: [policyStatement],
			}),
		},
	})

	const mycfnRule = new events.CfnRule(scope, 'cfnRule', {
		eventBusName: bus.eventBusName,
		name: 'mycfnRule',
		eventPattern: {
			source: ['sample.source'],
		},
		targets: [
			{
				id: 'myAppsyncTarget',
				arn: props.appsyncEndpointArn,
				roleArn: ebRuleRole.roleArn,
				appSyncParameters: {
					graphQlOperation: props.graphQlOperation,
				},
				inputTransformer: {
					inputPathsMap: {
						msg: '$.detail.msg',
					},
					inputTemplate: JSON.stringify({
						msg: '<msg>',
					}),
				},
			},
		],
	})

	return { bus, mycfnRule }
}
