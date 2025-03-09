const checkUserInfo = () => {
    const userInfo = JSON.parse('persist:userInfo')

    const role = JSON.parse(userInfo.role)
    const avatar = JSON.parse(userInfo.avatar)

    if (!role || !avatar)
        return false
    return true
}

export { 
    checkUserInfo
};
