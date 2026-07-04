import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
async function run() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('en-GB-RyanNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  console.log('Testing toStream with ProsodyOptions...');
  const res = tts.toStream('Hello world directly', { rate: '0.92', pitch: '-1%' });
  let b = Buffer.from([]);
  for await(const chunk of res.audioStream) b = Buffer.concat([b, chunk]);
  console.log('Prosody stream size:', b.length);
}
run();
