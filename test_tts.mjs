import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
async function run() {
  const tts = new MsEdgeTTS();
  const originalSend = tts._push;
  // We'll monkey patch it to see
  console.log(tts.toStream.toString());
}
run();
