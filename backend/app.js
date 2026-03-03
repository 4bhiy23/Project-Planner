import express from "express";
const app = express()
import cors from "cors"
import cookieParser from "cookie-parser";

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

// Routes import
import projectRouter from './src/routes/projectsRouter.js'
import authRouter from './src/routes/auth.router.js'
import adminRouter from './src/routes/admin.router.js'

// Routes Decleration
app.use('/api/v1/projects', projectRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/admin', adminRouter)

export default app