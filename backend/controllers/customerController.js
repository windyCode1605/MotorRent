const db = require('../config/db');
const promiseDb = require('../config/promiseDb');


exports.getAllCustomers = async (req, res) => {
    try {
        const [results] = await promiseDb.query('SELECT * FROM customers');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi truy vấn dữ liệu.');
    }
};


exports.getCustomerByAccountId = (req, res) => {
    const { account_id } = req.user.account_id; 
    if (!account_id) {
        return res.status(400).json({ message: "Không tìm thấy account_id để lấy thông tin khách hàng" });
    }
    const sql = "SELECT * FROM customers WHERE account_id = ?";

    promiseDb.query(sql, [account_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi máy chủ ❌" });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy khách 🤷‍♂️" });
        }

        const customers = result[0];
        return res.status(200).json({ success: true, customers });
    });
};

exports.getCustomerById = ( req, res) => {
    const { customer_id } = req.params;
    const sql = "SELECT * FROM customers WHERE customer_id = ?";

    promiseDb.query(sql, [customer_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi máy chủ " });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng " });
        }

        const customer = result[0];
        return res.status(200).json({ success: true, customer });
    });
};

exports.updateCustomer = async (req, res) => {
    const { customer_id } = req.params;
    const updateData = req.body;
    
    try {
        const updateFields = [];
        const values = [];
        
        // Build dynamic update query
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                updateFields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
        }
        
        values.push(customer_id); // Add customer_id for WHERE clause
        
        const sql = `UPDATE customers SET ${updateFields.join(', ')} WHERE customer_id = ?`;
        const [result] = await promiseDb.execute(sql, values);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Cập nhật thông tin khách hàng thành công" 
        });
    } catch (error) {
        console.error("Lỗi cập nhật khách hàng:", error);
        res.status(500).json({ 
            message: "Lỗi server khi cập nhật thông tin khách hàng",
            error: error.message 
        });
    }
};

exports.deleteCustomer = async (req, res) => {
    const { customer_id } = req.params;
    
    try {
        const [activeRentals] = await promiseDb.execute(
            'SELECT COUNT(*) as count FROM rental WHERE customer_id = ? AND status IN ("Chờ xác nhận","Đã xác nhận","Đã nhận xe")',
            [customer_id]
        );
        
        if (activeRentals[0].count > 0) {
            return res.status(400).json({ 
                message: "Không thể xóa khách hàng có đơn thuê xe đang hoạt động" 
            });
        }
        
        // Delete customer
        const [result] = await promiseDb.execute(
            'DELETE FROM customers WHERE customer_id = ?',
            [customer_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng" });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Xóa khách hàng thành công" 
        });
    } catch (error) {
        console.error("Lỗi xóa khách hàng:", error);
        res.status(500).json({ 
            message: "Lỗi server khi xóa khách hàng",
            error: error.message 
        });
    }
};
