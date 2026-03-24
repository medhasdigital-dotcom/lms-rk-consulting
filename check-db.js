const mongoose = require('mongoose');
const Lecture = require('c:/Users/PC/Desktop/backend/src/models/Lecture');
const Video = require('c:/Users/PC/Desktop/backend/src/models/Video');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/lms2');
  const lectureId = '69bdd3673f0df1b67ffa74e1'; // From the URL
  const lecture = await Lecture.findById(lectureId).populate('videoId');
  console.log('Lecture:', lecture ? 'Found' : 'Not Found');
  if (lecture) {
    console.log('Video ID:', lecture.videoId ? 'Exists' : 'Missing');
    if (lecture.videoId) {
       console.log('Video Status:', lecture.videoId.status);
       console.log('Video Guid:', lecture.videoId.videoGuid);
    }
  }
  process.exit();
}

run().catch(console.error);
