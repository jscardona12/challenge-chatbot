import * as axios from 'axios';

export const registerUser = (user)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('http://localhost:3030/register', user);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
};

export const saveUserIdInLS = (key,value)=>{
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(key, value);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
};