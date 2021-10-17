const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = async (event) => {
    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    var params = {
        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
        DetectionAttributes: [],
        ExternalImageId: event.userId,
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        }
    };

    const data = await rekognition.indexFaces(params).promise();
    return data['FaceRecords'][0]['Face'];
}