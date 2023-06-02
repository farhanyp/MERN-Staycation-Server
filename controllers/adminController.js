const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Image = require('../models/Image')
const Item = require('../models/Item')
const Feature = require('../models/Feature')
const Activity = require('../models/Activity')
const User = require('../models/User')
const Booking = require('../models/Booking')
const Member = require('../models/Member')
const fs = require('fs-extra')
const path = require('path')
const bcrypt = require('bcryptjs')

module.exports = {
    
    viewSignIn: async (req,res) =>{
        try {
            
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus}
            if(req.session.user === undefined){
                res.render('index',{
                    alert: alert,
                    title: "Staycation | Login",
                })
            }else{
                res.redirect('/admin/dashboard')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/signin')
        }
    },
    actionSignin: async (req, res) => {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username: username})
            if(!user){
                req.flash('alertMessage', 'username atau password anda salah')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/signin')
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if(result){
                    req.session.user = user
                    res.redirect('/admin/booking')
                }else{
                    req.flash('alertMessage', 'username atau password anda salah')
                    req.flash('alertStatus', 'danger')
                    res.redirect('/admin/signin')
                }
            });
        } catch (error) {
            
        }
    },
    actionLogout: (req,res)=>{
        req.session.destroy()
        res.redirect('/admin/signin')
    },
    viewDashboard: async (req,res) => {
        try {
            console.log(req.sessionID)
            const member = await Member.find()
            const booking = await Booking.find()
            const item = await Item.find()
            res.render('admin/dashboard/view_dashboard.ejs',{
                title: "Staycation | Dashboard",
                user: req.session.user,
                member,
                booking,
                item
            })
        } catch (error) {
            res.redirect('/admin/dashboard')
        }
    },


    viewCategory: async (req,res) =>{
        const category = await Category.find({})
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = { message: alertMessage, status: alertStatus}
        res.render('admin/category/view_category.ejs',{
            category: category,
            alert: alert,
            title: "Staycation | Category",
            user: req.session.user
        })
    },
    addCategory: async (req, res) => {
        try{
            const { name } = req.body
            await Category.create({ name })
            req.flash('alertMessage', 'Success Add Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        }catch(error){
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category')
        }
    },
    editCategory: async (req,res) => {
        try {
            const { id, name} = req.body
            const category = await Category.findOne({_id:id})
            category.name = name
            category.save()
            req.flash('alertMessage', 'Success Update Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', '$error.status')
            res.redirect('/admin/category')
        }
    },
    deleteCategory: async (req,res)=> {
        try {
            const { id } = req.params
            const category = await Category.findOne({_id:id})
            await category.deleteOne()
            req.flash('alertMessage', 'Success Delete Category')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', '$error.status')
            res.redirect('/admin/category')
        }
    },

    
    viewBank: async (req, res) => {
        const bank = await Bank.find()
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {message: alertMessage, status: alertStatus}
        res.render('admin/bank/view_bank.ejs',{
            title: "Staycation | Bank",
            bank,
            alert,
            user: req.session.user
        })
    },
    addbank: async(req, res) => {
        try {
            const { nameBank, nomorRekening, name} = req.body
            await Bank.create({
                nameBank,
                nomorRekening,
                name,
                imageUrl: `images/${req.file.filename}`
            })
            req.flash('alertMessage', 'Success Add Bank')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    editBank: async (req, res) => {
        try {
            const {id, nameBank, nomorRekening, name} = req.body
            const bank = await Bank.findOne({_id: id})
            if(req.file == undefined){
                bank.nameBank = nameBank
                bank.nomorRekening = nomorRekening
                bank.name = name
                await bank.save()
                req.flash('alertMessage', 'Success Update Bank')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/bank')
            }else{
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
                bank.nameBank = nameBank
                bank.nomorRekening = nomorRekening
                bank.name = name
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save()
                req.flash('alertMessage', 'Success Update Bank')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/bank')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    deleteBank: async (req,res) => {
        try {
            const id = req.params.id
            const bank = await Bank.findOne({_id: id})
            await bank.deleteOne()
            req.flash('alertMessage', 'Success Delete Bank')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    viewItem: async (req, res) => {
        const item = await Item.find()
        .populate({path:'categoryId', select: 'id name'})
        .populate({path:'imageId', select: 'id imageUrl'})
        const category = await Category.find() 
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {message: alertMessage, status: alertStatus}
        res.render('admin/item/view_item.ejs',{
            title: "Staycation | Item",
            category: category,
            alert,
            item,
            action: "view",
            user: req.session.user
        })
    },
    addItem: async (req, res) => {
        try {
            const { categoryId, title, price, city, about} = req.body
            const image = req.files
            const category = await Category.findOne({_id: categoryId})
            const newItem ={
                categoryId: categoryId,
                title,
                price,
                city,
                description: about
            }
            const item = await Item.create(newItem)
            category.itemId.push({_id: item._id})
            await category.save()
    
            for(let index= 0; index < image.length; index++){
                const saveImage = await Image.create({
                    imageUrl: `images/${req.files[index].filename}`
                })
                item.imageId.push({_id: saveImage._id})
                await item.save()
            }
            req.flash('alertMessage', 'Success Add Item')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/item')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bank')
        }
    },
    showImageItem: async(req,res)=>{
        const {id} = req.params
        const item = await Item.findOne({_id: id})
        .populate({path:'imageId', select: 'id imageUrl'})
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const alert = {message: alertMessage, status: alertStatus}
        res.render('admin/item/view_item.ejs',{
            title: "Staycation | Show Image Item",
            alert,
            item,
            action: "view-image",
            user: req.session.user
        })
    },
    showEditItem: async(req,res)=>{
        try {
            const {id} = req.params
            const item = await Item.findOne({_id: id})
            .populate({path:'imageId', select: 'id imageUrl'})
            .populate({path:'categoryId', select: 'id name'})
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}
            res.render('admin/item/view_item.ejs',{
                title: "Staycation | Edit Item",
                alert,
                item,
                category,
                action: "edit",
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')
        }
    },
    editItem: async(req,res)=>{
        try {
            const { id } = req.params
            const item = await Item.findOne({_id: id})
            .populate({path:'imageId', select: 'id imageUrl'})
            const { title, price, city, categoryId, about } = req.body
            if(req.files.length > 0){
                for (let index = 0; index < item.imageId.length; index++) {
                    const imageUpdate = await Image.findOne({_id: item.imageId[index]._id})
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`))
                    imageUpdate.imageUrl = `images/${req.files[index].filename}`
                    await imageUpdate.save()
                }
                item.title = title
                item.price = price
                item.city = city
                item.categoryId = categoryId
                item.about = about
                await item.save()
                req.flash('alertMessage', 'Success Update Item')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/item')
            }else{
                item.title = title
                item.price = price
                item.city = city
                item.categoryId = categoryId
                item.about = about
                await item.save()
                req.flash('alertMessage', 'Success Update Item')
                req.flash('alertStatus', 'success')
                res.redirect('/admin/item')
            }            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item')    
        }
    },
    deleteItem: async (req,res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({_id: id}).populate({path: 'imageId', select:"id imageUrl"})
            for (let index = 0; index < item.imageId.length; index++) {
                const imageDelete = await Image.findOne({_id: item.imageId[index]})
                await fs.unlink(path.join(`public/${imageDelete.imageUrl}`))
                imageDelete.deleteOne()
            }
            item.deleteOne()
            req.flash('alertMessage', 'Success Update Item')
            req.flash('alertStatus', 'success')
            res.redirect('/admin/item')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/item') 
        }
    },

    viewDetailItem: async (req,res) => {
        const { itemId } = req.params
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}
            const feature = await Feature.find({itemId: itemId})
            const activity = await Activity.find({itemId: itemId})
            res.render('admin/item/detail_item/view_detail_item',{
                title: 'Staycation | Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`) 
        }
    },
    addFeature: async (req, res) => {
        const { name, qty, itemId} = req.body
        const item = await Item.findOne({_id: itemId})
        try {
            const feature = await Feature.create({
                name,
                qty,
                imageUrl: `images/${req.file.filename}`,
                itemId
            })
            item.featureId.push({_id: feature._id})
            await item.save()
            req.flash('alertMessage', 'Success Add Feature')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`) 
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)  
        }
    },
    editFeature: async (req,res) => {
        const { id, itemId, name, qty} = req.body
        const feature = await Feature.findOne({_id: id})
        try {
            if (req.file !== undefined){
                await fs.unlink(path.join(`public/${feature.imageUrl}`))
                feature.name = name
                feature.qty = qty
                feature.imageUrl = `images/${req.file.filename}`
                feature.save()
                req.flash('alertMessage', 'Success Add Feature')
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)             
            }else{
                feature.name = name
                feature.qty = qty
                feature.save()
                req.flash('alertMessage', 'Success Edit Feature')
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`) 
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)  
        }
    },
    deleteFeature: async(req,res) => {
        const {id, itemId} = req.params
        try {
            const feature = await Feature.findOne({_id: id})
            const item = await Item.findOne({_id: itemId}).populate('featureId')
            for (let index = 0; index < item.featureId.length; index++) {
                if(item.featureId[index]._id.toString() === feature._id.toString()){                    
                    feature.deleteOne({_id: itemId})
                    item.save()
                    await Item.updateOne(
                        { _id: itemId},
                        {$pull: {featureId: { $in: [id]}}}
                    )
                }
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`))
            req.flash('alertMessage', 'Success Delete Feature')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`) 
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)  
        }
    },
    addActivity: async (req, res) => {
        const { name, type, itemId} = req.body
        console.log({
            name, type,itemId
        })
        const item = await Item.findOne({_id: itemId})
        try {
            const activity = await Activity.create({
                name,
                type,
                imageUrl: `images/${req.file.filename}`,
                itemId
            })
            item.activityId.push({_id: activity._id})
            await item.save()
            req.flash('alertMessage', 'Success Add Activity')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`) 
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)  
        }
    },
    editActivity: async (req,res) => {
        const { id, itemId, name, qty} = req.body
        const activity = await Activity.findOne({_id: id})
        try {
            if (req.file !== undefined){
                await fs.unlink(path.join(`public/${activity.imageUrl}`))
                activity.name = name
                activity.qty = qty
                activity.imageUrl = `images/${req.file.filename}`
                activity.save()
                req.flash('alertMessage', 'Success Add activity')
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`)             
            }else{
                activity.name = name
                activity.qty = qty
                activity.save()
                req.flash('alertMessage', 'Success Edit activity')
                req.flash('alertStatus', 'success')
                res.redirect(`/admin/item/show-detail-item/${itemId}`) 
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)  
        }
    },
    deleteActivity: async(req,res) => {
        const {id, itemId} = req.params
        try {
            const activity = await Activity.findOne({_id: id})
            const item = await Item.findOne({_id: itemId}).populate('featureId')
            for (let index = 0; index < item.activityId.length; index++) {
                if(item.activityId[index]._id.toString() === activity._id.toString()){                    
                    activity.deleteOne({_id: itemId})
                    item.save()
                    await Item.updateOne(
                        { _id: itemId},
                        {$pull: {activityId: { $in: [id]}}}
                    )
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`))
            req.flash('alertMessage', 'Success Delete activity')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/item/show-detail-item/${itemId}`) 
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`)  
        }
    },
    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find().populate('memberId').populate('bankId')
            res.render('admin/booking/view_booking.ejs',{
                title: "Staycation | Booking",
                user: req.session.user,
                booking
            })
            
        } catch (error) {
            res.redirect('/admin/booking')
        }
    },
    showDetailBooking: async (req, res) => {
        const { id } = req.params
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = {message: alertMessage, status: alertStatus}
            const booking = await Booking.findOne({_id: id}).populate('memberId').populate('bankId')
            console.log(booking)
            res.render('admin/booking/show_detail_booking.ejs',{
                title: "Staycation | Detail Booking",
                user: req.session.user,
                booking,
                alert
            })
            
        } catch (error) {
            console.log(error)
            res.redirect('/admin/booking')
        }
    },

    actionConfirmation: async (req,res) => {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({_id: id})
            booking.payments.status = "Accept"
            await booking.save()
            req.flash('alertMessage', 'Success Confirmation Pembayaran')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    },

    actionReject: async (req,res) => {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({_id: id})
            booking.payments.status = "Reject"
            await booking.save()
            req.flash('alertMessage', 'Success Reject Pembayaran')
            req.flash('alertStatus', 'success')
            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    }

}