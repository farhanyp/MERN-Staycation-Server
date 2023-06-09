const Booking = require('../models/Booking')
const Activity = require('../models/Activity')
const Item = require('../models/Item')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Member = require('../models/Member')

module.exports = {
    landingPage: async (req,res) => {
        try {
            const Travelers = await Booking.find()
            const Treasure = await Activity.find()
            const City = await Item.find()
            // const item = await Item.find().sort({sumBooking: -1})
    
            const mostpicked = await Item.find()
            .select('_id title price country city unit imageId')
            .limit(5)
            .populate({path: 'imageId', select:'id imageUrl'})
    
            const category = await Category.find()
            .select('id name')
            .limit(3)
            .populate({
                path:'itemId', 
                select:'_id title isPopular sumBooking imageId',
                perDocumentLimit: 4,
                option: { sort: { sumBooking: -1 }},
                populate: {
                    path: 'imageId', 
                    select:'imageUrl',
                    perDocumentLimit: 1
                }
            })

            const testimonial= {
                _id: "asd1293uasdads1",
                imageUrl: "/images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.80,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
              }
    
            for (let i = 0; i < category.length; i++) {
                for (let j = 0; j < category[i].itemId.length; j++) {
                    const item = await Item.findOne({_id: category[i].itemId[j]._id})
                    item.isPopular = false
                    await item.save()
                    if(category[i].itemId[0] === category[i].itemId[j]){
                        item.isPopular = true
                        await item.save()
                    }      
                }
            }
    
            res.header('Access-Control-Allow-Origin', "*");
            // res.header('Access-Control-Allow-Methods', 'POST');
            // res.header("Access-Control-Allow-Headers", "accept, content-type");
            // res.header("Access-Control-Max-Age", "1728000");
            res.status(200).json({

                message: "Hello, World!"
                // hero:{
                //     Travelers: Travelers.length,
                //     Treasure: Treasure.length,
                //     City: City.length
                // },
                // mostpicked,
                // category,
                // testimonial
            })

        } catch (error) {
            res.status(200).json({ message: "Internal Sever Error"})
        }
    },

    detailPage: async (req,res) => {
        const { id } = req.params
        const item = await Item.findOne({_id: id})
        .populate({path: 'imageId', select: 'imageUrl'})
        .populate({path: 'featureId', select: 'name qty imageUrl'})
        .populate({path: 'activityId', select: 'name type imageUrl'})
        
        const bank = await Bank.find()

        const testimonial= {
            _id: "asd1293uasdads1",
            imageUrl: "/images/testimonial1.jpg",
            name: "Happy Family",
            rate: 4.80,
            content: "What a great trip with my family and I should try again next time soon ...",
            familyName: "Angga",
            familyOccupation: "Product Designer"
          }
        
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header("Access-Control-Allow-Headers", "accept, content-type");
        res.header("Access-Control-Max-Age", "1728000");
        res.status(200).json({
            ...item._doc,
            bank,
            testimonial
        })
    },

    bookingPage: async(req,res) => {
        try {
            const { 
                idItem, 
                duration, 
                price, 
                bookingStartDate, 
                bookingEndDate, 
                firstName, 
                lastName, 
                email, 
                phoneNumber, 
                accountHolder, 
                bankFrom
            } = req.body
            if(!req.file){
                return res.status(404).json({message: "Image not Found"})
            }
            if(
                idItem === undefined, 
                duration === undefined, 
                price === undefined, 
                bookingStartDate === undefined, 
                bookingEndDate === undefined, 
                firstName === undefined, 
                lastName === undefined, 
                email === undefined, 
                phoneNumber === undefined, 
                accountHolder === undefined, 
                bankFrom === undefined
            ){
                return res.status(404).json({message: "Lengkapi semua data"})
            }


            const item = await Item.findOne({_id: idItem})
            if(!item){
                return res.status(404).json({message: "Item Not Found"})    
            }
            item.sumBooking += 1
            await item.save()

            let total = item.price * duration
            let tax = total*0.10

            const invoice = Math.floor(100000 + Math.random() * 900000)

            const member = await Member.create({
                firstName,
                lastName,
                email,
                phoneNumber,
                
            })

            const newBooking = {
                invoice,
                bookingStartDate,
                bookingEndDate,
                total: total += tax,
                itemId: {
                    _id: item.id,
                    title: item.title,
                    price: item.price,
                    duration: duration,
                },
                memberId: member.id,
                payments: {
                    proofPayment: `images/${req.file.filename}`,
                    bankFrom,
                    accountHolder,
                    status: 'Procces'
                }
            }
            
            const booking = await Booking.create(newBooking)            
        
            res.header('Access-Control-Allow-Origin', "*");
            res.header('Access-Control-Allow-Methods', 'POST');
            res.header("Access-Control-Allow-Headers", "accept, content-type");
            res.header("Access-Control-Max-Age", "1728000");
            return res.status(201).json({message: "Sukses Booking", booking})
            
        } catch (error) {
            console.log(error)
        }
    }
}