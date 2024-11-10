const { MongoClient } = require("mongodb");

async function countUserAppointments(patientId) {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const appointmentsCollection = database.collection("appointments");

    // 统计指定患者的预约数量
    const appointmentCount = await appointmentsCollection.countDocuments({
      "patient_reference._id": patientId
    });

    console.log(`Patient ${patientId} has ${appointmentCount} appointment(s).`);
  } finally {
    await client.close();
  }
}

countUserAppointments("patient_id_123").catch(console.dir);

