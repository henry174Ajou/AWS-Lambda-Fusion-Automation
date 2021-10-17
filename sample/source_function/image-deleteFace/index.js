const util = require('util');
const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = async (event) => {
    const srcBucket = event.s3Bucket;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    const faceId = event.parallelResult[0].FaceId;

    const params = {
        CollectionId: "rider-photos",
        FaceIds: [faceId]

    };


    const p = new Promise(function(res, rej){
        rekognition.deleteFaces(params, function(err, data){
            if(err){rej(err);}
            res(data);
        })
    })

    return await p;
}