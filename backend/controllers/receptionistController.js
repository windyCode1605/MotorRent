const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getReceptionists = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT receptionist_id, full_name, email, phone_number, job_title, created_at, updated_at FROM receptionist'
        );
        res.json(rows);
    } catch (error) {
        console.error("Lỗi lấy dữ liệu nhân viên: ", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};



exports.createReceptionist = async (req, res) => {
    try {
        const { full_name, email, phone_number, password, job_title } = req.body;

        if (!full_name || !email || !phone_number || !password || !job_title) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }


        const [existingAccount] = await db.query(
            'SELECT * FROM accounts WHERE email = ?',
            [email]
        );
        if (existingAccount.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [accountResult] = await db.query(
            'INSERT INTO accounts (email, password_hash, role, is_active) VALUES (?, ?, ?, ?)',
            [email, password_hash, 'staff', 1]
        );

        const account_id = accountResult.insertId;

        const [receptionistResult] = await db.query(
            'INSERT INTO receptionist (full_name, email, phone_number, account_id, job_title) VALUES (?, ?, ?, ?, ?)',
            [full_name, email, phone_number, account_id, job_title]
        );

        res.status(201).json({
            message: 'Thêm nhân viên thành công',
            receptionist_id: receptionistResult.insertId,
            account_id
        });
    } catch (error) {
        console.error('Lỗi tạo nhân viên: ', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateReceptionist = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone_number, job_title, password } = req.body;
        const [existing] = await db.query(
            'SELECT * FROM receptionist WHERE receptionist_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        const receptionist = existing[0];
        const [duplicates] = await db.query(
            'SELECT * FROM receptionist WHERE (email = ? OR phone_number = ?) AND receptionist_id != ?',
            [email, phone_number, id]
        );
        if (duplicates.length > 0) {
            return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
        }

        await db.query(
            'UPDATE receptionist SET full_name = ?, email = ?, phone_number = ?, job_title = ? WHERE receptionist_id = ?',
            [full_name, email, phone_number, job_title, id]
        );
        let accountUpdateQuery = 'UPDATE accounts SET email = ?';
        const params = [email];

        if (password) {
            const password_hash = await bcrypt.hash(password, 10);
            accountUpdateQuery += ', password_hash = ?';
            params.push(password_hash);
        }

        accountUpdateQuery += ' WHERE account_id = ?';
        params.push(receptionist.account_id);

        await db.query(accountUpdateQuery, params);

        res.json({ message: 'Cập nhật thông tin nhân viên thành công' });
    } catch (error) {
        console.error('Lỗi cập nhật nhân viên: ', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


exports.deleteReceptionist = async (req, res) => {
    try {
        const { id } = req.params;


        const [existing] = await db.query(
            'SELECT * FROM receptionist WHERE receptionist_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        await db.query('DELETE FROM receptionist WHERE receptionist_id = ?', [id]);

        res.json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
        console.error("Lỗi xóa nhân viên: ", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};