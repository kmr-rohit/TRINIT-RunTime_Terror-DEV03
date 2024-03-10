// const { ocrSpace } = require('ocr-space-api-wrapper');

// async function extract () {
//   try {
//     // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
//     // const res1 = await ocrSpace('http://dl.a9t9.com/ocrbenchmark/eng.png');
//     // const filepath = "G:/testimage.png"
//         // Using your personal API key + local file
//     const res2 = await ocrSpace("G:/testimage.png", { apiKey: 'K81162509088957' });
//     console.log(res2);
    
//     // Using your personal API key + base64 image + custom language
//     // const res3 = await ocrSpace('data:image/png;base64...', { apiKey: '<API_KEY_HERE>', language: 'ita' });
//   } catch (error) {
//     console.error(error);
//   }
  
// }

// extract();

const ocrSpaceApi = require('ocr-space-api');
 
var options =  { 
    apikey: 'K81162509088957',
    language: 'eng', 
    imageFormat: 'image/png',
    isOverlayRequired: true
  };
 
// Image file to upload
const imageFilePath = "G:/testimage.png";
 
// Run and wait the result
ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
  .then(function (parsedResult) {
    console.log('parsedText: \n', parsedResult.parsedText);
    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
  }).catch(function (err) {
    console.log('ERROR:', err);
  });