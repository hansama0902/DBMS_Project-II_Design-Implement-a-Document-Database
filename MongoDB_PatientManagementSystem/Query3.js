const { MongoClient } = require("mongodb");

async function countUserAppointments(patientId) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const appointmentsCollection = database.collection("appointments");

    // Count the number of appointments for a specified patient.
    const appointmentCount = await appointmentsCollection.countDocuments({
      "patient_reference.patient_id": patientId
    });

    console.log(`Patient ${patientId} has ${appointmentCount} appointment(s).`);
  } finally {
    await client.close();
  }
}

countUserAppointments("000001").catch(console.dir);

