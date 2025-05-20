const promiseDb = require('../config/promiseDb');


exports.getAllContracts = async (req, res) => {
    try {
        const [results] = await promiseDb.query('SELECT * FROM rental');
        res.json(results);
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
}
exports.getContractById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await promiseDb.query('SELECT * FROM rental WHERE rental_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).send('Không tìm thấy hợp đồng.');
        }
        res.json(results[0]);
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
}
exports.createContract = async (req, res) => {
    const { customer_id, vehicle_id, rental_date, return_date, total_price } = req.body;
    try {
        const [results] = await promiseDb.query('INSERT INTO rental (customer_id, vehicle_id, rental_date, return_date, total_price) VALUES (?, ?, ?, ?, ?)', [customer_id, vehicle_id, rental_date, return_date, total_price]);
        res.status(201).json({ id: results.insertId });
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
}
exports.updateContract = async (req, res) => {
    const { id } = req.params;
    const { customer_id, vehicle_id, rental_date, return_date, total_price } = req.body;
    try {
        const [results] = await promiseDb.query('UPDATE rental SET customer_id = ?, vehicle_id = ?, rental_date = ?, return_date = ?, total_price = ? WHERE rental_id = ?', [customer_id, vehicle_id, rental_date, return_date, total_price, id]);
        if (results.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy hợp đồng.');
        }
        res.json({ message: 'Hợp đồng đã được cập nhật.' });
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
}

exports.deleteContract = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await promiseDb.query('DELETE FROM rental WHERE rental_id = ?', [id]);
        if (results.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy hợp đồng.');
        }
        res.json({ message: 'Hợp đồng đã được xóa.' });
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
}
