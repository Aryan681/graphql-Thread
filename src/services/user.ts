import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
const secret = "dopeMan";

// Defining an interface for the user creation payload to enforce type safety and structure
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

//Defining an interface for the generate token  payload to enforce type safety and structure
export interface GetUserTokenPayload {
  email: string;
  password: string;
}

// this service is going to used in the resolver
class userService {
    
  //this function  generate the hash
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex"); //storing the hashed password not the original password fot the safety purpose .
    return hashedPassword;
  }

  // function to create the user
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload; //destructure  the data .

    const salt = randomBytes(32).toString("hex"); // create the salt using the crypto and randomByte hash algo .

    const hashedPassword = userService.generateHash(salt, password);

    // Using the Prisma client to create a new user record in the database
    return prismaClient.user.create({
      // creating the new users
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      }, // Storing the hashed password
    });
  }

  //function ot find the user by it's email
  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  //function ot find the user by it's id
  public static getUserById(id: string){
    return prismaClient.user.findUnique({where:{id}})
  }

  //function to generate the JWT token of hte user was found
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await userService.getUserByEmail(email);

    if (!user) throw new Error("user not found "); // if the user dose not exist .

    const userSalt = user.salt;
    const userHashPassword = userService.generateHash(userSalt, password);

    if (userHashPassword! === password) {
      throw new Error("incorrect Password");
    }

    //generating token by JWT token
    const token = JWT.sign({ id: user.id, email: user.email }, secret);
    return token;
  }


  //decoding the Jwt token 
  public static decodeJWTToken (token :string) { //decoding the token for the authorization check 
    return JWT.verify(token , secret);
  }
}

export default userService;
