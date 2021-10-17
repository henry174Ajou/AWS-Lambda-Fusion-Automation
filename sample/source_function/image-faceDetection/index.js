const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = async (event) =>
{
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    const params = {
        Image: {
            S3Object: {
                Bucket: srcBucket,
                Name: srcKey
            }
        },
        Attributes: ['ALL']
    };

    const data = await rekognition.detectFaces(params).promise();

    console.log("Detection result from rekognition:\n", util.inspect(data, {depth: 5}));
    if (data.FaceDetails.length != 1) {
        throw new PhotoDoesNotMeetRequirementError("Detected " + data.FaceDetails.length + " faces in the photo.");
    }
    if (data.FaceDetails[0].Sunglasses.Value === true){
        throw new PhotoDoesNotMeetRequirementError("Face is wearing sunglasses");
    }
    const detectedFaceDetails = data.FaceDetails[0];

    // remove some fields not used in further processing to de-clutter the output.
    delete detectedFaceDetails['Landmarks'];

    return detectedFaceDetails;
};


function PhotoDoesNotMeetRequirementError(message) {
    this.name = "PhotoDoesNotMeetRequirementError";
    this.message = message;
}
PhotoDoesNotMeetRequirementError.prototype = new Error();
