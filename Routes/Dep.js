const router = require('express').Router();
const supabase = require('../supaBaseClient');


router.post('/add-department', async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name || !description) {
            return res.status(400).json({ msg: 'All fields are required' });
        }
        const { data, error } = await supabase
            .from('departments')
            .insert([{ name, description }]);
        if (error) {
            throw error;
        }
        return res.status(201).json({ msg: 'Department added successfully', data: data });
    } catch (error) {
        console.error('Error adding department:', error.message);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;