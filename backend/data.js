import bcrypt from 'bcryptjs';
import mongoose from "mongoose";

const data={
    users: [
        {
            name: 'Ruzsik Marton',
            email: 'r.marton5@gmail.com',
            password: bcrypt.hashSync('123456'),
            address: 'Golgota 19',
            city: 'Nové Zámky',
            isAdmin: true,
            isEmployee: true,
        },
        {
            name: 'Dr.John',
            email: 'employee@example.com',
            password: bcrypt.hashSync('123456'),
            address: 'Hradná 1',
            city: 'Komárno',
            isAdmin: false,
            isEmployee: true,
            salary: 2500,
            department: "Doctor"
        },
        {
            name: 'Rebeka',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            address: 'Komárňanská 10',
            city: 'Nové Zámky',
            isAdmin: false,
            isEmployee: false,
        }
    ]
}

export default data;