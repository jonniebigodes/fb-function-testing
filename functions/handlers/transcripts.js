const { db } = require("../utils/admin");
exports.getAllTranscripts = async (req, res) => {
  try {
    const allTranscripts = await db
      .collection("transcripts")
      .orderBy("createdAt", "desc")
      .get();

    const result = allTranscripts.docs.map(transcript => {
      return {
        id: transcript.data().transcriptId,
        voice: transcript.data().voice,
        text: transcript.data().text
      };
    });
    return res.status(200).json({ transcripts: result });
  } catch (error) {
    console.error(`error fetching transcripts:${err}`);
    return res.status(500).json({ message: "error fetching transcripts" });
  }
};
exports.addTranscripts = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "no transcripts were provided" });
    }
    const transcriptsCollection = db.collection("transcripts");
    const batchInsert = db.batch();
    /* const storedTranscripts = await db
      .collection("transcripts")
      .orderBy("createdAt", "desc")
      .get(); */
    const storedTranscripts= await transcriptsCollection.orderBy("createdAt", "desc").get()
    if (storedTranscripts.empty) {
      req.body.transcripts.forEach(element => {
        /* const transcriptRef= transcriptsCollection.doc().id */
        const transcriptRef = transcriptsCollection.doc();
        /* console.log('ref document',transcriptRef.id) */
        batchInsert.set(transcriptRef, {
          transcriptId: element.id,
          voice: element.voice,
          text: element.text,
          createdAt: new Date().toISOString()
        });
      });
    } else {
      // todo filter data
      const dbData = storedTranscripts.docs.map(transcript => {
        return {
          id: transcript.data().transcriptId,
          voice: transcript.data().voice,
          text: transcript.data().text
        };
      });
      /* console.log('dbdata :', dbData); */
      const filteredData = req.body.transcripts.filter(element => {
        return dbData.some(item => {
          return item.id !== element.id;
        });
      });
      /* console.log('filteredData',filteredData); */
      if (filteredData.length > 0) {
        filteredData.forEach(element => {
          /* const transcriptRef= transcriptsCollection.doc().id */
          const transcriptRef = transcriptsCollection.doc();
          /* console.log('ref document',transcriptRef.id) */
          batchInsert.set(transcriptRef, {
            transcriptId: element.id,
            voice: element.voice,
            text: element.text,
            createdAt: new Date().toISOString()
          });
        });
        
      }
      //
    }
    await batchInsert.commit();
    return res.status(201).json({ message: "Transcripts where added" });
  } catch (error) {
    console.error(`error injecting transcripts:${error}`);
    return res.status(500).json({ message: "error injecting transcripts" });
  }
};
