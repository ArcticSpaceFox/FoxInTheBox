import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";

import { PrismaClient } from "@prisma/client";

const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
    Providers.Auth0({
	    clientId: process.env.AUTH0_CLIENT_ID,
	    clientSecret: process.env.AUTH0_CLIENT_SECRET,
	    domain: process.env.AUTH0_DOMAIN,
    })
  ],
  adapter: Adapters.Prisma.Adapter({
    prisma,
  }),
  secret: process.env.SECRET || "mysupersecretsecret"
}

export default (req, res) => NextAuth(req, res, options)
