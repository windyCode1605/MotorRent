    const db = require('../config/db');
    const promiseDb = require('../config/promiseDb');


    exports.getAllCustomers = async (req, res) => {
        db.query('SELECT * FROM customers', (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Lỗi truy vấn dữ liệu.');
            } else {
                res.json(results);
            }
        });
    }

    exports.getCustomerByAccountId = (req, res) => {
        const { account_id } = req.user.account_id; // Lấy account_id từ token đã xác thực
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

