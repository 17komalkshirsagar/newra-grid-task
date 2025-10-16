import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UtilityBill } from '../models/UtilityBill';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://komal:itmTklEoGE6ASZIP@cluster0.g5tlf77.mongodb.net/energy-platform';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


const cleanInvalidFileReferences = async () => {
  try {
    console.log('🧹 Cleaning invalid file references from bills...');


    const bills = await UtilityBill.find({});
    console.log(`Found ${bills.length} bills to check`);

    let cleanedCount = 0;

    for (const bill of bills) {
      let needsUpdate = false;
      const updates: any = {};


      if (bill.originalFile && !bill.originalFile.startsWith('http') && !bill.cloudinaryPublicId) {

        if (!bill.originalFile.includes('/uploads/') && !bill.originalFile.includes('cloudinary')) {
          console.log(`  Removing invalid originalFile: ${bill.originalFile} from bill ${bill.billNumber}`);
          updates.originalFile = null;
          needsUpdate = true;
        }
      }


      if (bill.processedFile && !bill.processedFile.startsWith('http') && !bill.cloudinaryPublicId) {
        if (!bill.processedFile.includes('/uploads/') && !bill.processedFile.includes('cloudinary')) {
          console.log(`  Removing invalid processedFile: ${bill.processedFile} from bill ${bill.billNumber}`);
          updates.processedFile = null;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await UtilityBill.findByIdAndUpdate(bill._id, { $unset: updates });
        cleanedCount++;
      }
    }

    console.log(`✅ Cleaned ${cleanedCount} bills with invalid file references`);
    console.log('✅ Database cleanup completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
};


const main = async () => {
  await connectDB();
  await cleanInvalidFileReferences();
};


if (require.main === module) {
  main();
}

export { cleanInvalidFileReferences };
