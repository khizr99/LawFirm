const express = require('express');
const router = express.Router();
const lawfirms = require('../controllers/lawfirms');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateLawfirm} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});


router.route('/')
        .get( catchAsync(lawfirms.index))
        .post( isLoggedIn ,upload.array('image') ,validateLawfirm,  catchAsync(lawfirms.createLawfirm))
        

router.get('/new', isLoggedIn , lawfirms.renderNewForm);

router.route('/:id')
        .get( catchAsync(lawfirms.showLawfirm))
        .put( isLoggedIn, isAuthor, upload.array('image'), validateLawfirm, catchAsync(lawfirms.updateLawfirm))
        .delete( isLoggedIn, isAuthor, catchAsync(lawfirms.deleteLawfirm))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(lawfirms.renderEditForm));

module.exports = router;