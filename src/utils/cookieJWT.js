const cookieExtractor = (req) => {
    const token = req.cookies.accessToken;

    return token ?? null
}

export default cookieExtractor;