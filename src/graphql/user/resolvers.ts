import userService, { CreateUserPayload } from "../../services/user";


const queries = {
    getUserToken : async( _:any,payload : {email :string ;password :string}) => {
        const token = await userService.getUserToken({
            email:payload.email,
            password:payload.password,

        });
        return token ;
},
getCurrentUserLoginInfo : async(_: any ,parameters: any , context : any )=> {

    if(context && context.user){
        const id =context.user.id; // getting the id of the current user 
        const user = await userService.getUserById(id); // using the prisma getting the all detail of the current user  except password and the salt because it is not present i th schema
        return user ;
    }
    throw new Error('dont know you');
}
};

const mutations = {
    createUser: async(_:any,payload:CreateUserPayload )=>{
      const res = await userService.createUser(payload);
      return res.id;
    },

};




export const resolvers ={queries ,mutations}
