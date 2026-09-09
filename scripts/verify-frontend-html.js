async function testFrontendHTML() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();

  console.log('HTTP Status:', res.status);
  console.log('Contains "SaySure":', html.includes('SaySure'));
  console.log('Contains "Voice Delivery & Pronunciation QA":', html.includes('Voice Delivery &amp; Pronunciation QA') || html.includes('Voice Delivery & Pronunciation QA'));
  console.log('Contains "Analyze your text":', html.includes('Analyze your text'));
  console.log('Contains "Check what your users will actually hear":', html.includes('Check what your users will actually hear'));
  console.log('Contains "Analyze Speech":', html.includes('Analyze Speech'));
  console.log('Contains light bg-white class:', html.includes('bg-white'));
  console.log('Does NOT contain old dark theme background "#0B0F19":', !html.includes('#0B0F19'));
  console.log('Preset pills exist:', html.includes('Identifier + Currency') && html.includes('HTTP 429 + Kubernetes'));
}

testFrontendHTML().catch(console.error);
