const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const appointmentsCollection = database.collection("appointments");

    // 聚合查询：复杂查询条件（多个表达式和逻辑连接符）
    const complexCriteriaAppointments = await appointmentsCollection
      .aggregate([
        {
          $match: {
            $or: [
              // 条件1：预约日期在 "2024-11-01" 到 "2024-11-30" 之间
              {
                appointment_date: {
                  $gte: "2024-11-01",
                  $lte: "2024-11-30"
                }
              },
              // 条件2：由特定医生（Dr. Jane Smith）进行的预约并且测试类型为 "Blood Test"
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




