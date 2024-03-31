

export async function userHome(req,res){
    try {
    res.render('user/index')
        
    } catch (error) {
        res.render(error)
        
    }
}


export async function user_registration(req,res){
    try {
    res.render('user/user_registration')
        
    } catch (error) {
        
    }
}
