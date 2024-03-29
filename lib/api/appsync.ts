import { Construct } from 'constructs'
import * as path from 'path'
import {
	AuthorizationType,
	Definition,
	GraphqlApi,
	FieldLogLevel,
	FunctionRuntime,
	Code,
} from 'aws-cdk-lib/aws-appsync'
import { UserPool } from 'aws-cdk-lib/aws-cognito'

type AppSyncAPIProps = {
	appName: string
	userpool: UserPool
}

export const createAppSyncAPI = (scope: Construct, props: AppSyncAPIProps) => {
	const api = new GraphqlApi(scope, `${props.appName}`, {
		name: props.appName,
		definition: Definition.fromFile(path.join(__dirname, 'schema.graphql')),
		authorizationConfig: {
			defaultAuthorization: {
				authorizationType: AuthorizationType.IAM,
			},
			additionalAuthorizationModes: [
				{
					authorizationType: AuthorizationType.USER_POOL,
					userPoolConfig: { userPool: props.userpool },
				},
			],
		},
		logConfig: {
			fieldLogLevel: FieldLogLevel.ALL,
		},
	})

	const noneDS = api.addNoneDataSource('noneDS')

	noneDS.createResolver('pushMsgResolver', {
		typeName: 'Mutation',
		fieldName: 'publishMsgFromEB',
		code: Code.fromAsset(path.join(__dirname, 'publishMsg.js')),
		runtime: FunctionRuntime.JS_1_0_0,
	})

	return api
}
