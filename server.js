import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/loginroutes/authRoutes.js';
import cityRoutes from './routes/MastersRoutes/cityRoutes.js';
import genderRoutes from './routes/MastersRoutes/genderRoutes.js';
import bloodGroupRoutes from './routes/MastersRoutes/bloodGroupRoutes.js';
import motherOccupationRoutes from './routes/MastersRoutes/motherOccupationRoutes.js';
import fatherOccupationRoutes from './routes/MastersRoutes/fatherOccupationRoutes.js';
import stdMasterRoutes from './routes/MastersRoutes/stdMasterRoutes.js'
import subjectSpecializationRoutes from './routes/MastersRoutes/subjectSpecializationRoutes.js';
import qualificationRoutes from './routes/MastersRoutes/qualificationRoutes.js';
import sectionRoutes from './routes/MastersRoutes/sectionRoutes.js';
import religionRoutes from './routes/MastersRoutes/religionRoutes.js';
import casteRoutes from "./routes/MastersRoutes/casteRoutes.js";
import documentTypeRoutes from "./routes/MastersRoutes/documentTypeRoutes.js";
import statusRoutes from "./routes/MastersRoutes/statusRoutes.js";

import dropdownRoutes from './routes/DropdownRoutes/dropdownRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use('/api/cities', cityRoutes);
app.use('/api/genders', genderRoutes);
app.use('/api/bloodgroups', bloodGroupRoutes);
app.use('/api/motheroccupations', motherOccupationRoutes);
app.use('/api/fatheroccupations', fatherOccupationRoutes);
app.use('/api/stdmaster', stdMasterRoutes);
app.use('/api/subjectspecialization', subjectSpecializationRoutes);
app.use('/api/qualification', qualificationRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/religions', religionRoutes);
app.use("/api/castes", casteRoutes);
app.use("/api/document-types", documentTypeRoutes);
app.use("/api/statuses", statusRoutes);



app.use('/api/dropdowns', dropdownRoutes);


app.use((err, _, res, __) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
