const router = require('express').Router();
const { auth, OTPauth } = require('../Authentication/auth.js');
const { allPosts, comment,currpost,currentPostComments } = require('../controller/postsController.js');
const {register, login,profile,createPost,editProfile,search, resetPass,searchUser, following,getFollowing} = require('../controller/userController.js');
const {addMessage,getAllMessage}=require('../controller/messagesController.js')

router.post('/register', register)
router.post('/login', login)

//Private Route
router.post('/profile',profile);
router.post('/create-post',auth,createPost)
router.post('/editProfile',auth,editProfile)
router.post('/comment',auth,comment)
router.post('/search',search)
router.post('/sendmail',OTPauth)
router.post('/resetPass',auth,resetPass)
router.post('/',auth,allPosts)
router.post('/currentPost', currpost)
router.post('/searchUser', searchUser)
router.post('/getcomment', currentPostComments)

router.post('/following',auth,following)
router.post('/getFollowing',getFollowing)
//messave Routes

router.post("/addmsg",addMessage);
router.post('/getmsg',getAllMessage);
module.exports=router; 

