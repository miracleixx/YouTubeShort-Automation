import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
async function run() {
  const tts = new MsEdgeTTS();
  const voice = 'en-GB-RyanNeural';
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  console.log('Testing rawToStream...');
  const text = '<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xmlns:mstts=\"https://www.w3.org/2001/mstts\" xml:lang=\"en-GB\"><voice name=\"' + voice + '\"><prosody rate=\"-8%\" pitch=\"-1%\" volume=\"+0%\"><break time=\"600ms\"/>Hello world, testing raw SSML stream.</prosody></voice></speak>';
  const res = tts.rawToStream(text);
  let b = Buffer.from([]);
  for await(const chunk of res.audioStream) b = Buffer.concat([b, chunk]);
  console.log('Raw SSML stream size:', b.length);
}
run();
