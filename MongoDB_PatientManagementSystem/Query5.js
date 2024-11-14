const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const patientsCollection = database.collection("patients");

    // Aggregation query: Count the number of diseases in each patient's medical history and list the disease names.
    const patientDiseaseCounts = await patientsCollection
      .aggregate([
        {
          $unwind: "$disease_history"
        },
        {
          $group: {
            _id: "$_id",
            patient_name: { $first: { $concat: ["$first_name", " ", "$last_name"] } },
            diseases: { $addToSet: "$disease_history.diseases_name" }
          }
        },
        {
          $project: {
            _id: 1,
            patient_name: 1,
            total_diseases: { $size: "$diseases" },
            diseases: 1 
          }
        }
      ])
      .toArray();

    patientDiseaseCounts.forEach((patient) => {
      console.log(`Patient ID: ${patient._id}`);
      console.log(`Name: ${patient.patient_name}`);
      console.log(`Total Diseases: ${patient.total_diseases}`);
      console.log(`Diseases: ${patient.diseases.join(", ")}`);
      console.log("--------------------------------------------------");
    });
  } finally {
    await client.close();
  }
}

run().catch(console.dir);


