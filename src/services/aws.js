const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getSignedUrl: getCloudFrontSignedUrl } = require('@aws-sdk/cloudfront-signer');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Generate a temporary POST policy/URL for uploading raw video to S3.
 * We use PutObject command signed url here for simplicity.
 */
const generateUploadUrl = async (key, contentType) => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    // Valid for 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

/**
 * Generate a signed CloudFront URL for playing content.
 * @param {string} s3Key - The path to the file (or HLS manifest)
 * @param {number} expiresInSeconds - How long the link is valid
 */
const generatePlaybackUrl = (s3Key, expiresInSeconds = 3600) => {
    const url = `${process.env.CLOUDFRONT_DOMAIN}/${s3Key}`;

    // Date must be in UTC
    const dateLessThan = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    // CloudFront requires the private key as a string
    const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
    const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;

    return getCloudFrontSignedUrl({
        url,
        dateLessThan,
        privateKey,
        keyPairId,
    });
};

module.exports = {
    s3Client,
    generateUploadUrl,
    generatePlaybackUrl,
};
