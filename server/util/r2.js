const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: "auto", // Cloudflare R2 uses "auto"
    endpoint:
        "https://77deddaee89f96574507d9f33cfeda14.r2.cloudflarestorage.com/",

    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

async function uploadToR2(bucketName, key, body, contentType) {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        });
        const response = await s3Client.send(command);
        console.log("File uploaded successfully:", response);
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

function getR2Url(key) {
    return `https://pub-a3bd4211638e43128a7ee176466f1d4d.r2.dev/${key}`;
}

module.exports = {
    uploadToR2,
    getR2Url,
};
