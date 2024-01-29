import { Construct } from 'constructs'
import * as awsCognito from 'aws-cdk-lib/aws-cognito'
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha'

type CreateCognitoProps = {
	appName: string
}

export function createCognitoAuth(scope: Construct, props: CreateCognitoProps) {
	const userPool = new awsCognito.UserPool(scope, `${props.appName}-userpool`, {
		userPoolName: `${props.appName}-userpool`,
		selfSignUpEnabled: true,
		accountRecovery: awsCognito.AccountRecovery.PHONE_AND_EMAIL,
		userVerification: {
			emailStyle: awsCognito.VerificationEmailStyle.CODE,
		},
		autoVerify: {
			email: true,
		},
		standardAttributes: {
			email: {
				required: true,
				mutable: false,
			},
		},
	})

	const userPoolClient = new awsCognito.UserPoolClient(
		scope,
		`${props.appName}-userpool-client`,
		{
			userPool,
		}
	)

	const identityPool = new IdentityPool(
		scope,
		`${props.appName}-identitypool`,
		{
			identityPoolName: `${props.appName}-identitypool`,
			allowUnauthenticatedIdentities: true,
			authenticationProviders: {
				userPools: [
					new UserPoolAuthenticationProvider({
						userPool: userPool,
						userPoolClient: userPoolClient,
					}),
				],
			},
		}
	)

	return { userPool, userPoolClient, identityPool }
}
