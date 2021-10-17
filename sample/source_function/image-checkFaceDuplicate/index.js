const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = async (event) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    var params = {
        CollectionId: process.env.REKOGNITION_COLLECTION_ID,
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        },
        FaceMatchThreshold: 70.0,
        MaxFaces: 3
    };
    const data = await rekognition.searchFacesByImage(params).promise();
    if (data.FaceMatches.length > 0) {
        throw new FaceAlreadyExistsError();
    } else {
        return {};
    }
};

function FaceAlreadyExistsError() {
    this.name = "FaceAlreadyExistsError";
    this.message = "Face in the picture is already in the system. ";
}
FaceAlreadyExistsError.prototype = new Error();
