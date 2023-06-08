// const Booking = require('./models/Booking')
// const Category = require('./models/Category')
// const Member = require('./models/Member')
// const User = require('./models/User')
// const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://farhanyp:kwU7vLFZItO5MLH8@cluster1.3o3a3wr.mongodb.net/db_mern_staycation?retryWrites=true&w=majority');

// const dataBooking = [
//   {
//       bookingStartDate: '12-12-2020',
//       bookingEndDate: '12-12-2020',
//       invoice: "1232563",
//       itemId:{
//         _id: '646f1f3be86b986aea52fefe',
//         title: 'Village Angga',
//         price: 6,
//         duration: 2
//       },
//       total: 12,
//       memberId:'6470717934cc4b294309c7ec',
//       bankId:'646f1c7b18bb167dfeac0a48',
//       payments:{
//         proofPayment: "images/buktibayar.jpeg",
//         bankFrom: "BCA",
//         status: "Accept",
//         accountHolder: "ang"
//       }
      
//   },
// ];

// const dataMember = [
//   {
//       firstName: 'Farhan Yudha Pratama',
//       lastName: 'Yudha Pratama',
//       email: "farhan@gmail.com",
//       phoneNumber: "08523641225" 
//   },
// ];

// const dataCategory = [
//   {
//       _id: '123456',
//       name: 'Yudha Pratama',
//       itemId: [{_id: '456789'}]
//   },
// ];

// const dataUser = {
//   username: 'admin',
//   password: 'admin',
//   }

// Booking.create(dataBooking).then(res => console.log("Booking sudah masuk"))
// Member.create(dataMember).then(res => console.log("Member sudah masuk"))
// User.create(dataUser).then(res => console.log("User sudah masuk"))
