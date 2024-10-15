import express, { Request, Response }  from "express";


const router = express.Router();
router.get("/api/user",(req:Request, res: Response)=>{

    console.log(req.headers)
    console.log(req.body)
    res.send({})
})


export {router as UserRouter}