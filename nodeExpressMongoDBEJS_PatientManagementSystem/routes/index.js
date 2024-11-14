

// module.exports = router;
// const express = require("express")
// const path = require("path")
// var router = express.Router();


// var sqlite3 = require("sqlite3").verbose();

// var db = new sqlite3.Database( path.join(__dirname,"../db/PatientManagement.db") );


// router.post("/addSurvey", (req, res) => {
//     let json_body = req.body;

  
//     let check_sql = "SELECT COUNT(*) AS count FROM Survey WHERE survey_id = ?";
//     db.get(check_sql, [json_body.survey_id], (err, row) => {
//         if (err) {
//             console.error("Error executing SQL:", err);
//             return res.status(500).send("Database error occurred");
//         }

   
//         if (row.count > 0) {
//             return res.status(400).send("Error: Survey ID already exists");
//         }

     
//         let insert_sql = `
//             INSERT INTO Survey
//             (survey_id, last_sync, symptom, immuno_compromised, patient_id) 
//             VALUES (?, ?, ?, ?, ?);
//         `;
        
//         db.run(insert_sql, [
//             json_body.survey_id,
//             json_body.last_sync,
//             json_body.symptom,
//             json_body.immuno_compromised,
//             json_body.patient_id
//         ], (err) => {
//             if (err) {
//                 console.error("Error executing SQL:", err);
//                 return res.status(500).send("Error occurred while inserting record");
//             }

//             res.redirect('/Survey');
//         });
//     });
// });
// router.post("/add", (req, res) => {
//     let json_body = req.body;

//     let check_sql = "SELECT COUNT(*) AS count FROM Patient WHERE patient_id = ?";
//     db.get(check_sql, [json_body.patient_id], (err, row) => {
//         if (err) {
//             console.error("Error executing SQL:", err);
//             return res.status(500).send("Database error occurred");
//         }

//         if (row.count > 0) {
//             return res.status(400).send("Error: Patient ID already exists");
//         }

//         let insert_sql = `
//             INSERT INTO Patient 
//             (patient_id, first_name, last_name, phone, DOB, address, gender) 
//             VALUES (?, ?, ?, ?, ?, ?, ?);
//         `;
        
//         db.run(insert_sql, [
//             json_body.patient_id,
//             json_body.first_name,
//             json_body.last_name,
//             json_body.phone,
//             json_body.DOB,  
//             json_body.address,
//             json_body.gender
//         ], (err) => {
//             if (err) {
//                 console.error("Error executing SQL:", err);
//                 return res.status(500).send("Error occurred while inserting record");
//             }

            
//             res.redirect('/');
//         });
//     });
// });


// router.get("/",(req,res) =>{
//     let sql = "select * from `Patient`where 1=1";
//     let params = []
//     if(req.query.id){
//         sql += " and patient_id like ?";
//         params.push(`%${req.query.id}%`);
//         }
//     if (req.query.number) {

//             sql += " and phone like ?"
//             params.push(`%${req.query.number}%`)
//           }

//     db.all(sql,params,(err,rows)=>{
//         if(err == null){
//             // res.send(rows)
//             res.render('patients', { 
//               res:rows
//             });
            
//         }else{
//             res.send(err)
//         }
//     })

// })
// // 
// router.get("/Survey", (req, res) => {
//     let sql = "SELECT * FROM `Survey` WHERE 1=1";
//     let sql_patient = "SELECT * FROM `Patient` WHERE 1=1";
//     let params = [];
    
//     if (req.query.Id) {
//         sql += " AND survey_id LIKE ?";
//         params.push(`%${req.query.Id}%`);
//     }
//     if (req.query.foreignId) {
//         sql += " AND patient_id LIKE ?";
//         params.push(`%${req.query.foreignId}%`);
//     }


//     let getSurveyData = new Promise((resolve, reject) => {
//         db.all(sql, params, (err, rows) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(rows);
//             }
//         });
//     });

//     let getPatientData = new Promise((resolve, reject) => {
//         db.all(sql_patient, (err, rows) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(rows);
//             }
//         });
//     });


//     Promise.all([getSurveyData, getPatientData])
//         .then(([surveyRows, patientRows]) => {
//             res.render('survey', {
//                 res: surveyRows,
//                 res_patient: patientRows
//             });
//         })
//         .catch((err) => {
//             res.send(err);
//         });
// });

// router.get("/delete",(req,res) =>{
//     // receive 
//     let sql = "delete from `Patient` where patient_id = ?";
//     let sql_survey = "DELETE FROM `Survey` WHERE patient_id = ?";
//     let params = [req.query.id]
//     db.run(sql, params, (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Failed to delete from Patient table" });
//         }
    
//         // Delete from Survey table
//         db.run(sql_survey, params, (err) => {
//           if (err) {
//             return res.status(500).json({ error: "Failed to delete from Survey table" });
//           }
    
//           // Both tables deleted successfully
//           res.json({ delstatus: 1 });
//         });
//       });
//     });

// router.get("/delSurvey",(req,res) =>{
//     // receive 
//     let sql = "delete from `Survey` where survey_id = ?";
//     let params = [req.query.id]
//     db.run(sql,params,(err)=>{
//         if(err == null){
//             res.json({
//                 delstatus :1
//             })
//         }
//     })
// })

// router.get("/editPage", (req, res) => {
//   let sql = "select * from `Patient` where patient_id = ?"
//   let params = [req.query.patient_id]
//   db.all(sql,params,(err,rows)=>{
//       if(err == null){
//           res.render("editPage", { 
//             patientObj:{
//                 patient_id:rows[0].patient_id,
//                 first_name:rows[0].first_name,
//                 last_name:rows[0].last_name,
//                 phone:rows[0].phone,
//                 DOB :rows[0].DOB,
//                 address :rows[0].address,
//                 gender:rows[0].gender,                 
//             }
//           });
//       }else{
//           res.send(err)
//       }
//   })

// })
// router.get("/editSurvey", (req, res) => {
//     let sql = "select * from `Survey` where survey_id = ?"
//     let params = [req.query.survey_id]
//     db.all(sql,params,(err,rows)=>{
//         if(err == null){
//             res.render("editSurvey", { 
//                 surveyObj:{
//                     survey_id:rows[0].survey_id,
//                     last_sync: rows[0].last_sync,
//                     symptom: rows[0].symptom,
//                     immuno_compromised: rows[0].immuno_compromised,
//                     patient_id:rows[0].patient_id,
                   
//               }
//             });
//         }else{
//             res.send(err)
//         }
//     })
  
//   })
// router.post("/updatePatient", (req, res) => {
//     console.log(req.body.patient_id)
//     let sql =`update Patient set
//   first_name ='${req.body.first_name}',
//   last_name='${req.body.last_name}',
//   phone='${req.body.phone}',
//   DOB='${req.body.DOB}',
//   address='${req.body.address}',
//   gender='${req.body.gender}'
//   where patient_id = ${req.body.patient_id}
//   `;
//     db.run(sql,[],(err)=>{
//         console.log("update success")
//         if(err == null){
//             console.log("update success")
//             res.redirect('/')
//         }else{
//             res.send(err)
//         }
//     })
// })
// router.post("/updateSurvey", (req, res) => {
//     console.log(req.body.immuno_compromised)
//     let sql =`update Survey set
//   survey_id='${req.body.survey_id}',
//   last_sync='${req.body.last_sync}',
//   symptom='${req.body.symptom}',
//   immuno_compromised='${req.body.immuno_compromised}',
//   patient_id='${req.body.patient_id}'
//   where survey_id = ${req.body.survey_id}
//   `;
//     db.run(sql,[],(err)=>{
//         console.log("update success")
//         if(err == null){
//             console.log("update success")
//             res.redirect('/Survey')
//         }else{
//             res.send(err)
//         }
//     })
// })


// module.exports = router;
const express = require("express");
const router = express.Router();
const { MongoClient} = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "patient_management";

// Add Survey
router.post("/addSurvey", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("surveys");
    const survey = req.body;

    // Check if survey ID already exists
    const existingSurvey = await collection.findOne({ _id: survey.survey_id });
    if (existingSurvey) {
      return res.status(400).send("Error: Survey ID already exists");
    }

    // Insert the survey
    await collection.insertOne({
      _id: survey.survey_id,
      last_sync: survey.last_sync,
      symptom: survey.symptom,
      immuno_compromised: survey.immuno_compromised,
      patient_id: survey.patient_id,
    });
    res.redirect('/Survey');
  } catch (err) {
    console.error("Error adding survey:", err);
    res.status(500).send("Database error occurred");
  }
});

// Add Patient
router.post("/add", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("patients");
    const patient = req.body;

    // Check if patient ID already exists
    const existingPatient = await collection.findOne({ _id: patient.patient_id });
    if (existingPatient) {
      return res.status(400).send("Error: Patient ID already exists");
    }

    // Insert the patient
    await collection.insertOne({
      _id: patient.patient_id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      phone: patient.phone,
      DOB: patient.DOB,
      address: patient.address,
      gender: patient.gender,
      disease_history: patient.disease_history,
    });
    res.redirect('/');
  } catch (err) {
    console.error("Error adding patient:", err);
    res.status(500).send("Database error occurred");
  }
});

// Get Patients

router.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("patients");
    const query = {};

    if (req.query.id) {
      query._id = { $regex: req.query.id, $options: 'i' };
    }
    if (req.query.number) {
      query.phone = { $regex: req.query.number, $options: 'i' };
    }

    const patients = await collection.find(query).toArray();
    res.render('patients', { res: patients });
  } catch (err) {
    console.error("Error retrieving patients:", err);
    res.status(500).send("Database error occurred");
  }
});

  

// Get Surveys
router.get("/Survey", async (req, res) => {
  try {
    const db = client.db(dbName);
    const surveyCollection = db.collection("surveys");
    const patientCollection = db.collection("patients");
    const surveyQuery = {};

    if (req.query.Id) {
      surveyQuery._id = { $regex: req.query.Id, $options: 'i' };
    }
    if (req.query.foreignId) {
      surveyQuery.patient_id = { $regex: req.query.foreignId, $options: 'i' };
    }

    const surveys = await surveyCollection.find(surveyQuery).toArray();
    const patients = await patientCollection.find().toArray();

    res.render('survey', { res: surveys, res_patient: patients });
  } catch (err) {
    console.error("Error retrieving surveys:", err);
    res.status(500).send("Database error occurred");
  }
});

// Delete Patient
router.get("/delete", async (req, res) => {
  try {
    const db = client.db(dbName);
    const patientCollection = db.collection("patients");
    console.log(req.query);
    const patientId = req.query.id;
    console.log(patientId);
    await patientCollection.deleteOne({_id: patientId });

    res.json({ delstatus: 1 });
  } catch (err) {
    console.error("Error deleting patient or surveys:", err);
    res.status(500).send("Database error occurred");
  }
});

// Delete Survey
router.get("/delSurvey", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("surveys");

    await collection.deleteOne({ _id: req.query.id });
    res.json({ delstatus: 1 });
  } catch (err) {
    console.error("Error deleting survey:", err);
    res.status(500).send("Database error occurred");
  }
});

// Edit Patient Page
router.get("/editPage", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("patients");

    const patient = await collection.findOne({ _id: req.query.patient_id });
    if (patient) {
      res.render("editPage", { patientObj: patient });
    } else {
      res.status(404).send("Patient not found");
    }
  } catch (err) {
    console.error("Error retrieving patient for edit:", err);
    res.status(500).send("Database error occurred");
  }
});

// Edit Survey Page
router.get("/editSurvey", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("surveys");

    const survey = await collection.findOne({ _id: req.query.survey_id });
    if (survey) {
      res.render("editSurvey", { surveyObj: survey });
    } else {
      res.status(404).send("Survey not found");
    }
  } catch (err) {
    console.error("Error retrieving survey for edit:", err);
    res.status(500).send("Database error occurred");
  }
});

// Update Patient
router.post("/updatePatient", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("patients");
    const updatedPatient = req.body;

    await collection.updateOne(
      { _id: updatedPatient.patient_id },
      { $set: updatedPatient }
    );

    res.redirect('/');
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).send("Database error occurred");
  }
});

// Update Survey
router.post("/updateSurvey", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("surveys");
    const updatedSurvey = req.body;

    await collection.updateOne(
      { _id: updatedSurvey.survey_id },
      { $set: updatedSurvey }
    );

    res.redirect('/Survey');
  } catch (err) {
    console.error("Error updating survey:", err);
    res.status(500).send("Database error occurred");
  }
});
// Get Disease History
router.get("/DiseaseHistory", async (req, res) => {
    try {
      const db = client.db(dbName);
      const patientCollection = db.collection("patients");
      const historyQuery = {};
  
      if (req.query.Id) {
        historyQuery._id = { $regex: req.query.Id, $options: 'i' };
      }
      if (req.query.patientId) {
        historyQuery["disease_history.patient_id"] = { $regex: req.query.patientId, $options: 'i' };
      }
  
      const patients = await patientCollection.find(historyQuery).toArray();
  
      res.render('diseasesHistory', { res: patients });
    } catch (err) {
      console.error("Error retrieving disease history:", err);
      res.status(500).send("Database error occurred");
    }
  });
  
// Delete Disease History
router.get("/delDiseaseHistory", async (req, res) => {
  try {
    const db = client.db(dbName);
    const patientCollection = db.collection("patients");
    const historyId = req.query.id;

    await patientCollection.updateOne(
      { "disease_history._id": historyId },
      { $pull: { disease_history: { _id: historyId } } }
    );
    res.json({ delstatus: 1 });
  } catch (err) {
    console.error("Error deleting disease history:", err);
    res.status(500).send("Database error occurred");
  }
});


router.get("/editDiseaseHistory", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("patients");

    // 获取 history_id 参数
    const historyId = req.query.history_id;

    // 查找包含特定 disease_history _id 的患者
    const patient = await collection.findOne({
      "disease_history._id": historyId,
    });

    if (patient) {
      // 查找匹配的 disease_history 记录
      const history = patient.disease_history.find(
        (h) => h._id === historyId
      );

      if (history) {
        res.render("editHistory", { historyObj: history });
      } else {
        res.status(404).send("Disease History not found");
      }
    } else {
      res.status(404).send("Patient not found");
    }
  } catch (err) {
    console.error("Error retrieving Disease History for edit:", err);
    res.status(500).send("Database error occurred");
  }
});



  // Update Disease History
  router.post("/updateDiseaseHistory", async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection("patients");
        const { history_id, patient_id, diseases_name } = req.body;

        // Update the specific disease history entry for the patient
        await collection.updateOne(
            { _id: patient_id, "disease_history._id": history_id },
            { $set: { "disease_history.$.diseases_name": diseases_name } }
        );

        res.redirect('/DiseaseHistory');
    } catch (err) {
        console.error("Error updating disease history:", err);
        res.status(500).send("Database error occurred");
    }
});
  
  router.post("/addDiseaseHistory", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("patients");
    const history = req.body;
    console.log(history);

    // Ensure disease_history is an array
    const existingPatient = await collection.findOne({ _id: history.patient_id });
    if (existingPatient && !Array.isArray(existingPatient.disease_history)) {
      await collection.updateOne(
        { _id: history.patient_id },
        { $set: { disease_history: [] } }
      );
    }

    // Check if history ID already exists
    const historyExists = await collection.findOne({ "disease_history._id": history._id });
    if (historyExists) {
      return res.status(400).send("Error: History ID already exists");
    }

    // Insert the history into the patient's disease_history array
    const updateResult = await collection.updateOne(
      { _id: history.patient_id },
      { $push: { disease_history: {
        _id: history._id,
        patient_id: history.patient_id,
        diseases_name: history.diseases_name
      } } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).send("Error: Patient ID not found");
    }

    res.redirect('/DiseaseHistory');
  } catch (err) {
    console.error("Error adding disease history:", err);
    res.status(500).send("Database error occurred");
  }
});
  
module.exports = router;
