import userService, { CreateUserPayload } from "../../services/user";


const queries = {
    getUserToken : async( _:any,payload : {email :string ;password :string}) => {
        const token = await userService.getUserToken({
            email:payload.email,
            password:payload.password,

        });
        return token ;
}
};
const mutations = {
    createUser: async(_:any,payload:CreateUserPayload )=>{
      const res = await userService.createUser(payload);
      return res.id;
    },
};

export const resolvers ={queries ,mutations}
