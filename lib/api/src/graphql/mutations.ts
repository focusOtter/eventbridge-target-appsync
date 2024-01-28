/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const publishMsgFromEB = /* GraphQL */ `mutation PublishMsgFromEB($msg: String!) {
  publishMsgFromEB(msg: $msg)
}
` as GeneratedMutation<
  APITypes.PublishMsgFromEBMutationVariables,
  APITypes.PublishMsgFromEBMutation
>;
