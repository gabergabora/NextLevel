const express = require('express')
const router = express.Router()
const User = require('../models/User')
const multer = require('multer')
const Post = require('../models/Post')
const moment = require('moment')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/upload/images")
    },

    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
})

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 1024 * 1024 * 1000 * 1000,
    }
})


router.get("/admin/new", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const posts = await Post.find({ isAccept: false }).sort({ Date: -1 })
        if(user) {
            if(user.isAdmin == true){
                res.render("admin/post/new", {
                    user: user,
                    posts: posts,
                    suc: req.flash("admin-accept-post"),
                    del: req.flash("admin-delete-post"),
                })
            } else {
                res.redirect("/")
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Post.findOne({ _id: req.params.id })
        const check = await User.findOne({ _id: userID })

        var filter = false

        if(user){
            function checkComment(comment) {
                return comment == req.params.id
            }
    
            if (check.commented.find(checkComment) !== undefined) {
                filter = true
            }
        }
        
        if(user.isAdmin == true){
            res.render("admin/post/get", {
                user: user,
                data: data,
                filter: filter,
                err: req.flash("coment-err"),
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.put("/admin/accept/:id", async(req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAdmin == true){
            await Post.updateOne({ _id: req.params.id }, {
                $set: {
                    isAccept: true,
                }
            })

            req.flash("admin-accept-post", "success")
            res.redirect("/post/admin/new")
        }
    } catch (error) {
        
    }
})

router.delete("/admin/delete/:id", async(req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if(user.isAdmin == true){
            await Post.deleteOne({ _id: req.params.id })

            req.flash("admin-delete-post", "success")
            res.redirect("/post/admin/new")
        }
    } catch (error) {
        
    }
})

router.get("/new", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            res.render("post/new", {
                user: user,
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/new", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        const { title, des } = req.body
        if (user) {
            if (typeof req.file === "undefined") {
                const newPost = [
                    new Post({
                        title: title,
                        des: des,
                        authorName: user.name,
                        authorID: user.id,
                        Date: moment().locale("ar-kw").format("l")
                    })
                ]
                newPost.forEach((data) => {
                    data.save()
                })

                req.flash("post-accept", " success ")
                res.redirect("/profile/posts")

            } else {
                const newPost = [
                    new Post({
                        title: title,
                        des: des,
                        authorName: user.name,
                        authorID: user.id,
                        image: req.file.filename,
                        Date: moment().locale("ar-kw").format("l")
                    })
                ]

                newPost.forEach((data) => {
                    data.save()
                })

                req.flash("post-accept", " success ")
                res.redirect("/profile")
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find({ isAccept: true }).sort({ Date: -1 }).limit(50)
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        res.render("post/posts", {
            posts: posts,
            user: user,
        })
    } catch (error) {
        console.log();
    }
})

router.get("/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Post.findOne({ _id: req.params.id })
        const check = await User.findOne({ _id: userID })

        var filter = false

        if(user){
            function checkComment(comment) {
                return comment == req.params.id
            }
    
            if (check.commented.find(checkComment) !== undefined) {
                filter = true
            }
        }
        res.render("post/get", {
            user: user,
            data: data,
            filter: filter,
            err: req.flash("coment-err"),
        })

    } catch (error) {
        console.log(error);
    }
})

router.put("/add/comment/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const check = await User.findOne({ _id: userID })

        var filter = false

        function checkComment(comment) {
            return comment == req.params.id
        }

        if (check.commented.find(checkComment) !== undefined) {
            filter = true
        }
        if (user) {
            if (req.body.comment == "") {
                req.flash("coment-err", " error ")
                res.redirect("back")
            } else {
                if (filter == false) {
                    await Post.updateOne({ _id: req.params.id }, {
                        $push: {
                            comments: {
                                comment: req.body.comment,
                                name: user.name,
                                date: `${moment().locale("ar-kw").format("l")}`,
                                authorID: user.id
                            }
                        }
                    })

                    await User.updateOne({ _id: userID }, {
                        $push: {
                            commented: [req.params.id]
                        }
                    })

                    res.redirect(`/post/get/${req.params.id}`)
                }
            }
        } else {
            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/delete/comment/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user) {
            await Post.updateOne({ _id: req.params.id }, {
                $pull: {
                    comments: {
                        authorID: user.id
                    }
                }
            })

            await User.updateOne({ _id: userID }, {
                $pull: {
                    commented: [req.params.id]
                }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/delete/admin/comment/:id/:name/:authorID", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { name, authorID} = req.params

        if (user) {
            await Post.updateOne({ _id: req.params.id }, {
                $pull: {
                    comments: {
                        authorID: authorID,
                        name: name,
                    }
                }
            })

            await User.updateOne({ _id: authorID }, {
                $pull: {
                    commented: [req.params.id]
                }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router