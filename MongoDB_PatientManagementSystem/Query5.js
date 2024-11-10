const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("patient_management");
    const patientsCollection = database.collection("patients");

    // 聚合查询: 统计每个病人病史中的独特疾病数量，并列出疾病名称
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
            diseases: 1 // 保留独特的疾病名称
          }
        }
      ])
      .toArray();

    // 整洁输出每个病人的信息
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

