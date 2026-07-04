import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
async function run() {
  const tts = new MsEdgeTTS();
  const voice = 'en-GB-RyanNeural';
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  
  // Use their exact template, but replace the inner text
  const baseTpl = tts._SSMLTemplate('__PLACEHOLDER__', { rate: '0.92', pitch: '-1%' });
  const ssml = baseTpl.replace('__PLACEHOLDER__', 'Hello <break time=\"600ms\"/> world directly');
  
  console.log('Testing tweaked _SSMLTemplate...');
  const res = tts.rawToStream(ssml);
  let b = Buffer.from([]);
  for await(const chunk of res.audioStream) b = Buffer.concat([b, chunk]);
  console.log('Tweaked SSML stream size:', b.length);
}
run();
