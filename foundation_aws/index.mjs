// Account
import { getKeyword } from './account_getKeyword.mjs'

// CloudFormation
import { deployStack } from './cfn_deployStack.mjs'
import { getDeployStatus } from './cfn_getDeployStatus.mjs'
import { getOutputs } from './cfn_getOutputs.mjs'
import { removeStack } from './cfn_removeStack.mjs'

// Lambda
import { updateLambdaCode } from './lambda_updateLambdaCode.mjs'

// S3
//import { getFile } from './services/s3_getFile.mjs'
//import { getFileUrl } from './services/s3_getFileUrl.mjs'
//import { makeBucket } from './services/s3_makeBucket.mjs'
//import { makeSimpleBucket } from './services/s3_makeSimpleBucket.mjs'
import { removeFile } from './s3_removeFile.mjs'
import { uploadFile } from './s3_uploadFile.mjs'
import { emptyBucket } from './s3_emptyBucket.mjs'

export const account = {
    getKeyword
}

export const cloudformation = {
    deployStack,
    getDeployStatus,
    getOutputs,
    removeStack
}

export const lambda = {
    updateLambdaCode
}

export const s3 = {
    // getFile,
    // getFileUrl,
    // makeBucket,
    // makeSimpleBucket,
    removeFile,
    uploadFile,
    emptyBucket
}
