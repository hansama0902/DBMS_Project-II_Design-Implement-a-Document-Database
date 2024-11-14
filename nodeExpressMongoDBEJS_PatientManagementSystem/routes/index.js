
// module.exports = router;
const express = require("express");
const router = express.Router();
const { MongoClient} = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "patient_management";


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

    // history_id
    const historyId = req.query.history_id;

    // disease_history _id 
    const patient = await collection.findOne({
      "disease_history._id": historyId,
    });

    if (patient) {
      // disease_history record
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
