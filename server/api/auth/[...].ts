import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'
import { PrismaClient, users } from "~/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { validateInput } from "~/server/utils/validate";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient().$extends(withAccelerate());

export default NuxtAuthHandler({
  // TODO: SET A STRONG SECRET, SEE https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler#secret
  secret: process.env.AUTH_SECRET || 'my-auth-secret',
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here'
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '(hint: fatkulumar@gmail.com)' },
        password: { label: 'Password', type: 'password', placeholder: '(hint: fatkulumar)' }
      },
      async authorize (credentials: any) {
        const validate = await validateInput(credentials, {
          email: ['required', 'email'],
          password: ['required'],
        });

        if (validate?.code === 422) {
          console.warn('Validasi gagal:', validate.message)
          return null
        }

        const checkUser = await prisma.users.findUnique({
          where: { email: credentials.email }
        })

        if (!checkUser) {
          console.warn('Email tidak ditemukan:', credentials.email)
          throw new Error(JSON.stringify({ field: 'email', message: 'Email Tidak Ditemukan' }))
        }

        const isValid = await bcrypt.compare(credentials.password, checkUser.password!)

        if (!isValid) {
          console.warn('Password salah untuk:', credentials.email)
          throw new Error(JSON.stringify({ field: 'password', message: 'Password salah' }))
        }

        // const { password: _, ...safeUser } = checkUser

        console.warn('ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe')
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        const user = { id: checkUser.id, name: checkUser.name, email: checkUser.email, password: checkUser.password }

        if (credentials?.email === user.email && isValid == true) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          console.error('Warning: Malicious login attempt registered, bad credentials provided')

          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
})
