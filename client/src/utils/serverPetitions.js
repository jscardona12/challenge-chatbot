import * as axios from 'axios';

export const registerUser = (user)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('http://localhost:3030/users/register', user);
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

export const checkUsernameAvailability = (username) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('http://localhost:3030/users/usernameAvailable', {username});
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
}

export const login = (user) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post('http://localhost:3030/users/login', user);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
}

export const getUserId = ()=> {
    return new Promise((resolve, reject) => {
        try {
            resolve(localStorage.getItem('userid'));
        } catch (error) {
            reject(error);
        }
    });
}