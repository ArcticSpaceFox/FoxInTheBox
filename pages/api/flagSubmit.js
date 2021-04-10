import { getSession } from 'next-auth/client'
import prisma from "../../lib/prisma";
/* import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); */

export default async function handler(req, res) {
  // auth check
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).json({
      status: "FAIL",
      description: "Not authenticated"
    })
  }

  if (!req.body.boxId) return res.status(400).json({
    status: "FAIL",
    description: "Please provide a valid boxId"
  });

  const box = await prisma.box.findFirst({
    where: { id: req.body.boxId },
    select: {
      flag: true,
      solves: {
        select: {
          userId: true,
        }
      }
    },
  });

  if (!box) return res.status(401).json({
    status: "FAIL",
    description: "Box Id not valid"
  })

  if (req.body.flag !== box.flag) return res.status(401).json({
    status: "FAIL",
    description: "Invalid flag"
  })

  const boxSolves = await prisma.solve.findFirst({
    where: {
      boxId: req.body.boxId
    }
  })

  const user = await prisma.user.findFirst({
    where: {
      name: session.user.name,
    },
    select: {
      id: true,
      name: true,
    }
  });

  if (!user) return res.status(401).json({
    status: "FAIL",
    description: "User is not valid"
  })

  if (box.solves.filter(s=>s.userId == user.id).length > 0) return res.status(401).json({
    status: "FAIL",
    description: "Aready solved"
  })

  const update = await prisma.solve.create({
    data: {
      Box: {
        connect: {
          id: req.body.boxId
        }
      },
      isBlood: !boxSolves,
      user: {
        connect: {
          id: user.id,
        }
      }
    }
  })

  res.json({
    status: "SUCCESS",
    user: session.user.name,
    update: update,
  })
}
