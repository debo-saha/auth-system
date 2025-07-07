import bcrypt from 'bcryptjs';
// const hashed = await bcrypt.hash('Admin@123', 10); // $2b$10$Ko8tsMfxd4crVn0dE6CZ7eyl7sVfaz2ewnGKinnxh4Dxl/IadydKK


const hashed = bcrypt.hashSync('User@0012', 10); // $2b$10$pLNmEHLq2cqmaF.rt4HP2OcKRyW5Ab3i1cfSIGy9JkRqa5Bx0mhMG
console.log(hashed);
