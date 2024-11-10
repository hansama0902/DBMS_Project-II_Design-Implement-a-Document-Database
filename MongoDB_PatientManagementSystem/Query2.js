const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const appointmentsCollection = database.collection("appointments");

    // Aggregation query: Complex query conditions (multiple expressions and logical operators)
    const complexCriteriaAppointments = await appointmentsCollection
      .aggregate([
        {
          $match: {
            $or: [
              // Condition 1: Appointment date is between '2024-11-01' and '2024-11-30
              {
                appointment_date: {
                  $gte: "2024-11-01",
                  $lte: "2024-11-30"
                }
              },
              // Condition 2: Appointment conducted by a specific doctor (Dr. Jane Smith) and test type is 'Blood Test'
              {
                $and: [
                  { "doctor_reference.doctor_name": "Dr. Jane Smith" },
                  { "test_reference.test_type": "Blood Test" }
                ]
              }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            appointment_date: 1,
            patient_first_name: { $arrayElemAt: ["$patient_reference.first_name", 0] },
            patient_last_name: { $arrayElemAt: ["$patient_reference.last_name", 0] },
            doctor_name: { $arrayElemAt: ["$doctor_reference.doctor_name", 0] },
            test_type: { $arrayElemAt: ["$test_reference.test_type", 0] }
          }
        }
      ])
      .toArray();

    console.log("\nAppointments matching complex criteria:\n");
    complexCriteriaAppointments.forEach((appointment, index) => {
      console.log(`Appointment ${index + 1}:`);
      console.log(`  ID: ${appointment._id}`);
      console.log(`  Date: ${appointment.appointment_date}`);
      console.log(`  Patient: ${appointment.patient_first_name} ${appointment.patient_last_name}`);
      console.log(`  Doctor: ${appointment.doctor_name}`);
      console.log(`  Test: ${appointment.test_type}\n`);
    });
  } finally {
    await client.close();
  }
}

run().catch(console.dir);




