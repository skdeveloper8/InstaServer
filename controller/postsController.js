const Post=require('../model/PostSchema.js')

module.exports.allPosts = async (req, res) => {
    console.log("REQ AT ALL P DATA");
    try {
      const limit = parseInt(req.body.limit) || 5;
      const page = parseInt(req.body.page) || 1;
  
      const skip = (page - 1) * limit;
  
      const data = await Post.find().skip(skip).limit(limit);
  
      res.json({
        success: true,
        message: "All Posts",
        data,
      });
    } catch (error) {
      console.error("Error in all posts:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

module.exports.comment=async (req,res)=>{
    console.log("req incmt");
    const {username,dp}=req.user.user;
    const {message,id}=req.body;
    console.log(username,dp,message,id);
    console.log("req at comment");
    try {
        const data=await Post.findByIdAndUpdate(id,{$push:{comments:{message,commentor:username,dp:dp || ""}}})
        if(data){
            res.json({
                success:true,
                message:"Commented successfully",
                data
            })
        }
    } catch (error) {
        console.log(error,"Error in Comment");
        res.json({
            success:false,
            message:error
        })
    }
}
module.exports.currentPostComments=async(req,res)=>{
    const {id}=req.body;
console.log(id,"Req at all cmts");
    if(!id){
        return res.status(400).json({
            success: false,
            message: "Invalid 'id' provided",
        });
    }
    const data=await Post.findById(id)
    if(data){
        return res.status(200).json({
            success: true,
            message: "ALL comments",
            data
        });
    }
}

module.exports.currpost = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid 'id' provided",
        });
    }

    try {
        const data = await Post.findById(id);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        res.json({
            success: true,
            message: "Post coming",
            data: data,
        });
    } catch (err) {
        console.log(err, "currpost error");
        res.status(500).json({
            success: false,
            message: "Error retrieving post",
            error: err.message,
        });
    }
};
