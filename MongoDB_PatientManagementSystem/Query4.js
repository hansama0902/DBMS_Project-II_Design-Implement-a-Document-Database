const { MongoClient } = require("mongodb");

async function updateDiseasesName(patientId, oldDiseaseName, newDiseaseName) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const patientsCollection = database.collection("patients");

    // Update disease name directly in disease_history field (since it's an object, not an array)
    const updateResult = await patientsCollection.updateOne(
      { _id: patientId, "disease_history.diseases_name": oldDiseaseName },
      { $set: { "disease_history.diseases_name": newDiseaseName } }
    );

    if (updateResult.modifiedCount > 0) {
      console.log(`Updated disease name for patient ${patientId} successfully.`);
    } else {
      console.log(`No changes made for patient ${patientId}. Check if the disease name is correct.`);
    }
  } finally {
    await client.close();
  }
}

updateDiseasesName("patient_id_001", "Diabetes", "Type 2 Diabetes").catch(console.dir);




