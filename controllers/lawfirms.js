const Lawfirm = require('../models/lawfirm');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res)=>{
    const lawfirms = await Lawfirm.find({});
    res.render('lawfirms/index', {lawfirms});
    }

  module.exports.renderNewForm = (req,res) => {
        res.render('lawfirms/new');
        }

  module.exports.createLawfirm  =  async (req, res, next ) => {
            // if(!req.body.lawfirm) throw new ExpressError('Invalid lawfirm data', 400);
        const geoData = await geocoder.forwardGeocode({
                query: req.body.lawfirm.location,
                limit:1
            }).send()
            const lawfirm = new Lawfirm(req.body.lawfirm) ;
            lawfirm.geometry = geoData.body.features[0].geometry;
            lawfirm.images = req.files.map(f => ({url: f.path, filename: f.filename}));
            lawfirm.author = req.user._id;
            await lawfirm.save();
            console.log(lawfirm);
            req.flash('success', 'Successfully made a new lawfirm!');
            res.redirect(`/lawfirms/${lawfirm._id}`); 
        }

     module.exports.showLawfirm = async (req, res, next)=>{
            const {id} = req.params;
            const lawfirm = await Lawfirm.findById(id).populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            }).populate('author');
            if(!lawfirm){
                req.flash('error', 'Cannot find that lawfirm');
                return res.redirect('/lawfirms');
            }
            res.render('lawfirms/show', {lawfirm});
        }

     module.exports.renderEditForm   = async (req, res)=>{
            const {id} = req.params;
            const lawfirm = await Lawfirm.findById(id);
            if(!lawfirm){
                req.flash('error', 'Cannot find that lawfirm');
                return res.redirect('/lawfirms');
            }
        
            // if(!lawfirm.author.equals(req.user._id)){
            //     req.flash('error','You do not have permission to do that');
            //     return res.redirect(`/lawfirms/${id}`);
            // }
        
            res.render('lawfirms/edit', {lawfirm});
        }

    module.exports.updateLawfirm = async(req,res)=>{
        const {id} = req.params;
        console.log(req.body);
         const lawfirm = await Lawfirm.findByIdAndUpdate(id, {...req.body.lawfirm});
         const imgs = (req.files.map(f => ({url: f.path, filename: f.filename})));
         lawfirm.images.push(...imgs);
        await lawfirm.save();
        if(req.body.deleteImages){
           for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
           } 
           await lawfirm.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
           console.log(lawfirm);
        }
        req.flash('success', 'Successfully update the lawfirm!');
        res.redirect(`/lawfirms/${lawfirm._id}`);
    }

    module.exports.deleteLawfirm = async(req,res) => {

        const {id} = req.params;
    await Lawfirm.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted lawfirm!');
    res.redirect(`/lawfirms`);
    
    }