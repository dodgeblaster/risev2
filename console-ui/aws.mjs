import {
    CloudWatchClient,
    GetMetricDataCommand
} from '@aws-sdk/client-cloudwatch'

/* 
{
    "metrics": [
        [ "AWS/AmplifyHosting", "Requests", "App", "d3ncjv9nmfis0w", { "region": "us-east-1" } ]
    ],
    "view": "timeSeries",
    "stacked": false,
    "region": "us-east-1",
    "title": "Traffic",
    "period": 300,
    "stat": "Sum"
}

*/
export async function getMetrics(profile) {
    const client = new CloudWatchClient({ profile: 'starcoprod' })

    // const currentTimestamp = Math.floor(Date.now() / 1000)
    // const oneDay = 24 * 60 * 60 * 1000
    // const oneDayAgo = Math.floor((Date.now() - oneDay) / 1000)

    const today = new Date()
    const oneDayAgo = new Date(today)
    oneDayAgo.setDate(today.getDate() - 14)
    const ii = {
        MetricDataQueries: [
            {
                Id: 'traffic',
                MetricStat: {
                    Metric: {
                        Namespace: 'AWS/AmplifyHosting',
                        MetricName: 'Requests',
                        Dimensions: [
                            {
                                Name: 'App',
                                Value: 'd3ncjv9nmfis0w'
                            }
                        ]
                    },
                    Period: 30 * 60 * 4,
                    Stat: 'Sum'
                }
            },
            {
                Id: 'lat',
                MetricStat: {
                    Metric: {
                        Namespace: 'AWS/AmplifyHosting',
                        MetricName: 'Latency',
                        Dimensions: [
                            {
                                Name: 'App',
                                Value: 'd3ncjv9nmfis0w'
                            }
                        ]
                    },
                    Period: 30 * 60 * 4,
                    Stat: 'Sum'
                }
            },
            {
                Id: 'errors',
                MetricStat: {
                    Metric: {
                        Namespace: 'AWS/AmplifyHosting',
                        MetricName: '5xxErrors',
                        Dimensions: [
                            {
                                Name: 'App',
                                Value: 'd3ncjv9nmfis0w'
                            }
                        ]
                    },
                    Period: 60 * 60 * 4,
                    Stat: 'Sum'
                }
            }
        ],
        StartTime: oneDayAgo,
        EndTime: new Date(),
        // MaxDatapointsReturned: 100800,
        ScanBy: 'TimestampAscending'
    }
    // const input = {
    //     // GetMetricDataInput
    //     MetricDataQueries: [
    //         // MetricDataQueries // required
    //         {
    //             // MetricDataQuery
    //             Id: 'STRING_VALUE', // required
    //             MetricStat: {
    //                 // MetricStat
    //                 Metric: {
    //                     // Metric
    //                     Namespace: 'STRING_VALUE',
    //                     MetricName: 'STRING_VALUE',
    //                     Dimensions: [
    //                         // Dimensions
    //                         {
    //                             // Dimension
    //                             Name: 'STRING_VALUE', // required
    //                             Value: 'STRING_VALUE' // required
    //                         }
    //                     ]
    //                 },
    //                 Period: Number('int'), // required
    //                 Stat: 'STRING_VALUE', // required
    //                 Unit:
    //                     'Seconds' ||
    //                     'Microseconds' ||
    //                     'Milliseconds' ||
    //                     'Bytes' ||
    //                     'Kilobytes' ||
    //                     'Megabytes' ||
    //                     'Gigabytes' ||
    //                     'Terabytes' ||
    //                     'Bits' ||
    //                     'Kilobits' ||
    //                     'Megabits' ||
    //                     'Gigabits' ||
    //                     'Terabits' ||
    //                     'Percent' ||
    //                     'Count' ||
    //                     'Bytes/Second' ||
    //                     'Kilobytes/Second' ||
    //                     'Megabytes/Second' ||
    //                     'Gigabytes/Second' ||
    //                     'Terabytes/Second' ||
    //                     'Bits/Second' ||
    //                     'Kilobits/Second' ||
    //                     'Megabits/Second' ||
    //                     'Gigabits/Second' ||
    //                     'Terabits/Second' ||
    //                     'Count/Second' ||
    //                     'None'
    //             },
    //             Expression: 'STRING_VALUE',
    //             Label: 'STRING_VALUE',
    //             ReturnData: true || false,
    //             Period: Number('int'),
    //             AccountId: 'STRING_VALUE'
    //         }
    //     ],
    //     StartTime: new Date('TIMESTAMP'), // required
    //     EndTime: new Date('TIMESTAMP'), // required
    //     NextToken: 'STRING_VALUE',
    //     ScanBy: 'TimestampDescending' || 'TimestampAscending',
    //     MaxDatapoints: Number('int'),
    //     LabelOptions: {
    //         // LabelOptions
    //         Timezone: 'STRING_VALUE'
    //     }
    // }
    const command = new GetMetricDataCommand(ii)
    const response = await client.send(command)
    // console.log(response.MetricDataResults[0])
    return response.MetricDataResults.map((x) => x.Values)
}
