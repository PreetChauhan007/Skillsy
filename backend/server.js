import dotenv from 'dotenv';
dotenv.config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

connectDB()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
});
// http://localhost:5000/api/health
