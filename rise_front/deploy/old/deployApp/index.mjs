import * as cli from 'rise-cli-foundation'
import * as filesystem from 'rise-filesystem-foundation'
import { deployApplication } from './deployApplicationStack.mjs'
import process from 'node:process'
import * as deploycode from 'rise-deploycode'

export async function deployBackend(config) {
    cli.clear()
    console.time('✅ Deployed Successfully \x1b[2mDeploy Time')
    cli.hideCursor()

    /**
     * Zip Code
     */
    await deploycode.zipCode({
        functionsLocation: config.zipConfig.functionsLocation,
        zipTarget: config.zipConfig.zipTarget
    })

    const deployName = config.deployName

    /**
     * Deploy Bucket
     */
    if (!config.app.bucketName) {
        const bucketName = await deploycode.deployCodeBucket({
            name: deployName,
            stage: '', //config.app.stage,
            region: config.app.region
        })

        filesystem.writeFile({
            path: '/.rise/data.mjs',
            content: `export const config = { bucketName: "${bucketName}"}`,
            projectRoot: process.cwd()
        })

        config.app.bucketName = bucketName
    }

    /**
     * Upload code to S3
     */
    cli.clear()
    cli.startLoadingMessage('Uploading code to AWS S3')
    await deploycode.uploadCode({
        bucketName: config.app.bucketName,
        functionsLocation: config.zipConfig.functionsLocation,
        zipTarget: config.zipConfig.zipTarget,
        hiddenFolder: config.zipConfig.hiddenFolder
    })
    cli.endLoadingMessage()

    /**
     * Deploy Application
     */
    cli.clear()
    if (config.deployInfra) {
        cli.startLoadingMessage('Preparing CloudFormation Template')
        const deployResult = await deployApplication({
            region: config.app.region,
            appName: config.app.appName,
            bucketArn: 'arn:aws:s3:::' + config.app.bucketName,
            stage: '', //config.app.stage,
            config: config.functions,
            zipConfig: config.zipConfig,
            additionalResources: config.additionalResources,
            auth: config.app.auth,
            domain: config.app.domain
        })

        /**
         * Update Code
         */
        cli.clear()
        cli.startLoadingMessage('Updating Lambda Functions')
        await deploycode.updateLambdaCode({
            appName: config.app.appName,
            bucket: config.app.bucketName,
            stage: '', //config.app.stage,
            zipConfig: config.zipConfig,
            region: config.app.region
        })

        cli.endLoadingMessage()

        /**
         * Display Result
         */
        cli.clear()
        console.timeEnd('✅ Deployed Successfully \x1b[2mDeploy Time')
        console.log('')

        if (deployResult.endpoints) {
            cli.printInfoMessage('Endpoints')
            deployResult.endpoints.forEach((x) => {
                cli.print(cli.makeDimText(x))
            })
        }

        if (deployResult.userPoolClient) {
            console.log('')
            cli.printInfoMessage('User Pool Details')
            cli.print(cli.makeDimText('PoolId:   ' + deployResult.userPool))
            cli.print(
                cli.makeDimText('ClientId: ' + deployResult.userPoolClient)
            )
        }

        cli.showCursor()
    } else {
        /**
         * Update Code
         */
        cli.clear()
        cli.startLoadingMessage('Updating Lambda Functions')
        await deploycode.updateLambdaCode({
            appName: config.app.appName,
            bucket: config.app.bucketName,
            stage: '', //,config.app.stage,
            zipConfig: config.zipConfig,
            region: config.app.region
        })

        cli.endLoadingMessage()
        cli.clear()
        console.timeEnd('✅ Deployed Successfully \x1b[2mDeploy Time')
        cli.showCursor()
    }
}

export async function removeBackend(config) {
    /**
     * Get project  info locally
     */
    const region = config.region
    let projectData = {
        name: config.name,
        bucketName: config.bucketName
    }

    /**
     * Get Project info remotely if local isnt available
     */
    const deployName = config.deployName
    if (!projectData.bucketName) {
        const stackName = deployName + '-bucket'
        const { MainBucket } = await aws.cloudformation.getOutputs({
            stack: stackName,
            outputs: ['MainBucket']
        })

        projectData.bucketName = MainBucket
    }

    const stackName = deployName + '-bucket'

    /**
     * Empty bucket
     */
    await deploycode.emptyCodeBucket({
        bucketName: projectData.bucketName
    })

    /**
     * Remove stack
     */
    await aws.cloudformation.removeStack({
        name: stackName,
        region,
        template: ''
    })

    await filesystem.removeDir({
        path: '/' + config.zipConfig.hiddenFolder,
        projectRoot: process.cwd()
    })
    cli.clear()
    cli.printSuccessMessage('Removal Successfully Initialized')
}
