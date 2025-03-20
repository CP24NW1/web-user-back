# ใช้ base image ของ Node.js
FROM node:20-alpine

# ตั้งค่า working directory ใน container
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json ไปยัง working directory
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดไปยัง working directory
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันจะทำงาน
EXPOSE 5000

# คำสั่งที่ใช้รันแอปพลิเคชัน
CMD ["npm", "run", "start:prod"]
