const fs = require("fs");
const path = require("path");

const dataDir = "../bbr2ResServer/bbr2ResServer"; // Your input directory
const outputDir = "./src/data/server/bbr2server"; // Your output directory

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const dataLineRegex = /\[\s*\d+\]\s+(\d+\.\d+)-(\d+\.\d+)\s+sec\s+([\d.]+)\s+MBytes\s+([\d.]+)\s+Mbits\/sec/;

const extractData = (content) => {
  const lines = content.split("\n");
  const entries = [];

  for (const line of lines) {
    const match = dataLineRegex.exec(line);
    if (match) {
      const [ , start, end, transfer, bitrate ] = match.map(parseFloat);
      entries.push({
        interval: end - start,
        transfer_MB: transfer,
        bitrate_Mbps: bitrate,
      });
    }
  }

  for (let i = lines.length - 1; i >= 0; i--) {
    const match = dataLineRegex.exec(lines[i]);
    if (match) {
      const [ , start, end, transfer, bitrate ] = match.map(parseFloat);
      entries.push({
        interval: end - start,
        transfer_MB: transfer,
        bitrate_Mbps: bitrate,
      });
      break;
    }
  }

  return entries;
};

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith(".txt")) {
    const baseName = path.basename(file, ".txt");
    const modName = baseName.slice(0, 4) + "_SERVER" + baseName.slice(4);
    const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
    const entries = extractData(raw);
    fs.writeFileSync(
      path.join(outputDir, `${modName}.json`),
      JSON.stringify(entries, null, 2)
    );
    console.log(`Created: ${modName}.json`);
  }
});
