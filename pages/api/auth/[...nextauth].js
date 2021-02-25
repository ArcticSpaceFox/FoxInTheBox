import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from "next-auth/adapters";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  ],
  adapter: Adapters.Prisma.Adapter({
    prisma,
  }),
  secret: process.env.SECRET || "mysupersecretsecret"
}

export default (req, res) => NextAuth(req, res, options)