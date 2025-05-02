const notFound=(req, res, next)=>{
    res.status(404).json({ error: 'Invalid routes ' });
}

export default notFound;