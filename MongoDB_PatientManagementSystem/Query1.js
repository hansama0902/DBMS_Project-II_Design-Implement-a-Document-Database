const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const appointmentsCollection = database.collection("appointments");

    // Aggregation query: Count appointments per doctor, sorted in descending order
    const doctorAppointmentCounts = await appointmentsCollection
      .aggregate([
        {
          $group: {
            _id: "$doctor_reference.doctor_name",
            total_appointments: { $sum: 1 },
          },
        },
        { $sort: { total_appointments: -1 } },
      ])
      .toArray();

    console.log("Top doctors by appointment count:");
    doctorAppointmentCounts.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor._id}: ${doctor.total_appointments} appointments`);
    });
  } finally {
    await client.close();
  }
}

run().catch(console.dir);


