import express from "express"
import {PrismaClient}  from "@prisma/client"

const app=express();

const client=new PrismaClient();

app.use(express.json());

//https://hooks.zapier.com/hooks/catch/223345/848489/

//@ts-ignore
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { userId, zapId } = req.params;
  const body = req.body;

  //@ts-ignore
  await client.$transaction(async tx => {
    const run = await tx.zapRun.create({
      data: {
        zapId,
        metadata: body
      }
    });

    await tx.zapRunOutbox.create({
      data: {
        zapRunId: run.id
      }
    });
  }, { timeout: 10000,
       maxWait: 5000
   });

  res.json({ success: true, zapId, userId, received: body });
});



app.listen(3002,()=>{console.log("server is running at port 3002...")})



