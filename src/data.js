// Dummy entries keyed by ISO date (YYYY-MM-DD).
// Each entry provides a unique video, image, and rich-formatted description.
export const entries = {
  "2026-04-09": {
    title: "Capsule // White Metal Edition",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    html: `
      <h2>MOON 44 // ION 3</h2>
      <p><strong>Model:</strong> MK-IV. <strong>Material:</strong> brushed aluminum,
      hand-finished in a controlled-humidity chamber. The capsule reveals a single
      pair of footwear, sealed for archival storage and authenticated on-chain.</p>
      <p>Engineered for collectors, the MK-IV pairs structural minimalism with
      industrial-grade tolerances. Each unit ships with a tamper-evident seal and a
      laser-etched serial.</p>
      <p>The white-metal edition is limited to <strong>44 units</strong> globally,
      released on April 9, 2026.</p>
      <p>Specifications: 320 x 220 x 140 mm, 2.4 kg, anodized shell, magnetic latch,
      integrated NFC certificate of authenticity.</p>
      <p>Care: wipe with a soft microfiber cloth. Avoid direct UV exposure. Do not
      submerge. Storage temperature 5-30C, relative humidity below 60%.</p>
      <p>Provenance is logged to a public ledger; ownership transfers require both
      the physical key and a signed message from the registered wallet.</p>
    `,
  },
  "2026-04-16": {
    title: "Archive Drop // Carbon Brief",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
    html: `
      <h2>Carbon Brief // Drop 02</h2>
      <p>The second archive drop introduces a carbon-fiber chassis and a darker
      visual identity. Documentation is delivered as a printed dossier and a
      machine-readable JSON manifest.</p>
      <p>Production was capped at <strong>16 units</strong>. Each piece is
      individually weighed and tuned within +/- 4 grams of the target spec.</p>
      <p>The drop coincides with the public release of the manifest schema,
      enabling third-party authentication tools to verify provenance offline.</p>
      <p>Field notes are included for collectors who plan to display the unit
      under archival lighting; a recommended fixture list is provided.</p>
    `,
  },
  "2026-04-23": {
    title: "Field Test // Sector 09",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    image:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1600&q=80",
    html: `
      <h2>Sector 09 // Field Report</h2>
      <p>Field tests in Sector 09 evaluated thermal stability across a 60-degree
      delta. The capsule maintained internal humidity within 2% of the setpoint
      throughout the 72-hour cycle.</p>
      <p>Telemetry was logged at 1Hz and is available as an open dataset under a
      permissive license. Researchers are encouraged to reproduce the test using
      the published rig.</p>
      <p>Findings will inform the next revision of the seal geometry.</p>
    `,
  },
};

export const defaultDate = "2026-04-09";
