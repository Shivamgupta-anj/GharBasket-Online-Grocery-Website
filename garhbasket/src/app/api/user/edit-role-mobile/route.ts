import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/db";
import  { auth } from "@/auth"
import User from "@/models/user.model";


export async function POST(req: NextRequest) {
    try{
        await connectDb()
        const {role,mobile}=await req.json()
        const session = await auth()

        console.log("SESSION:", session)        // ← add this
        console.log("ROLE:", role)              // ← add this  
        console.log("MOBILE:", mobile) 


        const user = await User.findOneAndUpdate({email:session?.user?.email},{role,mobile},{new:true})
    //     const user = await User.findOneAndUpdate(
    // {email:session?.user?.email},
    // {role, mobile, roleSelected: true},
    // {new:true}

          console.log("USER FOUND:", user)  

        if(!user){
            return NextResponse.json({message:"User not found"},{status:404})
        }

        return NextResponse.json({message:"User updated successfully"},{status:200})

    }catch(err){

        console.log("ERROR:", err)   
        return NextResponse.json({message:`edit role and mobile error ${err}`},{status:500})
    }
     
}

