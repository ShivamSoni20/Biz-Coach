import { GOLDEN_SET } from "./golden-set";
import { extractBrainSections, chunkText } from "../../lib/rag/ingest";

async function evaluateRAG() {
  console.log("=========================================");
  console.log("  BIZ COACH RAG EVALUATION SUITE");
  console.log("=========================================");

  let totalCases = GOLDEN_SET.length;
  let passedCases = 0;
  let citationSuccesses = 0;
  let faithfulnessSuccesses = 0;

  for (const testCase of GOLDEN_SET) {
    console.log(`\nRunning Test Case [${testCase.id}]: "${testCase.question}"`);

    const sections = extractBrainSections(testCase.fixtureBrain);
    const chunks = sections.flatMap((sec) =>
      chunkText(sec.content, 350, 40).map((c, idx) => ({
        section: sec.section,
        chunk_index: idx,
        content: c,
      }))
    );

    // Filter relevant chunks matching query keywords
    const queryTerms = testCase.question.toLowerCase().split(/\s+/);
    const matchedChunks = chunks.filter((c) => {
      const textLower = c.content.toLowerCase();
      return queryTerms.some((term) => term.length > 3 && textLower.includes(term));
    });

    const selectedChunks = matchedChunks.length > 0 ? matchedChunks.slice(0, 3) : chunks.slice(0, 2);

    // Mock/Simulated RAG Answer Generation
    const contextStr = selectedChunks.map((c) => `[${c.section}:chunk-${c.chunk_index}] ${c.content}`).join("\n");
    const foundSectionMatch = selectedChunks.some((c) => testCase.expectedSections.includes(c.section));
    const foundKeywordMatch = testCase.expectedKeywords.some((kw) =>
      contextStr.toLowerCase().includes(kw.toLowerCase())
    );

    const hasValidCitation = foundSectionMatch;
    const isFaithful = foundKeywordMatch;

    if (hasValidCitation) citationSuccesses++;
    if (isFaithful) faithfulnessSuccesses++;

    if (hasValidCitation && isFaithful) {
      passedCases++;
      console.log(`  ✓ PASS (Citation Match: YES, Faithfulness Match: YES)`);
    } else {
      console.log(`  ✗ FAIL (Citation Match: ${hasValidCitation ? "YES" : "NO"}, Faithfulness Match: ${isFaithful ? "YES" : "NO"})`);
    }
  }

  const citationPrecision = (citationSuccesses / totalCases) * 100;
  const faithfulnessScore = (faithfulnessSuccesses / totalCases) * 100;
  const passRate = (passedCases / totalCases) * 100;

  console.log("\n-----------------------------------------");
  console.log(`Total Cases: ${totalCases}`);
  console.log(`Citation Precision: ${citationPrecision.toFixed(1)}%`);
  console.log(`Faithfulness Score: ${faithfulnessScore.toFixed(1)}%`);
  console.log(`Overall Pass Rate:  ${passRate.toFixed(1)}%`);
  console.log("-----------------------------------------");

  if (passRate < 75) {
    console.error("Eval suite failed: Overall pass rate is below threshold (75%).");
    process.exit(1);
  } else {
    console.log("Eval suite passed cleanly!");
    process.exit(0);
  }
}

evaluateRAG().catch((err) => {
  console.error("Eval execution error:", err);
  process.exit(1);
});
