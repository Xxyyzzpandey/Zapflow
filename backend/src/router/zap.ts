import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types/type";
import { prismaClient } from "../db/db";
import { Prisma } from "@prisma/client";


const router=Router();

//@ts-ignore
router.post("/", authMiddleware, async (req, res) => {
  const body = req.body;
  console.log("comming body is ",body);
  //@ts-ignore
  const userId = req.id;

  // Validate request body
  const parsedData = ZapCreateSchema.safeParse(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: "incorrect inputs",
    });
  }
  console.log("comming body is", JSON.stringify(body, null, 2));
console.log("parsed data is", JSON.stringify(parsedData, null, 2));


parsedData.data.actions.forEach((a, i) => {
  console.log(`Action ${i}:`, JSON.stringify(a, null, 2));
});


  try {
    // Start transaction with sensible timeout configs
    const zapId = await prismaClient.$transaction(
      async (tx) => {
        // Create Zap
        const zap = await tx.zap.create({
          data: {
            userId: userId,
            triggerId: "", // Temporary, will update after trigger creation
            actions: {
  create: parsedData.data.actions.map((x, index) => ({
    actionId: x.availableActionId,
    sortingOrder: index,
    metadata: x.actionMetadata as Prisma.JsonObject,
  })),
},

          },
        });

        // Create Trigger and connect to AvailableTrigger
  const trigger = await tx.trigger.create({
  data: {
    zapId: zap.id,
    triggerId: parsedData.data.availableTriggerId, // must exist in AvailableTrigger
  },
});


        // Update Zap with triggerId
        await tx.zap.update({
          where: { id: zap.id },
          data: { triggerId: trigger.id },
        });

        return zap.id;
      },
      {
        maxWait: 5000, // 5 seconds max wait for transaction lock
        timeout: 10000, // 10 seconds total timeout for transaction
      }
    );

    // Respond with the new zapId
    return res.json({ zapId });
  } catch (err) {
    console.error("Transaction failed: ", err);
    return res.status(500).json({
      message: "Something went wrong while creating zap",
    });
  }
});
//@ts-ignore
router.get("/",authMiddleware,async(req,res)=>{
    //@ts-ignore
    const id=req.id;
    const zaps=await prismaClient.zap.findMany({
        where:{
            userId:id
        },
        include:{
            actions:{
                include:{
                    type:true
                }
            },
            trigger:{
                include:{
                    type:true
                }
            }
        }
    })
    return res.json({
        zaps
    })
})

//@ts-ignore
router.get("/:zapId", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;
  const zapId = req.params.zapId;

  const zap = await prismaClient.zap.findUnique({
    where: {
      id: zapId,
      userId: userId,   // ✅ ensures user owns this zap
    },
    include: {
      actions: {
        orderBy: { sortingOrder: "asc" }, // nice to keep order
        include: { type: true },
      },
      trigger: {
        include: { type: true },
      },
    },
  });

  if (!zap) {
    return res.status(404).json({ error: "Zap not found" });
  }

  return res.json({ zap });
});


export const zapRouter=router;